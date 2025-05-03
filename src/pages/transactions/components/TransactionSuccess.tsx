
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
  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <TransactionReceipt receiptData={receiptData} />
      </div>
    </DashboardLayout>
  );
}
