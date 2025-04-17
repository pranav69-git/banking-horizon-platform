
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, AlertCircle } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  role: z.enum(["customer", "admin"], {
    required_error: "Please select a role",
  }),
});

export function LoginForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    // Here we would usually make an API call to authenticate the user
    // For now, we'll just simulate a login
    setTimeout(() => {
      setIsLoading(false);
      // Simulate successful login
      if (values.email === "user@example.com" && values.password === "password123") {
        const redirectPath = values.role === "admin" ? "/admin/dashboard" : "/dashboard";
        // Store user info in localStorage (in a real app, we'd use httpOnly cookies and JWTs)
        localStorage.setItem("bankingUser", JSON.stringify({
          name: "John Doe",
          email: values.email,
          role: values.role,
          isAuthenticated: true,
        }));
        navigate(redirectPath);
      } else {
        setError("Invalid email or password");
      }
    }, 1000);
  }

  return (
    <Card className="w-full max-w-md border-banking-secondary/20 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-banking-primary">Login to Banking Horizon</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Login As</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted transition-colors">
                        <RadioGroupItem value="customer" id="customer" />
                        <Label htmlFor="customer" className="cursor-pointer">Customer</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted transition-colors">
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
                      </div>
                    </RadioGroup>
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
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="link" onClick={() => navigate("/forgot-password")}>
          Forgot password?
        </Button>
        <Button variant="link" onClick={() => navigate("/register")}>
          Create account
        </Button>
      </CardFooter>
    </Card>
  );
}
