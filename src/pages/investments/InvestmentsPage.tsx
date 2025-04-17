
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, DollarSign, TrendingUp } from "lucide-react";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Mock data for investments
const mockInvestments = [
  {
    id: "INV-001",
    type: "Fixed Deposit",
    amount: 500000,
    interestRate: 7.5,
    startDate: "2023-01-15",
    maturityDate: "2024-01-15",
    currentValue: 537500,
    profit: 37500
  },
  {
    id: "INV-002",
    type: "Mutual Fund",
    scheme: "HDFC Top 100 Fund",
    investedAmount: 200000,
    units: 1250.45,
    purchaseDate: "2022-08-10",
    currentValue: 235400,
    profit: 35400
  },
  {
    id: "INV-003",
    type: "Recurring Deposit",
    monthlyAmount: 10000,
    tenure: 24,
    completedMonths: 12,
    startDate: "2022-04-05",
    interestRate: 6.5,
    currentValue: 124500,
    profit: 4500
  },
  {
    id: "INV-004",
    type: "Equity",
    stock: "Reliance Industries",
    quantity: 50,
    purchasePrice: 2200,
    purchaseDate: "2022-02-20",
    currentPrice: 2650,
    currentValue: 132500,
    profit: 22500
  }
];

// Pie chart data
const portfolioDistribution = [
  { name: "Fixed Deposit", value: 537500 },
  { name: "Mutual Fund", value: 235400 },
  { name: "Recurring Deposit", value: 124500 },
  { name: "Equity", value: 132500 }
];

// Bar chart data
const monthlyReturns = [
  { month: "Jan", returns: 7500 },
  { month: "Feb", returns: 6200 },
  { month: "Mar", returns: 8900 },
  { month: "Apr", returns: 5600 },
  { month: "May", returns: 10200 },
  { month: "Jun", returns: 7800 }
];

// Format to INR currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

export default function InvestmentsPage() {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get user data from local storage
    const storedUser = localStorage.getItem("bankingUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Calculate total portfolio value
  const totalPortfolioValue = mockInvestments.reduce(
    (total, investment) => total + investment.currentValue, 
    0
  );
  
  // Calculate total profit
  const totalProfit = mockInvestments.reduce(
    (total, investment) => total + (investment.profit || 0), 
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Investments</h1>
          <p className="text-muted-foreground">Manage your investment portfolio and track performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-banking-secondary/20 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-banking-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-banking-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <h4 className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</h4>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Returns</p>
                <h4 className="text-2xl font-bold">{formatCurrency(totalProfit)}</h4>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investments</p>
                <h4 className="text-2xl font-bold">{mockInvestments.length}</h4>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <h4 className="text-2xl font-bold">+{((totalProfit / (totalPortfolioValue - totalProfit)) * 100).toFixed(2)}%</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-banking-secondary/20 shadow-md">
            <CardHeader>
              <CardTitle>Portfolio Distribution</CardTitle>
              <CardDescription>Breakdown of your investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={portfolioDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-banking-secondary/20 shadow-md">
            <CardHeader>
              <CardTitle>Monthly Returns</CardTitle>
              <CardDescription>Returns on your investments over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="returns" fill="#8884d8" name="Returns" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Investments</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
            <TabsTrigger value="equity">Equity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Investment Portfolio</CardTitle>
                  <Button>New Investment</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInvestments.map((investment) => (
                    <Card key={investment.id} className="border-banking-secondary/10">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{investment.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              {investment.scheme || investment.stock || `${investment.id}`}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0 md:text-right">
                            <p className="text-lg font-semibold">{formatCurrency(investment.currentValue)}</p>
                            <p className={`text-sm ${investment.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {investment.profit > 0 ? '+' : ''}{formatCurrency(investment.profit || 0)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deposits">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInvestments
                    .filter(inv => inv.type === "Fixed Deposit" || inv.type === "Recurring Deposit")
                    .map((investment) => (
                      <Card key={investment.id} className="border-banking-secondary/10">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{investment.type}</h3>
                              <p className="text-sm text-muted-foreground">
                                Interest Rate: {investment.interestRate}%
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 md:text-right">
                              <p className="text-lg font-semibold">{formatCurrency(investment.currentValue)}</p>
                              <p className="text-sm text-green-600">
                                +{formatCurrency(investment.profit || 0)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mutual-funds">
            <Card>
              <CardHeader>
                <CardTitle>Mutual Fund Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInvestments
                    .filter(inv => inv.type === "Mutual Fund")
                    .map((investment) => (
                      <Card key={investment.id} className="border-banking-secondary/10">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{investment.scheme}</h3>
                              <p className="text-sm text-muted-foreground">
                                Units: {investment.units}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 md:text-right">
                              <p className="text-lg font-semibold">{formatCurrency(investment.currentValue)}</p>
                              <p className="text-sm text-green-600">
                                +{formatCurrency(investment.profit || 0)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="equity">
            <Card>
              <CardHeader>
                <CardTitle>Equity Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInvestments
                    .filter(inv => inv.type === "Equity")
                    .map((investment) => (
                      <Card key={investment.id} className="border-banking-secondary/10">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{investment.stock}</h3>
                              <p className="text-sm text-muted-foreground">
                                {investment.quantity} shares @ {formatCurrency(investment.purchasePrice)}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 md:text-right">
                              <p className="text-lg font-semibold">{formatCurrency(investment.currentValue)}</p>
                              <p className="text-sm text-green-600">
                                +{formatCurrency(investment.profit || 0)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
