
import { useEffect } from 'react';
import { generateDummyTransactions } from '@/utils/dummy-data-generator';
import { useRealTimeTransactions } from '@/hooks/use-real-time-transactions';

// This component helps set up the app with initial dummy data
export function AppSetup() {
  const { transactions, addTransaction } = useRealTimeTransactions([]);
  
  useEffect(() => {
    // Only add dummy data if there are no transactions yet
    if (transactions.length === 0) {
      const dummyTransactions = generateDummyTransactions(15);
      
      // Add transactions with a slight delay between each to avoid overwhelming the UI
      const addDummyTransactions = async () => {
        for (const transaction of dummyTransactions) {
          await addTransaction({
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status,
            account_id: transaction.account_id,
            fromAccount: transaction.fromAccount,
            toAccount: transaction.toAccount,
          });
          
          // Add a small delay between transactions
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      };
      
      addDummyTransactions();
    }
  }, [transactions.length, addTransaction]);
  
  // This is an invisible component, it just sets up data
  return null;
}
