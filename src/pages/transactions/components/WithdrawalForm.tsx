
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

// Mock data for accounts
const mockAccounts = [
  {
    id: "SA-12345678",
    type: "savings",
    balance: 5840.50,
  },
  {
    id: "CA-87654321",
    type: "current",
    balance: 2150.75,
  },
];

interface WithdrawalFormProps {
  defaultAccountId?: string;
  onSubmit: (values: z.infer<typeof withdrawalSchema>) => void;
  isSubmitting: boolean;
}

const withdrawalSchema = z.object({
  accountId: z.string({
    required_error: "Please select an account",
  }),
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).positive({
    message: "Amount must be positive",
  }),
  description: z.string().optional(),
}).refine((data) => {
  const account = mockAccounts.find(acc => acc.id === data.accountId);
  return account ? account.balance >= data.amount : false;
}, {
  message: "Insufficient funds",
  path: ["amount"],
});

export function WithdrawalForm({ defaultAccountId = "", onSubmit, isSubmitting }: WithdrawalFormProps) {
  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      accountId: defaultAccountId,
      amount: 0,
      description: "",
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Account</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)} ({account.id}) - {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
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
                <FormDescription>
                  Available balance:{" "}
                  {form.watch("accountId") 
                    ? formatCurrency(mockAccounts.find(acc => acc.id === form.watch("accountId"))?.balance || 0)
                    : "₹0.00"
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add a note about this withdrawal"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-banking-primary hover:bg-banking-primary/90"
            >
              {isSubmitting ? "Processing..." : "Withdraw Funds"}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
}
