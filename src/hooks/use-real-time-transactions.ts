import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  date: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  fromAccount?: string;
  toAccount?: string;
  account_id?: string;
}

export function useRealTimeTransactions(initialTransactions: Transaction[] = []) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const { user } = useUserContext();
  
  // Load transactions on mount
  useEffect(() => {
    // If we have initial transactions, use them
    if (initialTransactions.length > 0) {
      setTransactions(initialTransactions);
    }
    
    // Fetch transactions from database
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });
          
        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }
        
        if (data) {
          // Transform the database data to match our Transaction interface
          const formattedData: Transaction[] = data.map(item => ({
            id: item.id,
            date: item.date || new Date().toISOString(),
            type: (item.type as "deposit" | "withdrawal" | "transfer"),
            amount: Number(item.amount),
            // Since description might not exist in the database schema, provide a fallback
            description: item.type || "",
            status: (item.status as "completed" | "pending" | "failed"),
            account_id: item.account_id,
          }));
          
          setTransactions(formattedData);
        }
      } catch (error) {
        console.error('Error in transaction fetch:', error);
      }
    };
    
    fetchTransactions();
  }, [initialTransactions, user]);
  
  // Subscribe to real-time changes
  useEffect(() => {
    if (!user) return;
    
    // Set up real-time subscription
    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            const newTransaction = payload.new as any;
            
            // Format the new transaction to match our interface
            const formattedTransaction: Transaction = {
              id: newTransaction.id,
              date: newTransaction.date || new Date().toISOString(),
              type: (newTransaction.type as "deposit" | "withdrawal" | "transfer"),
              amount: Number(newTransaction.amount),
              // Since description might not exist in the database schema, provide a fallback
              description: newTransaction.type || "",
              status: (newTransaction.status as "completed" | "pending" | "failed"),
              account_id: newTransaction.account_id,
            };
            
            // Add to our transactions state
            setTransactions(prev => [formattedTransaction, ...prev]);
            
            // Show a toast notification
            toast({
              title: "New Transaction",
              description: `${formattedTransaction.type.charAt(0).toUpperCase() + formattedTransaction.type.slice(1)} of ₹${formattedTransaction.amount} was ${formattedTransaction.status}`
            });
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedTransaction = payload.new as any;
            
            // Update the transaction in our state
            setTransactions(prev => 
              prev.map(t => 
                t.id === updatedTransaction.id 
                  ? {
                      ...t,
                      status: updatedTransaction.status as "completed" | "pending" | "failed",
                      date: updatedTransaction.date || t.date,
                      // Keep the existing description since it might not be in the database
                      description: t.description,
                    } 
                  : t
              )
            );
            
            // Show a toast notification
            toast({
              title: "Transaction Updated",
              description: `Transaction status updated to ${updatedTransaction.status}`
            });
          }
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Function to add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, "id" | "date">) => {
    try {
      // First add to local state for instant feedback
      const tempId = `temp-${Date.now()}`;
      const newTransaction: Transaction = {
        ...transaction,
        id: tempId,
        date: new Date().toISOString(),
      };
      
      // Update local state first for immediate feedback
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Then save to database
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          type: transaction.type,
          amount: transaction.amount,
          // We'll handle description separately since it might not exist in the schema
          status: transaction.status,
          account_id: transaction.account_id || 'default-account',
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error adding transaction:', error);
        
        // Remove the temporary transaction if save failed
        setTransactions(prev => prev.filter(t => t.id !== tempId));
        
        // Show error toast
        toast({
          title: "Transaction Failed",
          description: "Could not save your transaction",
          variant: "destructive"
        });
        return null;
      }
      
      // Replace temporary transaction with the real one
      const savedTransaction: Transaction = {
        id: data.id,
        date: data.date || new Date().toISOString(),
        type: data.type as "deposit" | "withdrawal" | "transfer",
        amount: Number(data.amount),
        // Use type as fallback since description might not exist in database
        description: data.type || "",
        status: data.status as "completed" | "pending" | "failed",
        account_id: data.account_id,
      };
      
      setTransactions(prev => 
        prev.map(t => t.id === tempId ? savedTransaction : t)
      );
      
      return savedTransaction;
    } catch (error) {
      console.error('Error in addTransaction:', error);
      return null;
    }
  };
  
  return {
    transactions,
    addTransaction,
  };
}
