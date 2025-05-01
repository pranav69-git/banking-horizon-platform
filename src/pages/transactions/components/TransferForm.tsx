
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

interface TransferFormProps {
  defaultAccountId?: string;
  onSubmit: (values: z.infer<typeof transferSchema>) => void;
  isSubmitting: boolean;
}

const transferSchema = z.object({
  fromAccountId: z.string({
    required_error: "Please select a source account",
  }),
  toAccountId: z.string({
    required_error: "Please select a destination account",
  }),
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).positive({
    message: "Amount must be positive",
  }),
  description: z.string().optional(),
}).refine((data) => {
  return data.fromAccountId !== data.toAccountId;
}, {
  message: "Source and destination accounts cannot be the same",
  path: ["toAccountId"],
}).refine((data) => {
  const account = mockAccounts.find(acc => acc.id === data.fromAccountId);
  return account ? account.balance >= data.amount : false;
}, {
  message: "Insufficient funds",
  path: ["amount"],
});

export function TransferForm({ defaultAccountId = "", onSubmit, isSubmitting }: TransferFormProps) {
  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccountId: defaultAccountId,
      toAccountId: "",
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
            name="fromAccountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Account</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source account" />
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
            name="toAccountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Account</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockAccounts.map((account) => (
                      <SelectItem 
                        key={account.id} 
                        value={account.id}
                        disabled={account.id === form.watch("fromAccountId")}
                      >
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)} ({account.id})
                      </SelectItem>
                    ))}
                    <SelectItem value="external">External Account</SelectItem>
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
                  {form.watch("fromAccountId") 
                    ? formatCurrency(mockAccounts.find(acc => acc.id === form.watch("fromAccountId"))?.balance || 0)
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
                    placeholder="Add a note about this transfer"
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
              {isSubmitting ? "Processing..." : "Transfer Funds"}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
}
