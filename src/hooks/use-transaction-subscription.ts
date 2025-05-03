
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DbTransaction, Transaction } from "@/types/transaction.types";
import { formatDbTransaction } from "@/services/transaction.service";
import { toast } from "@/hooks/use-toast";

type SubscriptionHandler = {
  onInsert: (transaction: Transaction) => void;
  onUpdate: (id: string, updatedTransaction: Partial<DbTransaction>) => void;
};

export function useTransactionSubscription(handler: SubscriptionHandler, userId?: string): void {
  useEffect(() => {
    if (!userId) return;
    
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
            const formattedTransaction = formatDbTransaction(newTransaction);
            
            // Call the handler with the new transaction
            handler.onInsert(formattedTransaction);
            
            // Show a toast notification
            toast({
              title: "New Transaction",
              description: `${formattedTransaction.type.charAt(0).toUpperCase() + formattedTransaction.type.slice(1)} of ₹${formattedTransaction.amount} was ${formattedTransaction.status}`
            });
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedTransaction = payload.new as DbTransaction;
            
            // Call the handler with the updated transaction
            handler.onUpdate(updatedTransaction.id, updatedTransaction);
            
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
  }, [userId, handler]);
}
