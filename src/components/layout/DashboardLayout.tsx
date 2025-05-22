
import { useState, ReactNode, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Book, 
  FileText, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize sidebarOpen from localStorage if available
  useEffect(() => {
    const storedSidebarState = localStorage.getItem("sidebar-state");
    if (storedSidebarState !== null) {
      setSidebarOpen(storedSidebarState === "open");
    }
    // On mobile, default to closed
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Question Bank", href: "/dashboard/question-bank", icon: Book },
    { name: "Question Papers", href: "/dashboard/question-papers", icon: FileText },
    { name: "Student Results", href: "/dashboard/results", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem("sidebar-state", newState ? "open" : "closed");
  };

  // Fix for sidebar selection issue - check if current path starts exactly with the menu item href
  const isActiveRoute = (href: string) => {
    // Special case for dashboard root to avoid matching all routes
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    // For other routes, match only the direct parent path
    if (href !== "/dashboard") {
      const currentPath = location.pathname;
      const pathParts = currentPath.split('/').filter(Boolean);
      const hrefParts = href.split('/').filter(Boolean);
      
      if (pathParts.length >= hrefParts.length) {
        for (let i = 0; i < hrefParts.length; i++) {
          if (pathParts[i] !== hrefParts[i]) return false;
        }
        return true;
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform ease-in-out duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="font-bold text-xl text-primary">
            EduAssess
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>
        <nav className="flex flex-col h-[calc(100vh-4rem)] py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary-foreground" : "text-sidebar-foreground"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-auto px-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
        sidebarOpen ? "lg:w-64" : "lg:w-20"
      }`}>
        <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border overflow-hidden">
          <div className="flex items-center justify-between h-16 border-b border-sidebar-border px-4">
            {sidebarOpen ? (
              <Link to="/dashboard" className="font-bold text-xl text-primary">
                EduAssess
              </Link>
            ) : (
              <span className="font-bold text-xl text-primary mx-auto">EA</span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${sidebarOpen ? '' : 'mx-auto'} hover:bg-sidebar-accent`}
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 text-sidebar-foreground" />
            </Button>
          </div>
          <nav className="flex flex-col flex-1 py-4 overflow-y-auto">
            <div className="px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <item.icon className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 ${isActive ? "text-primary-foreground" : "text-sidebar-foreground"}`} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto px-3">
              <Button 
                variant="outline" 
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center px-0'}`} 
                onClick={handleLogout}
              >
                <LogOut className={`${sidebarOpen ? 'mr-2' : ''} h-4 w-4`} />
                {sidebarOpen && "Logout"}
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content - adjust the left padding based on sidebar state */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : "lg:pl-20"} flex flex-col`}>
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between h-full px-4 md:px-6">
            <div className="flex items-center">
              <button 
                className="lg:hidden p-2 rounded-md text-foreground hover:bg-accent"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="ml-2 lg:ml-0 text-lg md:text-xl font-medium">
                {menuItems.find(item => isActiveRoute(item.href))?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost"
                className="flex items-center hover:bg-accent rounded-full"
                onClick={() => navigate("/dashboard/profile")}
              >
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:block ml-2 text-sm font-medium">
                  Teacher Name
                </span>
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
