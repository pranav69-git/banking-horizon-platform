
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  date: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  description?: string;
  status: "completed" | "pending" | "failed";
  fromAccount?: string;
  toAccount?: string;
  account_id?: string;
}

// Define the database transaction type to match what's in Supabase
interface DbTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
  account_id: string;
  from_account?: string;
  to_account?: string;
  description?: string;
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
          const formattedData: Transaction[] = data.map((item: DbTransaction) => ({
            id: item.id,
            date: item.date || new Date().toISOString(),
            type: item.type as "deposit" | "withdrawal" | "transfer",
            amount: Number(item.amount),
            description: item.type, // Use type as description since description column doesn't exist
            status: item.status as "completed" | "pending" | "failed",
            account_id: item.account_id,
            fromAccount: item.from_account,
            toAccount: item.to_account,
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
            const newTransaction = payload.new as DbTransaction;
            
            // Format the new transaction to match our interface
            const formattedTransaction: Transaction = {
              id: newTransaction.id,
              date: newTransaction.date || new Date().toISOString(),
              type: newTransaction.type as "deposit" | "withdrawal" | "transfer",
              amount: Number(newTransaction.amount),
              description: newTransaction.type, // Use type as description
              status: newTransaction.status as "completed" | "pending" | "failed",
              account_id: newTransaction.account_id,
              fromAccount: newTransaction.from_account,
              toAccount: newTransaction.to_account,
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
            const updatedTransaction = payload.new as DbTransaction;
            
            // Update the transaction in our state
            setTransactions(prev => 
              prev.map(t => 
                t.id === updatedTransaction.id 
                  ? {
                      ...t,
                      status: updatedTransaction.status as "completed" | "pending" | "failed",
                      date: updatedTransaction.date || t.date,
                      description: t.description || updatedTransaction.type, // Keep existing description or use type
                      fromAccount: updatedTransaction.from_account || t.fromAccount,
                      toAccount: updatedTransaction.to_account || t.toAccount,
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
      
      // Prepare data for insert - map our interface to DB schema
      const dbTransaction = {
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        account_id: transaction.account_id || 'default-account',
        from_account: transaction.fromAccount,
        to_account: transaction.toAccount,
        // Remove description field since it doesn't exist in the database schema
      };
        
      // Then save to database
      const { data, error } = await supabase
        .from('transactions')
        .insert(dbTransaction)
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
      
      // Type assertion to ensure data has all properties we need
      const dbData = data as DbTransaction;
      
      // Replace temporary transaction with the real one
      const savedTransaction: Transaction = {
        id: dbData.id,
        date: dbData.date || new Date().toISOString(),
        type: dbData.type as "deposit" | "withdrawal" | "transfer",
        amount: Number(dbData.amount),
        description: dbData.type, // Use type as description
        status: dbData.status as "completed" | "pending" | "failed",
        account_id: dbData.account_id,
        fromAccount: dbData.from_account,
        toAccount: dbData.to_account,
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
