
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  dob: z.string().refine((dob) => {
    const date = new Date(dob);
    const today = new Date();
    const minimumAge = 18;
    const age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= minimumAge;
    }
    return age >= minimumAge;
  }, { message: "You must be at least 18 years old" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }
  ),
  accountType: z.enum(["savings", "current"], {
    required_error: "Please select an account type",
  }),
});

export type RegisterFormData = z.infer<typeof formSchema>;

export function useRegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      password: "",
      accountType: "savings",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            dob: values.dob,
            acc_type: values.accountType,
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error("Failed to create user");
      }

      // 2. Insert customer record directly
      const { error: customerError } = await supabase
        .from('customers')
        .insert([{ 
          id: signUpData.user.id,
          name: values.name, 
          email: values.email,
          dob: values.dob,
          acc_type: values.accountType
        }]);

      if (customerError) {
        console.error("Customer record error:", customerError);
        throw new Error(`Failed to create customer record: ${customerError.message}`);
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
      
      // Navigate to success page without trying to log in immediately
      navigate("/registration-success");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register. Please try again.");
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please check your details and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    error,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
    maxDate: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return date.toISOString().split("T")[0];
    },
  };
}
