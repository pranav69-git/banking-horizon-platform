
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionTabs } from "./components/TransactionTabs";
import { TransactionReceipt } from "./components/TransactionReceipt";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeTransactions } from "@/hooks/use-real-time-transactions";
import { useUserContext } from "@/contexts/UserContext";

export default function NewTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<string>("deposit");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserContext();
  
  // Use our real-time transactions hook
  const { addTransaction } = useRealTimeTransactions([]);

  // Set initial transaction type based on URL params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && ["deposit", "withdraw", "transfer"].includes(typeParam)) {
      setTransactionType(typeParam);
    }
  }, [searchParams]);

  // Handle deposit form submission
  async function onDepositSubmit(values: any) {
    setIsSubmitting(true);
    
    try {
      // Generate transaction ID
      const transactionId = `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // Add the transaction to our database
      const transaction = await addTransaction({
        type: "deposit",
        amount: values.amount,
        description: values.description || "Deposit to account",
        status: "completed",
        account_id: values.accountId,
      });
      
      // Create receipt data
      const receiptData = {
        transactionId: transaction?.id || transactionId,
        date: new Date().toISOString(),
        type: "deposit",
        account: values.accountId,
        amount: values.amount,
        description: values.description || "Deposit to account",
        status: "completed",
      };
      
      setIsSuccessful(true);
      setReceiptData(receiptData);
      
      // Show success toast
      toast({
        title: "Deposit Successful",
        description: `₹${values.amount} has been deposited into your account.`
      });
    } catch (error) {
      console.error("Error creating deposit:", error);
      
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle withdrawal form submission
  async function onWithdrawalSubmit(values: any) {
    setIsSubmitting(true);
    
    try {
      // Generate transaction ID
      const transactionId = `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // Add the transaction to our database
      const transaction = await addTransaction({
        type: "withdrawal",
        amount: values.amount,
        description: values.description || "Withdrawal from account",
        status: "completed",
        account_id: values.accountId,
      });
      
      // Create receipt data
      const receiptData = {
        transactionId: transaction?.id || transactionId,
        date: new Date().toISOString(),
        type: "withdrawal",
        account: values.accountId,
        amount: values.amount,
        description: values.description || "Withdrawal from account",
        status: "completed",
      };
      
      setIsSuccessful(true);
      setReceiptData(receiptData);
      
      // Show success toast
      toast({
        title: "Withdrawal Successful",
        description: `₹${values.amount} has been withdrawn from your account.`
      });
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle transfer form submission
  async function onTransferSubmit(values: any) {
    setIsSubmitting(true);
    
    try {
      // Generate transaction ID
      const transactionId = `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // Add the transaction to our database
      const transaction = await addTransaction({
        type: "transfer",
        amount: values.amount,
        description: values.description || "Transfer between accounts",
        status: "completed",
        account_id: values.fromAccountId,
        fromAccount: values.fromAccountId,
        toAccount: values.toAccountId,
      });
      
      // Create receipt data
      const receiptData = {
        transactionId: transaction?.id || transactionId,
        date: new Date().toISOString(),
        type: "transfer",
        fromAccount: values.fromAccountId,
        toAccount: values.toAccountId,
        amount: values.amount,
        description: values.description || "Transfer between accounts",
        status: "completed",
      };
      
      setIsSuccessful(true);
      setReceiptData(receiptData);
      
      // Show success toast
      toast({
        title: "Transfer Successful",
        description: `₹${values.amount} has been transferred successfully.`
      });
    } catch (error) {
      console.error("Error creating transfer:", error);
      
      toast({
        title: "Transfer Failed",
        description: "There was an error processing your transfer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // If transaction is successful, show receipt
  if (isSuccessful && receiptData) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto">
          <TransactionReceipt receiptData={receiptData} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">New Transaction</h1>
        
        <TransactionTabs
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          onDepositSubmit={onDepositSubmit}
          onWithdrawalSubmit={onWithdrawalSubmit}
          onTransferSubmit={onTransferSubmit}
          isSubmitting={isSubmitting}
          defaultAccountId={searchParams.get("accountId") || ""}
        />
      </div>
    </DashboardLayout>
  );
}
