
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import QuestionBank from "./pages/dashboard/question-bank/QuestionBank";
import CreateQuestion from "./pages/dashboard/question-bank/CreateQuestion";
import QuestionPapers from "./pages/dashboard/question-papers/QuestionPapers";
import CreateQuestionPaper from "./pages/dashboard/question-papers/CreateQuestionPaper";
import UploadResults from "./pages/dashboard/results/UploadResults";

// Auth guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    
    if (!user && !location.pathname.startsWith("/auth")) {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, location]);
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/question-bank" 
        element={
          <ProtectedRoute>
            <QuestionBank />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/question-bank/create" 
        element={
          <ProtectedRoute>
            <CreateQuestion />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/question-papers" 
        element={
          <ProtectedRoute>
            <QuestionPapers />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/question-papers/create" 
        element={
          <ProtectedRoute>
            <CreateQuestionPaper />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/results/upload" 
        element={
          <ProtectedRoute>
            <UploadResults />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
