
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Question {
  id: number;
  question: string;
  board: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: string;
  marks: number;
  type: string;
  createdAt: string;
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    board: "",
    class: "",
    subject: "",
    chapter: "",
    topic: "",
    difficulty: "",
    marks: "",
  });
  const [sortField, setSortField] = useState<keyof Question>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Mock data - in a real application this would be fetched from an API
    const mockQuestions: Question[] = [
      {
        id: 1,
        question: "Explain Newton's Third Law of Motion with examples.",
        board: "CBSE",
        class: "10",
        subject: "Physics",
        chapter: "Laws of Motion",
        topic: "Newton's Laws",
        difficulty: "Medium",
        marks: 5,
        type: "Descriptive",
        createdAt: "2025-05-01",
      },
      {
        id: 2,
        question: "What is photosynthesis? Describe the process in detail.",
        board: "ICSE",
        class: "9",
        subject: "Biology",
        chapter: "Life Processes",
        topic: "Photosynthesis",
        difficulty: "Easy",
        marks: 3,
        type: "Descriptive",
        createdAt: "2025-05-10",
      },
      {
        id: 3,
        question: "Solve the quadratic equation: x² - 5x + 6 = 0",
        board: "CBSE",
        class: "10",
        subject: "Mathematics",
        chapter: "Quadratic Equations",
        topic: "Solving Quadratic Equations",
        difficulty: "Medium",
        marks: 4,
        type: "Problem Solving",
        createdAt: "2025-05-15",
      },
      {
        id: 4,
        question: "Write a short note on the Renaissance period in Europe.",
        board: "CBSE",
        class: "10",
        subject: "History",
        chapter: "Renaissance",
        topic: "European Renaissance",
        difficulty: "Hard",
        marks: 8,
        type: "Descriptive",
        createdAt: "2025-05-12",
      },
      {
        id: 5,
        question: "Describe the structure and function of cell organelles.",
        board: "ICSE",
        class: "9",
        subject: "Biology",
        chapter: "Cell - The Unit of Life",
        topic: "Cell Organelles",
        difficulty: "Medium",
        marks: 5,
        type: "Descriptive",
        createdAt: "2025-05-08",
      },
    ];
    
    setQuestions(mockQuestions);
  }, []);

  const handleSort = (field: keyof Question) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      board: "",
      class: "",
      subject: "",
      chapter: "",
      topic: "",
      difficulty: "",
      marks: "",
    });
  };

  // Filter and sort questions
  const filteredQuestions = questions
    .filter((question) => {
      // Filter by search term
      if (searchTerm && !question.question.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by other criteria
      for (const [key, value] of Object.entries(filters)) {
        if (value && question[key as keyof Question]?.toString() !== value) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === "asc" 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else {
        const numA = Number(fieldA);
        const numB = Number(fieldB);
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }
    });

  const boards = ["CBSE", "ICSE", "State Board"];
  const classes = ["8", "9", "10", "11", "12"];
  const subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "English", "History"];
  const difficulties = ["Easy", "Medium", "Hard"];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <Link to="/dashboard/question-bank/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Board
                  </label>
                  <Select 
                    value={filters.board} 
                    onValueChange={(value) => handleFilterChange("board", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <Select 
                    value={filters.class} 
                    onValueChange={(value) => handleFilterChange("class", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Select 
                    value={filters.subject} 
                    onValueChange={(value) => handleFilterChange("subject", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <Select 
                    value={filters.difficulty} 
                    onValueChange={(value) => handleFilterChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks
                  </label>
                  <Select 
                    value={filters.marks} 
                    onValueChange={(value) => handleFilterChange("marks", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marks" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 8, 10].map((mark) => (
                        <SelectItem key={mark} value={mark.toString()}>
                          {mark}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="ghost" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("question")}
                  >
                    <div className="flex items-center">
                      Question
                      {sortField === "question" && (
                        sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("subject")}
                  >
                    <div className="flex items-center">
                      Subject
                      {sortField === "subject" && (
                        sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("difficulty")}
                  >
                    <div className="flex items-center">
                      Difficulty
                      {sortField === "difficulty" && (
                        sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("marks")}
                  >
                    <div className="flex items-center">
                      Marks
                      {sortField === "marks" && (
                        sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions.map((question) => (
                  <tr key={question.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {question.question.length > 70 
                          ? `${question.question.substring(0, 70)}...` 
                          : question.question}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {question.board} - Class {question.class}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{question.subject}</div>
                      <div className="text-xs text-gray-500">{question.chapter}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          question.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : question.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {question.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/dashboard/question-bank/${question.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to={`/dashboard/question-bank/${question.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
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

export default QuestionBank;
