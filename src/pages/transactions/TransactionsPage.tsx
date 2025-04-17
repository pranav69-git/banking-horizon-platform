
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data for transactions (more comprehensive)
const allTransactions = [
  {
    id: "TRX-001",
    date: "2023-04-15",
    type: "deposit" as const,
    amount: 250.00,
    description: "Salary deposit",
    status: "completed" as const,
  },
  {
    id: "TRX-002",
    date: "2023-04-14",
    type: "withdrawal" as const,
    amount: 120.50,
    description: "ATM withdrawal",
    status: "completed" as const,
  },
  {
    id: "TRX-003",
    date: "2023-04-13",
    type: "transfer" as const,
    amount: 500.00,
    description: "Transfer to John Doe",
    status: "completed" as const,
    fromAccount: "SA-12345678",
    toAccount: "External",
  },
  {
    id: "TRX-004",
    date: "2023-04-12",
    type: "deposit" as const,
    amount: 1000.00,
    description: "Bonus payment",
    status: "completed" as const,
  },
  {
    id: "TRX-005",
    date: "2023-04-10",
    type: "transfer" as const,
    amount: 75.25,
    description: "Utility bill payment",
    status: "pending" as const,
    fromAccount: "CA-87654321",
    toAccount: "External",
  },
  {
    id: "TRX-006",
    date: "2023-04-08",
    type: "withdrawal" as const,
    amount: 350.00,
    description: "Cash withdrawal",
    status: "completed" as const,
  },
  {
    id: "TRX-007",
    date: "2023-04-05",
    type: "deposit" as const,
    amount: 200.00,
    description: "Refund from Online Store",
    status: "completed" as const,
  },
  {
    id: "TRX-008",
    date: "2023-04-02",
    type: "transfer" as const,
    amount: 850.00,
    description: "Rent payment",
    status: "failed" as const,
    fromAccount: "SA-12345678",
    toAccount: "External",
  },
  {
    id: "TRX-009",
    date: "2023-03-28",
    type: "withdrawal" as const,
    amount: 45.99,
    description: "Restaurant payment",
    status: "completed" as const,
  },
  {
    id: "TRX-010",
    date: "2023-03-25",
    type: "deposit" as const,
    amount: 3000.00,
    description: "Investment return",
    status: "completed" as const,
  },
];

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Filter transactions based on selected filters
  const filteredTransactions = allTransactions.filter((transaction) => {
    // Filter by transaction type
    if (transactionType && transaction.type !== transactionType) {
      return false;
    }
    
    // Filter by status
    if (status && transaction.status !== status) {
      return false;
    }
    
    // Filter by date range
    if (startDate) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < startDate) {
        return false;
      }
    }
    
    if (endDate) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate > endDate) {
        return false;
      }
    }
    
    return true;
  });

  const resetFilters = () => {
    setTransactionType(null);
    setStatus(null);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">View and manage your transaction history</p>
          </div>
          <Button 
            onClick={() => navigate("/transactions/new")}
            className="bg-banking-primary hover:bg-banking-primary/90"
          >
            New Transaction
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Transaction Type</label>
            <Select value={transactionType || ""} onValueChange={setTransactionType}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={status || ""} onValueChange={setStatus}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={setEndDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>

        <TransactionsList 
          transactions={filteredTransactions} 
          showFilters={true} 
        />
      </div>
    </DashboardLayout>
  );
}
