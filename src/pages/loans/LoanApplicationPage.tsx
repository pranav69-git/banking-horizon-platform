
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoanApplicationForm } from "./components/LoanApplicationForm";
import { LoanApplicationSuccess } from "./components/LoanApplicationSuccess";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/contexts/UserContext";

export default function LoanApplicationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logActivity } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [loanData, setLoanData] = useState<any>(null);

  // Handle loan application form submission
  function onLoanApplicationSubmit(values: any) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessful(true);
      
      // Create loan data
      const loanData = {
        id: `LOAN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        type: values.loanType,
        amount: values.amount,
        term: values.term,
        purpose: values.purpose,
        interestRate: values.loanType === "home" ? 8.5 : 
                     values.loanType === "personal" ? 12.5 : 
                     values.loanType === "education" ? 9.0 : 10.5,
        status: "pending",
      };
      
      setLoanData(loanData);
      
      // Log activity
      if (user) {
        logActivity(
          "Loan Application", 
          `Applied for a ${values.loanType} loan of ₹${values.amount}`
        );
      }
      
      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully."
      });
    }, 1500);
  }

  // If loan application is successful, show the success component
  if (isSuccessful && loanData) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <LoanApplicationSuccess 
            loanData={loanData} 
            onViewAll={() => navigate("/loans")}
            onGoToDashboard={() => navigate("/dashboard")}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Apply for a Loan</h1>
        
        <LoanApplicationForm
          onSubmit={onLoanApplicationSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
}
