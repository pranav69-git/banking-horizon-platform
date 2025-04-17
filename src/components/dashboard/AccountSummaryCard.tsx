
import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AccountSummaryCardProps {
  accountId: string;
  accountType: string;
  balance: number;
  currency: string;
  isActive: boolean;
  lastTransaction?: {
    amount: number;
    date: string;
    type: "credit" | "debit";
  };
}

export function AccountSummaryCard({
  accountId,
  accountType,
  balance,
  currency,
  isActive,
  lastTransaction,
}: AccountSummaryCardProps) {
  const navigate = useNavigate();
  
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Generate a gradient based on account type
  const getAccountTypeGradient = () => {
    switch (accountType.toLowerCase()) {
      case "savings":
        return "from-blue-500 to-blue-700";
      case "current":
        return "from-purple-500 to-purple-700";
      case "loan":
        return "from-amber-500 to-amber-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <Card className="overflow-hidden border-banking-secondary/20 shadow-md hover:shadow-lg transition-shadow">
      <div className={`h-2 bg-gradient-to-r ${getAccountTypeGradient()}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold capitalize">
            {accountType} Account
          </CardTitle>
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">ID: {accountId}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-banking-primary">
            {formatCurrency(balance)}
          </div>
          
          {lastTransaction && (
            <div className="flex items-center gap-1 mt-2">
              {lastTransaction.type === "credit" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-muted-foreground">
                Last transaction: {formatCurrency(lastTransaction.amount)} on{" "}
                {new Date(lastTransaction.date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/transactions/new?accountId=${accountId}&type=deposit`)}
        >
          Deposit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/transactions/new?accountId=${accountId}&type=withdraw`)}
        >
          Withdraw
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/transactions/new?accountId=${accountId}&type=transfer`)}
        >
          Transfer
        </Button>
      </CardFooter>
    </Card>
  );
}
