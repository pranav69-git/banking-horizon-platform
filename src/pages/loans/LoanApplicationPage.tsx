
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoanApplicationForm } from "./components/LoanApplicationForm";
import { LoanApplicationSuccess } from "./components/LoanApplicationSuccess";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

export default function LoanApplicationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logActivity } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [loanData, setLoanData] = useState<any>(null);

  // Handle loan application form submission
  async function onLoanApplicationSubmit(values: any) {
    setIsSubmitting(true);
    
    try {
      // Generate loan ID
      const loanId = `LOAN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // Calculate interest rate based on loan type
      const interestRate = values.loanType === "home" ? 8.5 : 
                          values.loanType === "personal" ? 12.5 : 
                          values.loanType === "education" ? 9.0 : 10.5;
      
      // Create loan data
      const newLoanData = {
        id: loanId,
        date: new Date().toISOString(),
        type: values.loanType,
        amount: values.amount,
        term: values.term,
        purpose: values.purpose,
        interestRate,
        status: "pending",
      };
      
      // Insert loan into database if we have user data
      if (user) {
        const { error } = await supabase.from('loans').insert({
          type: values.loanType,
          amount: values.amount,
          customer_id: user.id,
          status: 'pending'
        });
        
        if (error) {
          console.error("Error saving loan:", error);
          throw new Error("Failed to save loan application");
        }
      }
      
      setLoanData(newLoanData);
      setIsSuccessful(true);
      
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
    } catch (error) {
      console.error("Error submitting loan application:", error);
      
      toast({
        title: "Application Failed",
        description: "There was an error submitting your loan application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
