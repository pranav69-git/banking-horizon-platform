
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff, 
  CreditCard, 
  Activity, 
  Download, 
  Clock, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for accounts
const mockAccounts = [
  {
    id: "SA-12345678",
    type: "Savings Account",
    balance: 584050.50,
    currency: "INR",
    isActive: true,
    accountNumber: "1234567890",
    ifscCode: "BANK0001234",
    branch: "MG Road, Bangalore",
    dateOpened: "2020-05-15",
    interestRate: 3.5,
    minBalance: 5000,
    transactions: [
      {
        id: "TRX-001",
        date: "2023-04-15",
        description: "Salary Deposit",
        amount: 75000.00,
        type: "credit"
      },
      {
        id: "TRX-002",
        date: "2023-04-10",
        description: "Electricity Bill Payment",
        amount: 2500.00,
        type: "debit"
      },
      {
        id: "TRX-003",
        date: "2023-04-05",
        description: "Online Shopping",
        amount: 4350.75,
        type: "debit"
      }
    ]
  },
  {
    id: "CA-87654321",
    type: "Current Account",
    balance: 215075.75,
    currency: "INR",
    isActive: true,
    accountNumber: "0987654321",
    ifscCode: "BANK0001234",
    branch: "MG Road, Bangalore",
    dateOpened: "2021-02-10",
    interestRate: 0,
    minBalance: 10000,
    transactions: [
      {
        id: "TRX-004",
        date: "2023-04-14",
        description: "Client Payment",
        amount: 120000.00,
        type: "credit"
      },
      {
        id: "TRX-005",
        date: "2023-04-12",
        description: "Office Rent",
        amount: 35000.00,
        type: "debit"
      },
      {
        id: "TRX-006",
        date: "2023-04-08",
        description: "Vendor Payment",
        amount: 18500.50,
        type: "debit"
      }
    ]
  },
  {
    id: "FD-87654321",
    type: "Fixed Deposit",
    balance: 100000.00,
    currency: "INR",
    isActive: true,
    accountNumber: "5678901234",
    ifscCode: "BANK0001234",
    branch: "MG Road, Bangalore",
    dateOpened: "2022-01-20",
    maturityDate: "2023-01-20",
    interestRate: 6.5,
    tenure: "1 year",
    maturityAmount: 106500.00
  }
];

// Format to INR currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

export default function AccountsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showBalance, setShowBalance] = useState<Record<string, boolean>>({});
  const [selectedAccount, setSelectedAccount] = useState<string>(mockAccounts[0].id);
  
  useEffect(() => {
    // Get user data from local storage
    const storedUser = localStorage.getItem("bankingUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Initialize show balance state for all accounts
    const balanceState: Record<string, boolean> = {};
    mockAccounts.forEach(account => {
      balanceState[account.id] = true;
    });
    setShowBalance(balanceState);
  }, []);

  const toggleBalance = (accountId: string) => {
    setShowBalance(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const handleDownloadStatement = (accountId: string) => {
    toast({
      title: "Statement Downloaded",
      description: `Account statement for ${accountId} has been downloaded.`,
    });
  };

  const getAccount = (id: string) => {
    return mockAccounts.find(account => account.id === id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Accounts</h1>
          <p className="text-muted-foreground">View and manage all your banking accounts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAccounts.map((account) => (
            <Card 
              key={account.id} 
              className={`border-banking-secondary/20 shadow-md cursor-pointer transition-all hover:shadow-lg ${
                selectedAccount === account.id ? 'ring-2 ring-banking-primary' : ''
              }`}
              onClick={() => setSelectedAccount(account.id)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{account.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{account.id}</p>
                    <h3 className="text-xl font-bold mt-4">
                      {showBalance[account.id] 
                        ? formatCurrency(account.balance) 
                        : "••••••••••"}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <CreditCard className="h-6 w-6 text-banking-primary mb-2" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBalance(account.id);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showBalance[account.id] ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${account.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">{account.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadStatement(account.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Statement
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedAccount && (
          <Card className="border-banking-secondary/20 shadow-md">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{getAccount(selectedAccount)?.type}</CardTitle>
                  <CardDescription>Account details and recent transactions</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">New Transaction</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Transaction</DialogTitle>
                        <DialogDescription>
                          Transfer funds or pay bills from this account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="transactionType" className="text-right">
                            Type
                          </Label>
                          <select 
                            id="transactionType" 
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="transfer">Transfer</option>
                            <option value="billPayment">Bill Payment</option>
                            <option value="withdrawal">Withdrawal</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input id="amount" placeholder="Enter amount" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="recipient" className="text-right">
                            Recipient
                          </Label>
                          <Input id="recipient" placeholder="Account number or merchant" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input id="description" placeholder="Add a note" className="col-span-3" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => {
                          toast({
                            title: "Transaction Initiated",
                            description: "Your transaction has been initiated successfully."
                          });
                        }}>
                          Proceed
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" onClick={() => handleDownloadStatement(selectedAccount)}>
                    <Download className="h-4 w-4 mr-2" />
                    Statement
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Account Details</TabsTrigger>
                  <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                  <TabsTrigger value="statements">Statements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Account Number</h3>
                      <p className="font-medium">{getAccount(selectedAccount)?.accountNumber}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">IFSC Code</h3>
                      <p className="font-medium">{getAccount(selectedAccount)?.ifscCode}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Branch</h3>
                      <p className="font-medium">{getAccount(selectedAccount)?.branch}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Date Opened</h3>
                      <p className="font-medium">{getAccount(selectedAccount)?.dateOpened}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Interest Rate</h3>
                      <p className="font-medium">{getAccount(selectedAccount)?.interestRate}%</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Minimum Balance</h3>
                      <p className="font-medium">
                        {getAccount(selectedAccount)?.minBalance 
                          ? formatCurrency(getAccount(selectedAccount)?.minBalance as number)
                          : "N/A"}
                      </p>
                    </div>
                    {getAccount(selectedAccount)?.maturityDate && (
                      <>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Maturity Date</h3>
                          <p className="font-medium">{getAccount(selectedAccount)?.maturityDate}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Maturity Amount</h3>
                          <p className="font-medium">
                            {formatCurrency(getAccount(selectedAccount)?.maturityAmount as number)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions" className="mt-4">
                  <div className="space-y-4">
                    {getAccount(selectedAccount)?.transactions?.map((transaction) => (
                      <Card key={transaction.id} className="border-banking-secondary/10">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                {transaction.type === 'credit' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-muted-foreground">{transaction.date}</p>
                              </div>
                            </div>
                            <div className={`font-medium ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!getAccount(selectedAccount)?.transactions || getAccount(selectedAccount)?.transactions.length === 0) && (
                      <div className="text-center py-8">
                        <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No transactions found for this account.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="statements" className="mt-4">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">April 2023 Statement</p>
                              <p className="text-sm text-muted-foreground">Generated on May 1, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">March 2023 Statement</p>
                              <p className="text-sm text-muted-foreground">Generated on April 1, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">February 2023 Statement</p>
                              <p className="text-sm text-muted-foreground">Generated on March 1, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-sm text-muted-foreground">Last updated: Today, 10:30 AM</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Report Issue
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                    <DialogDescription>
                      Let us know if you notice any discrepancies with your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="issueType">Issue Type</Label>
                      <select 
                        id="issueType" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="transaction">Transaction Discrepancy</option>
                        <option value="balance">Incorrect Balance</option>
                        <option value="fees">Unexpected Fees</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea 
                        id="description" 
                        placeholder="Describe the issue in detail" 
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => {
                      toast({
                        title: "Issue Reported",
                        description: "Your issue has been reported. Our team will look into it."
                      });
                    }}>
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
