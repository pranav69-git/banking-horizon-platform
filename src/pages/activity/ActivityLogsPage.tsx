
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserContext } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Search, AlertCircle, Clock, Filter } from "lucide-react";
import { format } from "date-fns";

export default function ActivityLogsPage() {
  const { activityLogs, logActivity } = useUserContext();
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [displayedLogs, setDisplayedLogs] = useState(activityLogs);

  useEffect(() => {
    logActivity("Activity Logs", "User viewed activity logs");
  }, [logActivity]);

  useEffect(() => {
    let filtered = [...activityLogs];

    // Filter by type if not "all"
    if (filterType !== "all") {
      filtered = filtered.filter(log => log.action === filterType);
    }

    // Filter by search term
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = filtered.filter(
        log => 
          log.action.toLowerCase().includes(lowerFilter) || 
          log.details.toLowerCase().includes(lowerFilter)
      );
    }

    setDisplayedLogs(filtered);
  }, [activityLogs, filter, filterType]);

  // Extract unique action types for filter dropdown
  const actionTypes = Array.from(
    new Set(activityLogs.map(log => log.action))
  );

  // Format date for display
  const formatDate = (date: Date) => {
    if (!(date instanceof Date) && typeof date === 'string') {
      date = new Date(date);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    return format(date, "PPpp");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Activity className="mr-2 h-6 w-6 text-banking-primary" />
              Activity Logs
            </h1>
            <p className="text-muted-foreground">
              Track all activities and actions related to your account
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-9 w-full sm:w-[200px]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                {actionTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {displayedLogs.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No activity logs found</AlertTitle>
            <AlertDescription>
              {filter || filterType !== "all" ? 
                "Try adjusting your search or filter criteria." : 
                "Your account activity will appear here once you start using the application."}
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="border-banking-secondary/20 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-banking-primary">
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.action}</div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {displayedLogs.length > 10 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline">Load More</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
