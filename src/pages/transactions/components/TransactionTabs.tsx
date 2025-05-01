
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepositForm } from "./DepositForm";
import { WithdrawalForm } from "./WithdrawalForm";
import { TransferForm } from "./TransferForm";

interface TransactionTabsProps {
  transactionType: string;
  setTransactionType: (type: string) => void;
  onDepositSubmit: (values: any) => void;
  onWithdrawalSubmit: (values: any) => void;
  onTransferSubmit: (values: any) => void;
  isSubmitting: boolean;
  defaultAccountId?: string;
}

export function TransactionTabs({
  transactionType,
  setTransactionType,
  onDepositSubmit,
  onWithdrawalSubmit,
  onTransferSubmit,
  isSubmitting,
  defaultAccountId = "",
}: TransactionTabsProps) {
  return (
    <Tabs 
      value={transactionType} 
      onValueChange={setTransactionType}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="deposit" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Deposit
        </TabsTrigger>
        <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
          <ArrowDownRight className="h-4 w-4 mr-2" />
          Withdraw
        </TabsTrigger>
        <TabsTrigger value="transfer" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
          <ArrowRight className="h-4 w-4 mr-2" />
          Transfer
        </TabsTrigger>
      </TabsList>
      
      <Card className="border-banking-secondary/20 shadow-md">
        <TabsContent value="deposit" className="mt-0">
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
            <CardDescription>
              Add money to your selected account
            </CardDescription>
          </CardHeader>
          <DepositForm 
            defaultAccountId={defaultAccountId} 
            onSubmit={onDepositSubmit} 
            isSubmitting={isSubmitting} 
          />
        </TabsContent>
        
        <TabsContent value="withdraw" className="mt-0">
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>
              Withdraw money from your selected account
            </CardDescription>
          </CardHeader>
          <WithdrawalForm 
            defaultAccountId={defaultAccountId} 
            onSubmit={onWithdrawalSubmit} 
            isSubmitting={isSubmitting} 
          />
        </TabsContent>
        
        <TabsContent value="transfer" className="mt-0">
          <CardHeader>
            <CardTitle>Transfer Funds</CardTitle>
            <CardDescription>
              Move money between your accounts
            </CardDescription>
          </CardHeader>
          <TransferForm 
            defaultAccountId={defaultAccountId} 
            onSubmit={onTransferSubmit} 
            isSubmitting={isSubmitting} 
          />
        </TabsContent>
      </Card>
    </Tabs>
  );
}
