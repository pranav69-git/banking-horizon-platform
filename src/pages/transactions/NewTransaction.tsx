
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, ArrowRight, CheckCircle2 } from "lucide-react";

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

// Form schemas for different transaction types
const depositSchema = z.object({
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
});

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

export default function NewTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [transactionType, setTransactionType] = useState<string>("deposit");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial transaction type based on URL params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && ["deposit", "withdraw", "transfer"].includes(typeParam)) {
      setTransactionType(typeParam);
    }
  }, [searchParams]);

  // Set up form for deposit
  const depositForm = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      accountId: searchParams.get("accountId") || "",
      amount: 0,
      description: "",
    },
  });

  // Set up form for withdrawal
  const withdrawalForm = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      accountId: searchParams.get("accountId") || "",
      amount: 0,
      description: "",
    },
  });

  // Set up form for transfer
  const transferForm = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccountId: searchParams.get("accountId") || "",
      toAccountId: "",
      amount: 0,
      description: "",
    },
  });

  // Handle deposit form submission
  function onDepositSubmit(values: z.infer<typeof depositSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessful(true);
      
      // Create receipt data
      setReceiptData({
        transactionId: `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        type: "deposit",
        account: values.accountId,
        amount: values.amount,
        description: values.description || "Deposit",
        status: "completed",
      });
    }, 1500);
  }

  // Handle withdrawal form submission
  function onWithdrawalSubmit(values: z.infer<typeof withdrawalSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessful(true);
      
      // Create receipt data
      setReceiptData({
        transactionId: `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        type: "withdrawal",
        account: values.accountId,
        amount: values.amount,
        description: values.description || "Withdrawal",
        status: "completed",
      });
    }, 1500);
  }

  // Handle transfer form submission
  function onTransferSubmit(values: z.infer<typeof transferSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessful(true);
      
      // Create receipt data
      setReceiptData({
        transactionId: `TRX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        type: "transfer",
        fromAccount: values.fromAccountId,
        toAccount: values.toAccountId,
        amount: values.amount,
        description: values.description || "Transfer",
        status: "completed",
      });
    }, 1500);
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // If transaction is successful, show receipt
  if (isSuccessful && receiptData) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto">
          <Card className="border-banking-secondary/20 shadow-lg">
            <CardHeader className="text-center border-b">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-banking-primary">Transaction Successful</CardTitle>
              <CardDescription>Your transaction has been processed successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <h3 className="text-center text-lg font-semibold mb-4">Transaction Receipt</h3>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium">{receiptData.transactionId}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {new Date(receiptData.date).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{receiptData.type}</span>
                </div>
                
                {receiptData.type === "transfer" ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">From Account:</span>
                      <span className="font-medium">{receiptData.fromAccount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">To Account:</span>
                      <span className="font-medium">{receiptData.toAccount}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-medium">{receiptData.account}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{formatCurrency(receiptData.amount)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium">{receiptData.description}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize text-green-600">{receiptData.status}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate("/transactions")}
              >
                View All Transactions
              </Button>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="bg-banking-primary hover:bg-banking-primary/90"
              >
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">New Transaction</h1>
        
        <Tabs 
          value={transactionType} 
          onValueChange={setTransactionType}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="deposit" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Withdraw
            </TabsTrigger>
            <TabsTrigger value="transfer" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              <ArrowRight className="h-4 w-4 mr-2" />
              Transfer
            </TabsTrigger>
          </TabsList>
          
          <Card className="border-banking-secondary/20 shadow-md">
            <TabsContent value="deposit" className="mt-0">
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>
                  Add money to your selected account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...depositForm}>
                  <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
                    <FormField
                      control={depositForm.control}
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
                      control={depositForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
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
                      control={depositForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add a note about this deposit"
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
                        {isSubmitting ? "Processing..." : "Deposit Funds"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="withdraw" className="mt-0">
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Withdraw money from your selected account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...withdrawalForm}>
                  <form onSubmit={withdrawalForm.handleSubmit(onWithdrawalSubmit)} className="space-y-4">
                    <FormField
                      control={withdrawalForm.control}
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
                      control={withdrawalForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
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
                            {withdrawalForm.watch("accountId") 
                              ? formatCurrency(mockAccounts.find(acc => acc.id === withdrawalForm.watch("accountId"))?.balance || 0)
                              : "$0.00"
                            }
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={withdrawalForm.control}
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
            </TabsContent>
            
            <TabsContent value="transfer" className="mt-0">
              <CardHeader>
                <CardTitle>Transfer Funds</CardTitle>
                <CardDescription>
                  Move money between your accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...transferForm}>
                  <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="space-y-4">
                    <FormField
                      control={transferForm.control}
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
                      control={transferForm.control}
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
                                  disabled={account.id === transferForm.watch("fromAccountId")}
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
                      control={transferForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
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
                            {transferForm.watch("fromAccountId") 
                              ? formatCurrency(mockAccounts.find(acc => acc.id === transferForm.watch("fromAccountId"))?.balance || 0)
                              : "$0.00"
                            }
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={transferForm.control}
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
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
