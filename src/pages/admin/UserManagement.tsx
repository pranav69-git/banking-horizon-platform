import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, MoreHorizontal, UserPlus, Mail, Lock, UserCheck, UserX } from "lucide-react";

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    dateJoined: "2023-01-15",
    accountType: "Premium",
    status: "active",
    accountsCount: 2,
    totalBalance: 7991.25,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    dateJoined: "2023-02-20",
    accountType: "Standard",
    status: "active",
    accountsCount: 1,
    totalBalance: 2150.75,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    dateJoined: "2023-03-10",
    accountType: "Standard",
    status: "inactive",
    accountsCount: 1,
    totalBalance: 0,
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    dateJoined: "2023-01-05",
    accountType: "Premium",
    status: "active",
    accountsCount: 3,
    totalBalance: 15200.50,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    dateJoined: "2023-04-02",
    accountType: "Standard",
    status: "pending",
    accountsCount: 0,
    totalBalance: 0,
  },
  {
    id: 6,
    name: "David Miller",
    email: "david@example.com",
    dateJoined: "2023-02-22",
    accountType: "Standard",
    status: "active",
    accountsCount: 1,
    totalBalance: 3250.25,
  },
  {
    id: 7,
    name: "Eva Garcia",
    email: "eva@example.com",
    dateJoined: "2023-03-15",
    accountType: "Premium",
    status: "active",
    accountsCount: 2,
    totalBalance: 9800.00,
  },
  {
    id: 8,
    name: "Frank Lee",
    email: "frank@example.com",
    dateJoined: "2023-01-30",
    accountType: "Standard",
    status: "inactive",
    accountsCount: 1,
    totalBalance: 120.50,
  },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Filter users based on search and status
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Handle user status toggle
  const toggleUserStatus = (userId: number) => {
    // This would call an API in a real application
    console.log(`Toggling status for user ID: ${userId}`);
  };

  // Handle password reset
  const handleResetPassword = () => {
    if (!selectedUser) return;
    // This would call an API in a real application
    console.log(`Resetting password for user: ${selectedUser.email}`);
    setIsResetPasswordOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage customer accounts and access</p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-banking-primary hover:bg-banking-primary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accountType" className="text-right">
                    Account Type
                  </Label>
                  <Input id="accountType" className="col-span-3" defaultValue="Standard" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsAddUserOpen(false)}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-banking-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === null ? "default" : "outline"}
                  onClick={() => setSelectedStatus(null)}
                  className={selectedStatus === null ? "bg-banking-primary hover:bg-banking-primary/90" : ""}
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === "active" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("active")}
                  className={selectedStatus === "active" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Active
                </Button>
                <Button
                  variant={selectedStatus === "inactive" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("inactive")}
                  className={selectedStatus === "inactive" ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  Inactive
                </Button>
                <Button
                  variant={selectedStatus === "pending" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("pending")}
                  className={selectedStatus === "pending" ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  Pending
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Accounts</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.dateJoined).toLocaleDateString()}</TableCell>
                        <TableCell>{user.accountType}</TableCell>
                        <TableCell>{user.accountsCount}</TableCell>
                        <TableCell>{formatCurrency(user.totalBalance)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.status === "active" 
                                ? "success"
                                : user.status === "inactive" 
                                  ? "destructive"
                                  : "warning"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Send Email</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsResetPasswordOpen(true);
                                }}
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                <span>Reset Password</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status !== "active" ? (
                                <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  <span>Activate Account</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  <span>Deactivate Account</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset User Password</DialogTitle>
              <DialogDescription>
                Send a password reset link to the user's email address.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to reset the password for{" "}
                <span className="font-semibold">{selectedUser?.email}</span>?
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The user will receive an email with instructions to create a new password.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword}>
                Reset Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
