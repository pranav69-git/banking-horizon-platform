
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionReceipt } from "./TransactionReceipt";

interface TransactionSuccessProps {
  receiptData: {
    transactionId: string;
    date: string;
    type: string;
    amount: number;
    description?: string;
    status: string;
    account?: string;
    fromAccount?: string;
    toAccount?: string;
  };
}

export function TransactionSuccess({ receiptData }: TransactionSuccessProps) {
  // Ensure description is always defined, with a fallback if it's not provided
  const normalizedReceiptData = {
    ...receiptData,
    description: receiptData.description || "Transaction completed"
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <TransactionReceipt receiptData={normalizedReceiptData} />
      </div>
    </DashboardLayout>
  );
}
