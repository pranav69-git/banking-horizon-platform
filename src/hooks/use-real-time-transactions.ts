
import { useState, useEffect } from 'react';
import { fetchTransactions, addTransactionToDb } from '@/services/transaction.service';
import { Transaction, NewTransactionInput } from '@/types/transaction.types';

export { Transaction }; // Export Transaction type from transaction.types

export const useRealTimeTransactions = (
  initialTransactions: Transaction[] = [], 
  showToasts: boolean = true
) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTransactions();
        setTransactions(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading transactions:', err);
        setError(err?.message || 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Function to add a new transaction
  const addTransaction = async (transaction: NewTransactionInput): Promise<Transaction | null> => {
    try {
      const newTransaction = await addTransactionToDb(transaction, showToasts);
      
      if (newTransaction) {
        // Add to local state
        setTransactions(prev => [newTransaction, ...prev]);
        return newTransaction;
      }
      return null;
    } catch (err: any) {
      console.error('Error adding transaction:', err);
      setError(err?.message || 'Failed to add transaction');
      return null;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
  };
};
