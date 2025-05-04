
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
import { useRealTimeTransactions } from "@/hooks/use-real-time-transactions";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Use our real-time transactions hook
  const { transactions, isLoading } = useRealTimeTransactions([]);

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
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
    setTransactionType(undefined);
    setStatus(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
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
            <Select 
              value={transactionType} 
              onValueChange={(value) => setTransactionType(value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
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
                  selected={startDate}
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
                  selected={endDate}
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
