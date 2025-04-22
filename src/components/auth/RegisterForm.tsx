
import { AlertCircle, User, Mail, Calendar, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormInputField } from "./form/FormInputField";
import { AccountTypeSelect } from "./form/AccountTypeSelect";
import { useRegisterForm } from "@/hooks/use-register-form";
import { useNavigate } from "react-router-dom";

export function RegisterForm() {
  const { form, error, isLoading, onSubmit, maxDate } = useRegisterForm();
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md border-banking-secondary/20 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-banking-primary">
          Create New Account
        </CardTitle>
        <CardDescription>
          Enter your details to register for a new banking account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInputField
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="John Doe"
              icon={User}
            />
            
            <FormInputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="email@example.com"
              type="email"
              icon={Mail}
            />
            
            <FormInputField
              control={form.control}
              name="dob"
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              type="date"
              max={maxDate()}
              icon={Calendar}
            />
            
            <FormInputField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
              icon={LockKeyhole}
            />
            
            <AccountTypeSelect control={form.control} />
            
            <Button 
              type="submit" 
              className="w-full bg-banking-primary hover:bg-banking-primary/90 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <Button variant="link" onClick={() => navigate("/login")}>
          Already have an account? Log in
        </Button>
      </CardFooter>
    </Card>
  );
}
