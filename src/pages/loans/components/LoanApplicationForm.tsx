
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const loanTypesInfo = {
  personal: {
    maxAmount: 1000000, // 10 lakhs
    minAmount: 50000,
    description: "For personal expenses, with interest rates from 12.5% p.a.",
    termOptions: [12, 24, 36, 48, 60], // In months
  },
  home: {
    maxAmount: 10000000, // 1 crore
    minAmount: 500000, 
    description: "For buying or renovating a home, with interest rates from 8.5% p.a.",
    termOptions: [60, 120, 180, 240, 300], // In months
  },
  education: {
    maxAmount: 2000000, // 20 lakhs
    minAmount: 100000,
    description: "For education expenses, with interest rates from 9.0% p.a.",
    termOptions: [12, 24, 36, 48, 60], // In months
  },
  business: {
    maxAmount: 5000000, // 50 lakhs
    minAmount: 200000,
    description: "For business needs, with interest rates from 10.5% p.a.",
    termOptions: [12, 24, 36, 48, 60], // In months
  },
};

interface LoanApplicationFormProps {
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
}

const formSchema = z.object({
  loanType: z.enum(["personal", "home", "education", "business"], {
    required_error: "Please select a loan type",
  }),
  amount: z.coerce.number({
    required_error: "Loan amount is required",
    invalid_type_error: "Loan amount must be a number",
  }).positive({
    message: "Loan amount must be positive",
  }),
  term: z.coerce.number({
    required_error: "Loan term is required",
    invalid_type_error: "Loan term must be a number",
  }).int().positive(),
  purpose: z.string().min(10, {
    message: "Purpose must be at least 10 characters",
  }).max(500, {
    message: "Purpose must not exceed 500 characters",
  }),
  employmentStatus: z.enum(["employed", "self-employed", "business-owner", "unemployed"], {
    required_error: "Please select your employment status",
  }),
  income: z.coerce.number({
    required_error: "Income is required",
    invalid_type_error: "Income must be a number",
  }).nonnegative(),
  requiredDate: z.date({
    required_error: "A date is required",
  }),
});

export function LoanApplicationForm({ onSubmit, isSubmitting }: LoanApplicationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanType: "personal",
      amount: 100000,
      term: 36,
      purpose: "",
      employmentStatus: "employed",
      income: 0,
      requiredDate: new Date(),
    },
  });

  const watchLoanType = form.watch("loanType") as keyof typeof loanTypesInfo;
  const selectedLoanInfo = loanTypesInfo[watchLoanType];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculate monthly payment (simple approximation)
  const calculateMonthlyPayment = () => {
    const amount = form.watch("amount");
    const term = form.watch("term");
    const loanType = form.watch("loanType") as keyof typeof loanTypesInfo;
    
    const interestRate = loanType === "home" ? 0.085 : 
                        loanType === "personal" ? 0.125 : 
                        loanType === "education" ? 0.09 : 0.105;
    
    const monthlyRate = interestRate / 12;
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  return (
    <Card className="border-banking-secondary/20 shadow-md">
      <CardHeader>
        <CardTitle>Loan Application</CardTitle>
        <CardDescription>
          Fill out this form to apply for a loan
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="loanType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset amount based on new loan type
                      form.setValue("amount", loanTypesInfo[value as keyof typeof loanTypesInfo].minAmount);
                      // Reset term based on new loan type
                      form.setValue("term", loanTypesInfo[value as keyof typeof loanTypesInfo].termOptions[0]);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="home">Home Loan</SelectItem>
                      <SelectItem value="education">Education Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedLoanInfo.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        min={selectedLoanInfo.minAmount}
                        max={selectedLoanInfo.maxAmount}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Min: {formatCurrency(selectedLoanInfo.minAmount)} - 
                    Max: {formatCurrency(selectedLoanInfo.maxAmount)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Term (Months)</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedLoanInfo.termOptions.map((term) => (
                        <SelectItem key={term} value={term.toString()}>
                          {term} months ({Math.floor(term/12)} years {term % 12 > 0 ? `${term % 12} months` : ''})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Estimated monthly payment: {formatCurrency(calculateMonthlyPayment())}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain why you need this loan"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about how you plan to use the loan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
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
              name="requiredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Required By</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When do you need the funds by?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-banking-primary hover:bg-banking-primary/90"
            >
              {isSubmitting ? "Processing..." : "Submit Application"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
