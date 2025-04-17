
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-banking-primary">Banking Horizon</h1>
        <p className="text-muted-foreground">Your trusted banking partner</p>
      </div>
      
      <Card className="w-full max-w-md border-banking-secondary/20 shadow-lg text-center">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-banking-primary">Registration Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your account has been created successfully. Our team will verify your information and activate your account within 24 hours.
          </p>
          <p className="text-muted-foreground">
            You will receive an email notification once your account is ready to use.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-0">
          <Button
            onClick={() => navigate("/login")}
            className="bg-banking-primary hover:bg-banking-primary/90"
          >
            Proceed to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
