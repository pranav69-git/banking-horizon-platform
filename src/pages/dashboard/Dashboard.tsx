
import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AccountSummaryCard } from "@/components/dashboard/AccountSummaryCard";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserContext } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
import { useRealTimeTransactions } from "@/hooks/use-real-time-transactions";

// Mock data for accounts with Indian currency
const mockAccounts = [
  {
    accountId: "SA-12345678",
    accountType: "savings",
    balance: 584050.50,
    currency: "INR",
    isActive: true,
    lastTransaction: {
      amount: 25000.00,
      date: "2023-04-15",
      type: "credit" as const,
    },
  },
  {
    accountId: "CA-87654321",
    accountType: "current",
    balance: 215075.75,
    currency: "INR",
    isActive: true,
    lastTransaction: {
      amount: 12050.50,
      date: "2023-04-14",
      type: "debit" as const,
    },
  },
];

export default function Dashboard() {
  const { profile, logActivity } = useUserContext();
  const { transactions } = useRealTimeTransactions([]);

  useEffect(() => {
    // Log dashboard visit
    logActivity("Dashboard Visit", "User viewed the dashboard");
  }, [logActivity]);

  // Calculate total balance, incoming, outgoing amounts based on real-time data
  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0);
  const incomingAmount = transactions
    .filter(t => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);
  const outgoingAmount = transactions
    .filter(t => t.type === "withdrawal" || t.type === "transfer")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions
    .filter(t => t.status === "pending")
    .length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile.name.split(" ")[0] || "Customer"}</h1>
            <p className="text-muted-foreground">Here's an overview of your accounts and recent activities</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => logActivity("Notification", "Viewed notifications")}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => logActivity("Help", "Accessed help")}
              aria-label="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Alert className="bg-banking-primary/5 border-banking-primary/20">
          <Settings className="h-4 w-4" />
          <AlertTitle>Complete Your Profile</AlertTitle>
          <AlertDescription>
            <Link to="/profile" className="underline" onClick={() => logActivity("Profile Link", "Clicked profile link from dashboard")}>
              Enhance your banking experience by updating your profile information.
            </Link>
          </AlertDescription>
        </Alert>

        <QuickStats
          totalBalance={totalBalance}
          incomingAmount={incomingAmount}
          outgoingAmount={outgoingAmount}
          pendingTransactions={pendingTransactions}
        />

        <h2 className="text-2xl font-bold mt-8">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAccounts.map((account) => (
            <AccountSummaryCard key={account.accountId} {...account} />
          ))}
        </div>

        <Tabs defaultValue="transactions" className="mt-8" onValueChange={(value) => logActivity("Tab Change", `Switched to ${value} tab on dashboard`)}>
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <TransactionsList transactions={transactions} limit={5} />
          </TabsContent>
          <TabsContent value="upcoming">
            <Card className="border-banking-secondary/20 shadow-md">
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Scheduled payments and reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming payments scheduled</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => logActivity("Payment", "Started scheduling a payment")}
                    aria-label="Schedule a payment"
                  >
                    Schedule a Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
