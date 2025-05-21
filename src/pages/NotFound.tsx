
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="text-2xl font-medium text-gray-600 mt-4">Page not found</p>
      <p className="text-gray-500 mt-2 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Back to home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
