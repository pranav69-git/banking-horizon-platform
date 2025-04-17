
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Home,
  Users,
  BarChart3,
  PiggyBank,
  Receipt,
  LogOut,
  ChevronLeft,
  Settings,
  User,
  Landmark,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

type SidebarProps = {
  userRole?: string;
};

export function Sidebar({ userRole = "customer" }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const customerLinks = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      variant: "default",
    },
    {
      title: "Accounts",
      icon: CreditCard,
      href: "/accounts",
      variant: "ghost",
    },
    {
      title: "Transactions",
      icon: Receipt,
      href: "/transactions",
      variant: "ghost",
    },
    {
      title: "Loans",
      icon: Landmark,
      href: "/loans",
      variant: "ghost",
    },
    {
      title: "Investments",
      icon: PiggyBank,
      href: "/investments",
      variant: "ghost",
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile",
      variant: "ghost",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      variant: "ghost",
    },
  ];

  const adminLinks = [
    {
      title: "Admin Dashboard",
      icon: Home,
      href: "/admin/dashboard",
      variant: "default",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
      variant: "ghost",
    },
    {
      title: "Loan Approvals",
      icon: Landmark,
      href: "/admin/loans",
      variant: "ghost",
    },
    {
      title: "Financial Reports",
      icon: BarChart3,
      href: "/admin/reports",
      variant: "ghost",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      variant: "ghost",
    },
  ];

  const links = userRole === "admin" ? adminLinks : customerLinks;

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("bankingUser");
    // Redirect to login page
    navigate("/login");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button (only visible on mobile) */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleMobileSidebar}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full flex-shrink-0 flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[250px]",
          isMobile && !mobileOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-3">
          <Link
            to={userRole === "admin" ? "/admin/dashboard" : "/dashboard"}
            className={cn(
              "flex items-center gap-2 font-bold text-sidebar-foreground",
              collapsed && "justify-center"
            )}
          >
            <Landmark className="h-6 w-6 text-sidebar-primary" />
            {!collapsed && <span>Banking Horizon</span>}
          </Link>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  location.pathname === link.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  collapsed && "justify-center"
                )}
              >
                <link.icon className="h-5 w-5" />
                {!collapsed && <span>{link.title}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center p-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
