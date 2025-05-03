
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionTabs } from "./components/TransactionTabs";
import { TransactionSuccess } from "./components/TransactionSuccess";
import { useTransactionForm } from "./hooks/use-transaction-form";

export default function NewTransaction() {
  const {
    transactionType,
    setTransactionType,
    isSuccessful,
    receiptData,
    isSubmitting,
    onDepositSubmit,
    onWithdrawalSubmit,
    onTransferSubmit,
    defaultAccountId
  } = useTransactionForm();

  // If transaction is successful, show receipt
  if (isSuccessful && receiptData) {
    return <TransactionSuccess receiptData={receiptData} />;
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
          defaultAccountId={defaultAccountId}
        />
      </div>
    </DashboardLayout>
  );
}
