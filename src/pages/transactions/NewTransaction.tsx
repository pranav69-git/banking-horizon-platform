
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionTabs } from "./components/TransactionTabs";
import { TransactionReceipt } from "./components/TransactionReceipt";
import { useToast } from "@/hooks/use-toast";

export default function NewTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<string>("deposit");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial transaction type based on URL params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && ["deposit", "withdraw", "transfer"].includes(typeParam)) {
      setTransactionType(typeParam);
    }
  }, [searchParams]);

  // Handle deposit form submission
  function onDepositSubmit(values: any) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessful(true);
      
      // Create receipt data
      setReceiptData({
        transactionId: `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        type: "deposit",
        account: values.accountId,
        amount: values.amount,
        description: values.description || "Deposit",
        status: "completed",
      });
      
      // Show success toast
      toast({
        title: "Deposit Successful",
        description: `₹${values.amount} has been deposited into your account.`
      });
    }, 1500);
  }

  // Handle withdrawal form submission
  function onWithdrawalSubmit(values: any) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessful(true);
      
      // Create receipt data
      setReceiptData({
        transactionId: `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        type: "withdrawal",
        account: values.accountId,
        amount: values.amount,
        description: values.description || "Withdrawal",
        status: "completed",
      });
      
      // Show success toast
      toast({
        title: "Withdrawal Successful",
        description: `₹${values.amount} has been withdrawn from your account.`
      });
    }, 1500);
  }

  // Handle transfer form submission
  function onTransferSubmit(values: any) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessful(true);
      
      // Create receipt data
      setReceiptData({
        transactionId: `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        type: "transfer",
        fromAccount: values.fromAccountId,
        toAccount: values.toAccountId,
        amount: values.amount,
        description: values.description || "Transfer",
        status: "completed",
      });
      
      // Show success toast
      toast({
        title: "Transfer Successful",
        description: `₹${values.amount} has been transferred successfully.`
      });
    }, 1500);
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
