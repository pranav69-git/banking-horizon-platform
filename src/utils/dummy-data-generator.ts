
import { Transaction } from "@/hooks/use-real-time-transactions";

// Transaction types
const transactionTypes = ["deposit", "withdrawal", "transfer"];
const transactionStatuses = ["completed", "pending", "failed"];

// Mock account IDs
const accountIds = ["SA-12345678", "CA-87654321"];

// Generate a random transaction
export function generateRandomTransaction(): Transaction {
  const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)] as "deposit" | "withdrawal" | "transfer";
  const status = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)] as "completed" | "pending" | "failed";
  const accountId = accountIds[Math.floor(Math.random() * accountIds.length)];
  const amount = parseFloat((Math.random() * 10000).toFixed(2));
  
  // Generate random date within last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  const transaction: Transaction = {
    id: `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    date: date.toISOString(),
    type: type,
    amount: amount,
    description: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
    status: status,
    account_id: accountId,
  };
  
  // Add from/to accounts for transfers
  if (type === "transfer") {
    const fromAccount = accountIds[0];
    const toAccount = accountIds[1];
    transaction.fromAccount = fromAccount;
    transaction.toAccount = toAccount;
  }
  
  return transaction;
}

// Generate an array of random transactions
export function generateDummyTransactions(count: number = 10): Transaction[] {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    transactions.push(generateRandomTransaction());
  }
  
  // Sort by date descending (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
