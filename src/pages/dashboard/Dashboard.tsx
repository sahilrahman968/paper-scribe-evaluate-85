
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    questions: 0,
    papers: 0,
    evaluations: 0
  });

  useEffect(() => {
    // Mock fetching stats - in a real application this would be an API call
    const mockStats = {
      questions: 145,
      papers: 24,
      evaluations: 350
    };
    
    setStats(mockStats);
  }, []);

  const recentPapers = [
    { id: 1, title: "Mid-term Physics Exam", date: "May 15, 2025", subject: "Physics" },
    { id: 2, title: "Mathematics Final", date: "May 10, 2025", subject: "Mathematics" },
    { id: 3, title: "Chemistry Quiz 3", date: "May 5, 2025", subject: "Chemistry" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Book className="h-8 w-8 text-indigo-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{stats.questions}</div>
                  <p className="text-xs text-gray-500">in your question bank</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/dashboard/question-bank">
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View Question Bank <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Question Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-indigo-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{stats.papers}</div>
                  <p className="text-xs text-gray-500">papers created</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/dashboard/question-papers">
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  Manage Papers <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{stats.evaluations}</div>
                  <p className="text-xs text-gray-500">student answers evaluated</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/dashboard/results">
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View Results <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/question-bank/create">
              <Button variant="outline" className="w-full h-16 text-left justify-start py-6">
                <div>
                  <p className="font-medium">Create New Question</p>
                  <p className="text-xs text-gray-500">Add to your question bank</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard/question-papers/create">
              <Button variant="outline" className="w-full h-16 text-left justify-start py-6">
                <div>
                  <p className="font-medium">Design Question Paper</p>
                  <p className="text-xs text-gray-500">Create a new assessment</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard/results/upload">
              <Button variant="outline" className="w-full h-16 text-left justify-start py-6">
                <div>
                  <p className="font-medium">Upload Answer Sheets</p>
                  <p className="text-xs text-gray-500">Evaluate student submissions</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Recent Papers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Question Papers</h2>
            <Link to="/dashboard/question-papers">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPapers.map((paper) => (
                  <tr key={paper.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{paper.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{paper.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{paper.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/dashboard/question-papers/${paper.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
