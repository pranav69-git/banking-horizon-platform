
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, ArrowRight, Calendar, DollarSign, Landmark } from "lucide-react";

// Mock data for loans
const activeLoans = [
  {
    id: "LN-001",
    type: "Personal",
    amount: 5000,
    term: 12,
    interest: 5.9,
    emi: 435.12,
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    remainingPayments: 9,
    totalPaid: 1740.48,
    status: "active",
  },
  {
    id: "LN-003",
    type: "Auto",
    amount: 15000,
    term: 36,
    interest: 4.5,
    emi: 447.90,
    startDate: "2022-10-05",
    endDate: "2025-10-05",
    remainingPayments: 30,
    totalPaid: 2687.40,
    status: "active",
  },
];

const pendingLoans = [
  {
    id: "LN-004",
    type: "Personal",
    amount: 3000,
    term: 6,
    interest: 6.5,
    emi: 515.52,
    submittedDate: "2023-04-10",
    status: "pending",
  },
];

const completedLoans = [
  {
    id: "LN-002",
    type: "Personal",
    amount: 2000,
    term: 6,
    interest: 6.2,
    emi: 341.44,
    startDate: "2022-07-01",
    endDate: "2023-01-01",
    totalPaid: 2048.64,
    status: "completed",
  },
];

export default function LoansPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("active");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate completion percentage
  const calculateProgress = (loan: any) => {
    const totalPayments = loan.term;
    const completedPayments = totalPayments - loan.remainingPayments;
    return (completedPayments / totalPayments) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Loan Management</h1>
            <p className="text-muted-foreground">Manage your loans and applications</p>
          </div>
          <Button 
            onClick={() => navigate("/loans/apply")} 
            className="bg-banking-primary hover:bg-banking-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        </div>

        <Tabs defaultValue="active" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="active" className="relative">
              Active Loans
              {activeLoans.length > 0 && (
                <span className="ml-2 bg-banking-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeLoans.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending Applications
              {pendingLoans.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingLoans.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Loans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeLoans.length === 0 ? (
              <Card className="border-banking-secondary/20">
                <CardContent className="flex flex-col items-center py-10 space-y-4">
                  <Landmark className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold">No Active Loans</h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    You don't have any active loans at the moment. Apply for a loan to get started.
                  </p>
                  <Button onClick={() => navigate("/loans/apply")}>
                    Apply for Loan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeLoans.map((loan) => (
                  <Card key={loan.id} className="border-banking-secondary/20 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {loan.type} Loan
                          </CardTitle>
                          <CardDescription>{loan.id}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Payment</p>
                          <p className="text-lg font-semibold">{formatCurrency(loan.emi)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="text-lg font-semibold">{loan.interest}%</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {loan.term - loan.remainingPayments}/{loan.term} Payments
                          </span>
                        </div>
                        <Progress value={calculateProgress(loan)} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Start Date</p>
                          <p>{new Date(loan.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">End Date</p>
                          <p>{new Date(loan.endDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Remaining</p>
                          <p>{formatCurrency(loan.remainingPayments * loan.emi)}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Paid So Far</p>
                          <p>{formatCurrency(loan.totalPaid)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate(`/loans/${loan.id}`)}
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pendingLoans.length === 0 ? (
              <Card className="border-banking-secondary/20">
                <CardContent className="flex flex-col items-center py-10 space-y-4">
                  <Calendar className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold">No Pending Applications</h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    You don't have any pending loan applications. Apply for a loan to get started.
                  </p>
                  <Button onClick={() => navigate("/loans/apply")}>
                    Apply for Loan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-banking-secondary/20">
                <CardHeader>
                  <CardTitle>Pending Loan Applications</CardTitle>
                  <CardDescription>
                    Track the status of your loan applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>{loan.type}</TableCell>
                          <TableCell>{formatCurrency(loan.amount)}</TableCell>
                          <TableCell>{loan.term} months</TableCell>
                          <TableCell>{new Date(loan.submittedDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/loans/${loan.id}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedLoans.length === 0 ? (
              <Card className="border-banking-secondary/20">
                <CardContent className="flex flex-col items-center py-10 space-y-4">
                  <DollarSign className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold">No Completed Loans</h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    You don't have any completed loans in your history.
                  </p>
                  <Button onClick={() => navigate("/loans/apply")}>
                    Apply for Loan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-banking-secondary/20">
                <CardHeader>
                  <CardTitle>Completed Loans</CardTitle>
                  <CardDescription>
                    History of your fully repaid loans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Total Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>{loan.type}</TableCell>
                          <TableCell>{formatCurrency(loan.amount)}</TableCell>
                          <TableCell>{loan.term} months</TableCell>
                          <TableCell>{new Date(loan.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(loan.endDate).toLocaleDateString()}</TableCell>
                          <TableCell>{formatCurrency(loan.totalPaid)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
