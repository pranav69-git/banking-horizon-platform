
import { supabase } from "@/integrations/supabase/client";
import { DbTransaction, Transaction, NewTransactionInput } from "@/types/transaction.types";
import { toast } from "@/hooks/use-toast";

// Format database transaction to frontend model
export function formatDbTransaction(item: DbTransaction): Transaction {
  return {
    id: item.id,
    date: item.date || new Date().toISOString(),
    type: item.type as "deposit" | "withdrawal" | "transfer",
    amount: Number(item.amount),
    description: item.type, // Use type as description since description column doesn't exist
    status: item.status as "completed" | "pending" | "failed",
    account_id: item.account_id,
    fromAccount: item.from_account,
    toAccount: item.to_account,
  };
}

// Fetch transactions from Supabase
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    if (data) {
      // Transform the database data to match our Transaction interface
      return data.map((item: DbTransaction) => formatDbTransaction(item));
    }
    
    return [];
  } catch (error) {
    console.error('Error in transaction fetch:', error);
    return [];
  }
}

// Add a new transaction to the database
export async function addTransactionToDb(transaction: NewTransactionInput): Promise<Transaction | null> {
  try {
    // Prepare data for insert - map our interface to DB schema
    const dbTransaction = {
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      account_id: transaction.account_id || 'default-account',
      from_account: transaction.fromAccount,
      to_account: transaction.toAccount,
      // No description field in the database schema
    };
      
    // Save to database
    const { data, error } = await supabase
      .from('transactions')
      .insert(dbTransaction)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding transaction:', error);
      
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
    
    // Return the saved transaction with frontend model format
    return formatDbTransaction(dbData);
  } catch (error) {
    console.error('Error in addTransaction:', error);
    return null;
  }
}
