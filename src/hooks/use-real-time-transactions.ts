
import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { Transaction, NewTransactionInput } from "@/types/transaction.types";
import { fetchTransactions, addTransactionToDb } from "@/services/transaction.service";
import { useTransactionSubscription } from "@/hooks/use-transaction-subscription";

export { type Transaction } from "@/types/transaction.types";

export function useRealTimeTransactions(initialTransactions: Transaction[] = []) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const { user } = useUserContext();
  
  // Load transactions on mount
  useEffect(() => {
    // If we have initial transactions, use them
    if (initialTransactions.length > 0) {
      setTransactions(initialTransactions);
    }
    
    // Fetch transactions from database only if they weren't provided
    if (initialTransactions.length === 0 && user) {
      fetchTransactions().then(data => {
        if (data && data.length > 0) {
          setTransactions(data);
        }
      });
    }
  }, [initialTransactions, user]);
  
  // Set up real-time subscription handlers
  const subscriptionHandlers = {
    onInsert: (newTransaction: Transaction) => {
      setTransactions(prev => [newTransaction, ...prev]);
    },
    onUpdate: (id: string, updatedTransaction: Partial<Transaction>) => {
      setTransactions(prev => 
        prev.map(t => 
          t.id === id 
            ? {
                ...t,
                status: updatedTransaction.status as "completed" | "pending" | "failed" || t.status,
                date: updatedTransaction.date || t.date,
                description: t.description || updatedTransaction.type, // Keep existing description or use type
                fromAccount: updatedTransaction.fromAccount || t.fromAccount,
                toAccount: updatedTransaction.toAccount || t.toAccount,
              } 
            : t
        )
      );
    }
  };
  
  // Subscribe to real-time updates
  useTransactionSubscription(subscriptionHandlers, user?.id);

  // Function to add a new transaction
  const addTransaction = async (transaction: NewTransactionInput) => {
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
      const savedTransaction = await addTransactionToDb(transaction);
      
      if (savedTransaction) {
        // Replace temporary transaction with the real one
        setTransactions(prev => 
          prev.map(t => t.id === tempId ? savedTransaction : t)
        );
        
        return savedTransaction;
      } else {
        // Remove the temporary transaction if save failed
        setTransactions(prev => prev.filter(t => t.id !== tempId));
        return null;
      }
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
