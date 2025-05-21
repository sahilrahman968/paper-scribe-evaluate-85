
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface QuestionPaper {
  id: number;
  title: string;
  subject: string;
  class: string;
  totalMarks: number;
  duration: number;
  created: string;
  sections: number;
  questions: number;
}

const QuestionPapers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  
  useEffect(() => {
    // Mock data - in a real implementation this would be fetched from an API
    const mockPapers: QuestionPaper[] = [
      {
        id: 1,
        title: "Mid-term Physics Exam",
        subject: "Physics",
        class: "10",
        totalMarks: 80,
        duration: 180,
        created: "May 15, 2025",
        sections: 4,
        questions: 25,
      },
      {
        id: 2,
        title: "Mathematics Final",
        subject: "Mathematics",
        class: "12",
        totalMarks: 100,
        duration: 180,
        created: "May 10, 2025",
        sections: 5,
        questions: 30,
      },
      {
        id: 3,
        title: "Chemistry Quiz 3",
        subject: "Chemistry",
        class: "11",
        totalMarks: 25,
        duration: 45,
        created: "May 5, 2025",
        sections: 2,
        questions: 10,
      },
      {
        id: 4,
        title: "Biology Unit Test",
        subject: "Biology",
        class: "9",
        totalMarks: 40,
        duration: 90,
        created: "May 1, 2025",
        sections: 3,
        questions: 15,
      },
      {
        id: 5,
        title: "Annual History Exam",
        subject: "History",
        class: "10",
        totalMarks: 100,
        duration: 180,
        created: "April 28, 2025",
        sections: 4,
        questions: 28,
      },
      {
        id: 6,
        title: "English Literature Mid-term",
        subject: "English",
        class: "11",
        totalMarks: 50,
        duration: 120,
        created: "April 25, 2025",
        sections: 3,
        questions: 12,
      },
    ];
    
    setPapers(mockPapers);
  }, []);
  
  // Filter papers based on search term
  const filteredPapers = papers.filter((paper) => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Question Papers</h1>
          <Link to="/dashboard/question-papers/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Paper
            </Button>
          </Link>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{paper.title}</CardTitle>
                  <CardDescription>
                    {paper.subject} - Class {paper.class}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Marks</p>
                      <p>{paper.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p>{paper.duration} min</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sections</p>
                      <p>{paper.sections}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Questions</p>
                      <p>{paper.questions}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3">
                  <div className="text-xs text-gray-500">
                    Created: {paper.created}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/dashboard/question-papers/${paper.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No question papers found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? "Try different search terms or clear your search"
                : "You haven't created any question papers yet"}
            </p>
            <div className="mt-6">
              <Link to="/dashboard/question-papers/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first paper
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuestionPapers;
