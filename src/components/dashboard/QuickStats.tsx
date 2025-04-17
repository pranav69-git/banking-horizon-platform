
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  Wallet,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsProps {
  totalBalance: number;
  incomingAmount: number;
  outgoingAmount: number;
  pendingTransactions: number;
}

export function QuickStats({
  totalBalance,
  incomingAmount,
  outgoingAmount,
  pendingTransactions,
}: QuickStatsProps) {
  // Function to format currency in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-banking-secondary/20 shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="bg-banking-primary/10 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-banking-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
            <h4 className="text-2xl font-bold">{formatCurrency(totalBalance)}</h4>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-banking-secondary/20 shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="bg-green-100 p-3 rounded-full">
            <ArrowUpRight className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Incoming</p>
            <h4 className="text-2xl font-bold">{formatCurrency(incomingAmount)}</h4>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-banking-secondary/20 shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="bg-red-100 p-3 rounded-full">
            <ArrowDownRight className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Outgoing</p>
            <h4 className="text-2xl font-bold">{formatCurrency(outgoingAmount)}</h4>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-banking-secondary/20 shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="bg-amber-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <h4 className="text-2xl font-bold">{pendingTransactions}</h4>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
