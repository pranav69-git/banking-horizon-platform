
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Users, IndianRupee, PiggyBank, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for the admin dashboard with Indian names
const customerData = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", status: "active", accounts: 2 },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", status: "active", accounts: 1 },
  { id: 3, name: "Vikram Singh", email: "vikram@example.com", status: "inactive", accounts: 1 },
  { id: 4, name: "Ananya Patel", email: "ananya@example.com", status: "active", accounts: 3 },
  { id: 5, name: "Arjun Mehta", email: "arjun@example.com", status: "pending", accounts: 0 },
];

const loanData = [
  { id: "LN-001", customer: "Rajesh Kumar", type: "Personal", amount: 500000, status: "approved" },
  { id: "LN-002", customer: "Priya Sharma", type: "Mortgage", amount: 25000000, status: "pending" },
  { id: "LN-003", customer: "Vikram Singh", type: "Personal", amount: 200000, status: "rejected" },
  { id: "LN-004", customer: "Ananya Patel", type: "Auto", amount: 1500000, status: "pending" },
];

const transactionStats = [
  { name: "Jan", deposits: 1200000, withdrawals: 800000, transfers: 500000 },
  { name: "Feb", deposits: 1500000, withdrawals: 1000000, transfers: 700000 },
  { name: "Mar", deposits: 1800000, withdrawals: 900000, transfers: 900000 },
  { name: "Apr", deposits: 2000000, withdrawals: 1200000, transfers: 800000 },
  { name: "May", deposits: 2200000, withdrawals: 1400000, transfers: 1000000 },
  { name: "Jun", deposits: 1900000, withdrawals: 1100000, transfers: 950000 },
];

const accountTypeData = [
  { name: "Savings", value: 65 },
  { name: "Current", value: 30 },
  { name: "Loan", value: 5 },
];

const COLORS = ["#0A2463", "#247BA0", "#70C1B3", "#F4A261"];

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user data from local storage
    const storedUser = localStorage.getItem("bankingUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to format currency in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the Banking Horizon admin panel</p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-banking-secondary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-banking-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-banking-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <h4 className="text-2xl font-bold">358</h4>
                <p className="text-xs text-green-600">+14 this month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-green-100 p-3 rounded-full">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
                <h4 className="text-2xl font-bold">₹12M</h4>
                <p className="text-xs text-green-600">+8.5% this month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <PiggyBank className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
                <h4 className="text-2xl font-bold">42</h4>
                <p className="text-xs text-green-600">₹8.5M total value</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <h4 className="text-2xl font-bold">8</h4>
                <p className="text-xs text-amber-600">5 loans, 3 accounts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-banking-secondary/20 lg:col-span-2">
            <CardHeader>
              <CardTitle>Transaction Activity</CardTitle>
              <CardDescription>
                Monthly transaction volumes by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transactionStats}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${(value as number).toLocaleString('en-IN')}`} />
                    <Legend />
                    <Bar dataKey="deposits" fill="#0A2463" name="Deposits" />
                    <Bar dataKey="withdrawals" fill="#E76F51" name="Withdrawals" />
                    <Bar dataKey="transfers" fill="#70C1B3" name="Transfers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20">
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
              <CardDescription>
                Breakdown by account type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accountTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accountTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Customers and Pending Loans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-banking-secondary/20">
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>
                Recently registered customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accounts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            customer.status === "active" 
                              ? "success"
                              : customer.status === "inactive" 
                                ? "destructive"
                                : "warning"
                          }
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.accounts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" className="w-full">
                  View All Customers
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20">
            <CardHeader>
              <CardTitle>Pending Loan Applications</CardTitle>
              <CardDescription>
                Loans requiring approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanData.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>{loan.customer}</TableCell>
                      <TableCell>{loan.type}</TableCell>
                      <TableCell>
                        {formatCurrency(loan.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            loan.status === "approved" 
                              ? "success"
                              : loan.status === "rejected" 
                                ? "destructive"
                                : "warning"
                          }
                        >
                          {loan.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" className="w-full">
                  View All Loans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
