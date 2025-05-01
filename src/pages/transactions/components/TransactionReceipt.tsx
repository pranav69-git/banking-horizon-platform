
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TransactionReceiptProps {
  receiptData: {
    transactionId: string;
    date: string;
    type: string;
    account?: string;
    fromAccount?: string;
    toAccount?: string;
    amount: number;
    description: string;
    status: string;
  };
}

export function TransactionReceipt({ receiptData }: TransactionReceiptProps) {
  const navigate = useNavigate();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Card className="border-banking-secondary/20 shadow-lg">
      <CardHeader className="text-center border-b">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-xl text-banking-primary">Transaction Successful</CardTitle>
        <CardDescription>Your transaction has been processed successfully</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h3 className="text-center text-lg font-semibold mb-4">Transaction Receipt</h3>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction ID:</span>
            <span className="font-medium">{receiptData.transactionId}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date & Time:</span>
            <span className="font-medium">
              {new Date(receiptData.date).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">{receiptData.type}</span>
          </div>
          
          {receiptData.type === "transfer" ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From Account:</span>
                <span className="font-medium">{receiptData.fromAccount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To Account:</span>
                <span className="font-medium">{receiptData.toAccount}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account:</span>
              <span className="font-medium">{receiptData.account}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">{formatCurrency(receiptData.amount)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Description:</span>
            <span className="font-medium">{receiptData.description}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium capitalize text-green-600">{receiptData.status}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => navigate("/transactions")}
        >
          View All Transactions
        </Button>
        <Button 
          onClick={() => navigate("/dashboard")}
          className="bg-banking-primary hover:bg-banking-primary/90"
        >
          Back to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}
