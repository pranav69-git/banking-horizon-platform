
// Transaction interfaces for frontend usage
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

// Database transaction type to match what's in Supabase
export interface DbTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
  account_id: string;
  from_account?: string;
  to_account?: string;
}

// Type for creating a new transaction
export type NewTransactionInput = Omit<Transaction, "id" | "date">;
