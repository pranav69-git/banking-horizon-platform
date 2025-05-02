
import { ArrowUpRight, ArrowDownRight, ArrowRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Transaction, useRealTimeTransactions } from "@/hooks/use-real-time-transactions";

interface TransactionsListProps {
  transactions: Transaction[];
  showFilters?: boolean;
  limit?: number;
}

export function TransactionsList({ 
  transactions: initialTransactions,
  showFilters = false,
  limit
}: TransactionsListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { transactions } = useRealTimeTransactions(initialTransactions);
  
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayTransactions = limit 
    ? filteredTransactions.slice(0, limit) 
    : filteredTransactions;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case "transfer":
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="border-banking-secondary/20 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {showFilters ? "View and search your transactions" : "Your recent transactions"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {showFilters && (
        <div className="px-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
      <CardContent>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status) as any}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {!showFilters && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/transactions")}
          >
            View All Transactions
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
