
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  DragHandle 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    question: "Explain Newton's Third Law of Motion with examples.",
    marks: 5,
    subject: "Physics",
    topic: "Laws of Motion",
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "What are the properties of acids and bases? Explain with examples.",
    marks: 4,
    subject: "Chemistry",
    topic: "Acids and Bases",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "Solve the following quadratic equation: 2x² + 5x - 3 = 0",
    marks: 3,
    subject: "Mathematics",
    topic: "Quadratic Equations",
    difficulty: "Medium"
  },
  {
    id: 4,
    question: "Describe the process of photosynthesis in plants.",
    marks: 5,
    subject: "Biology",
    topic: "Photosynthesis",
    difficulty: "Hard"
  }
];

// Mock data for sections
const mockSections = [
  { id: 1, name: "Section A", totalMarks: 25 },
  { id: 2, name: "Section B", totalMarks: 25 },
  { id: 3, name: "Section C", totalMarks: 50 }
];

const CreateQuestionPaper = () => {
  const [questions, setQuestions] = useState(mockQuestions);
  const [sections, setSections] = useState(mockSections);
  const [activeTab, setActiveTab] = useState("questions");
  const [draggedQuestionId, setDraggedQuestionId] = useState<number | null>(null);

  // Handle drag events
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
    setDraggedQuestionId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
    e.preventDefault();
    
    if (draggedQuestionId === null || draggedQuestionId === id) return;

    const draggedIndex = questions.findIndex(q => q.id === draggedQuestionId);
    const targetIndex = questions.findIndex(q => q.id === id);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newQuestions = [...questions];
    const [draggedQuestion] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, draggedQuestion);
    
    setQuestions(newQuestions);
    setDraggedQuestionId(null);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(question => question.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Create Question Paper</h1>
          <Button>Save Question Paper</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="questions" className="pt-6">
            <div className="bg-white rounded-md shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-[100px]">Marks</TableHead>
                    <TableHead className="w-[150px]">Subject</TableHead>
                    <TableHead className="w-[150px]">Topic</TableHead>
                    <TableHead className="w-[100px]">Difficulty</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow 
                      key={question.id} 
                      isDraggable={true}
                      onDragStart={(e) => handleDragStart(e, question.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, question.id)}
                    >
                      <TableCell>
                        <DragHandle />
                      </TableCell>
                      <TableCell className="font-medium">{question.question}</TableCell>
                      <TableCell>{question.marks}</TableCell>
                      <TableCell>{question.subject}</TableCell>
                      <TableCell>{question.topic}</TableCell>
                      <TableCell>{question.difficulty}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="pt-6">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Question Paper Sections</h2>
              {/* Section management UI here */}
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between border p-4 rounded-md">
                    <div>
                      <h3 className="font-medium">{section.name}</h3>
                      <p className="text-sm text-gray-500">Total Marks: {section.totalMarks}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Add New Section</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="pt-6">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Question Paper Preview</h2>
              {/* Preview UI here */}
              <div className="border p-4 rounded-md">
                <h3 className="text-center font-bold text-xl mb-6">Sample Examination</h3>
                {sections.map((section) => (
                  <div key={section.id} className="mb-6">
                    <h4 className="font-bold border-b pb-2 mb-4">{section.name} ({section.totalMarks} Marks)</h4>
                    <div className="space-y-4">
                      {questions.slice(0, 2).map((question, index) => (
                        <div key={question.id} className="flex">
                          <span className="mr-2">{index + 1}.</span>
                          <div>
                            <p>{question.question}</p>
                            <p className="text-sm text-gray-500">[{question.marks} Marks]</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestionPaper;
