
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

interface LoanApplicationSuccessProps {
  loanData: {
    id: string;
    date: string;
    type: string;
    amount: number;
    term: number;
    purpose: string;
    interestRate: number;
    status: string;
  };
  onViewAll: () => void;
  onGoToDashboard: () => void;
}

export function LoanApplicationSuccess({ 
  loanData, 
  onViewAll, 
  onGoToDashboard 
}: LoanApplicationSuccessProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const calculateMonthlyPayment = () => {
    const monthlyRate = loanData.interestRate / 100 / 12;
    const monthlyPayment = loanData.amount * (monthlyRate * Math.pow(1 + monthlyRate, loanData.term)) / (Math.pow(1 + monthlyRate, loanData.term) - 1);
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  return (
    <Card className="border-banking-secondary/20 shadow-lg">
      <CardHeader className="text-center border-b">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-xl text-banking-primary">Application Submitted Successfully</CardTitle>
        <CardDescription>Your loan application is now under review</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h3 className="text-center text-lg font-semibold mb-4">Loan Application Details</h3>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Application ID:</span>
            <span className="font-medium">{loanData.id}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date & Time:</span>
            <span className="font-medium">
              {new Date(loanData.date).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Loan Type:</span>
            <span className="font-medium capitalize">{loanData.type}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Loan Amount:</span>
            <span className="font-medium">{formatCurrency(loanData.amount)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Loan Term:</span>
            <span className="font-medium">{loanData.term} months</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Interest Rate:</span>
            <span className="font-medium">{loanData.interestRate}% p.a.</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Monthly Payment:</span>
            <span className="font-medium">{formatCurrency(calculateMonthlyPayment())}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium capitalize text-amber-600">{loanData.status}</span>
          </div>
        </div>
        
        <div className="rounded-md bg-amber-50 p-4 mt-6 border border-amber-200">
          <h4 className="text-sm font-medium text-amber-800">What happens next?</h4>
          <ol className="mt-2 ml-4 text-xs text-amber-700 list-decimal">
            <li className="mt-1">Our team will review your application within 1-2 business days.</li>
            <li className="mt-1">You may be contacted for additional documentation if needed.</li>
            <li className="mt-1">Once approved, the funds will be disbursed to your primary account.</li>
            <li className="mt-1">You can check the status of your application in the Loans section.</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onViewAll}
        >
          View All Loans
        </Button>
        <Button 
          onClick={onGoToDashboard}
          className="bg-banking-primary hover:bg-banking-primary/90"
        >
          Back to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}
