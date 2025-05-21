
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";

import {
  Home,
  Book,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarCollapse();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: location.pathname === "/dashboard",
    },
    {
      name: "Question Bank",
      href: "/dashboard/question-bank",
      icon: Book,
      current: location.pathname.includes("/dashboard/question-bank"),
    },
    {
      name: "Question Papers",
      href: "/dashboard/question-papers",
      icon: FileText,
      current: location.pathname.includes("/dashboard/question-papers"),
    },
    {
      name: "Results",
      href: "/dashboard/results",
      icon: Users,
      current: location.pathname.includes("/dashboard/results"),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: location.pathname.includes("/dashboard/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b flex justify-between items-center">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary">EduEval</h1>
          )}
          <SidebarToggle 
            isCollapsed={isCollapsed} 
            onToggle={toggleSidebar}
            className={cn(!isCollapsed && "ml-auto")} 
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href}>
              <Button
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1",
                  isCollapsed ? "px-2" : "px-3"
                )}
              >
                <item.icon className={cn("h-5 w-5", item.current ? "text-primary" : "")} />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t">
          <Link to="/">
            <Button variant="ghost" className={cn("w-full justify-start", isCollapsed && "px-2")}>
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">
              {navigation.find((item) => item.current)?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Help
            </Button>
            <Button size="sm">Account</Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
