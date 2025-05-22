
import { useState, ReactNode } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-50 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/dashboard" className="font-bold text-xl text-indigo-600">
            EduAssess
          </Link>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <nav className="flex flex-col h-full py-4 overflow-y-auto">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-indigo-500" : "text-gray-400"}`} />
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
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
            {sidebarOpen ? (
              <Link to="/dashboard" className="font-bold text-xl text-indigo-600">
                EduAssess
              </Link>
            ) : (
              <span className="font-bold text-xl text-indigo-600 mx-auto">EA</span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${sidebarOpen ? '' : 'mx-auto'}`}
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <nav className="flex flex-col flex-1 py-4 overflow-y-auto">
            <div className="px-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 ${isActive ? "text-indigo-500" : "text-gray-400"}`} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto px-4">
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

      <div className={`transition-all duration-300 lg:pl-64 ${!sidebarOpen ? "lg:pl-20" : ""} flex flex-col`}>
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 md:px-6">
            <div className="flex items-center">
              <button 
                className="lg:hidden -mr-2 p-2 text-gray-400 hover:text-gray-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-2 lg:ml-0 text-lg md:text-xl font-medium">
                {menuItems.find(item => item.href === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center">
              <div className="ml-4 relative">
                <Button 
                  variant="ghost"
                  className="flex items-center"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden md:block ml-2 text-sm font-medium">
                    Teacher Name
                  </span>
                </Button>
              </div>
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
