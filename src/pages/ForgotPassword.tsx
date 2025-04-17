
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-banking-primary">Banking Horizon</h1>
        <p className="text-muted-foreground">Reset your password</p>
      </div>
      
      <Card className="w-full max-w-md border-banking-secondary/20 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-banking-primary">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Check your email</h3>
              <p className="text-center text-muted-foreground">
                We've sent a password reset link to your email address. Please check your inbox.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="mt-4"
              >
                Back to login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="email@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-banking-primary hover:bg-banking-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        {!isSubmitted && (
          <CardFooter className="flex justify-center border-t p-4">
            <Button variant="link" onClick={() => navigate("/login")}>
              Remember your password? Log in
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
