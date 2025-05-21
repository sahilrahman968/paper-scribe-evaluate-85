
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Section {
  id: string;
  title: string;
  instructions?: string;
  questions: {
    id: string;
    question: string;
    marks: number;
  }[];
}

const CreateQuestionPaper = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("structure");
  const [paperTitle, setPaperTitle] = useState("");
  const [paperDescription, setPaperDescription] = useState("");
  const [paperSubject, setPaperSubject] = useState("");
  const [paperClass, setPaperClass] = useState("");
  const [totalMarks, setTotalMarks] = useState(0);
  const [duration, setDuration] = useState("180");
  const [sections, setSections] = useState<Section[]>([
    {
      id: "section-1",
      title: "Section A",
      instructions: "Attempt all questions. Each question carries 1 mark.",
      questions: [
        { id: "q1", question: "Define Newton's First Law of Motion.", marks: 1 },
        { id: "q2", question: "What is the SI unit of force?", marks: 1 },
      ],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addSection = () => {
    const newSectionId = `section-${sections.length + 1}`;
    const sectionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    setSections([
      ...sections,
      {
        id: newSectionId,
        title: `Section ${sectionLetters[sections.length]}`,
        instructions: "",
        questions: [],
      },
    ]);
  };
  
  const removeSection = (sectionId: string) => {
    if (sections.length <= 1) {
      toast.error("Cannot remove the only section");
      return;
    }
    setSections(sections.filter((section) => section.id !== sectionId));
  };
  
  const updateSection = (sectionId: string, field: string, value: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };
  
  const addQuestionToSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [
                ...section.questions,
                { 
                  id: `q-${Date.now()}`, 
                  question: "", 
                  marks: 1 
                },
              ],
            }
          : section
      )
    );
  };
  
  const updateQuestion = (sectionId: string, questionId: string, field: string, value: any) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
              ),
            }
          : section
      )
    );
  };
  
  const removeQuestion = (sectionId: string, questionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter((q) => q.id !== questionId),
            }
          : section
      )
    );
  };
  
  const calculateTotalMarks = () => {
    return sections.reduce(
      (total, section) =>
        total +
        section.questions.reduce((sectionTotal, q) => sectionTotal + q.marks, 0),
      0
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Calculate total marks
    const marks = calculateTotalMarks();
    
    // Validate form
    if (!paperTitle || !paperSubject || !paperClass) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Ensure all sections have at least one question
    for (const section of sections) {
      if (section.questions.length === 0) {
        toast.error(`${section.title} has no questions`);
        setIsSubmitting(false);
        return;
      }
      
      // Check for empty questions
      for (const question of section.questions) {
        if (!question.question.trim()) {
          toast.error(`${section.title} has an empty question`);
          setIsSubmitting(false);
          return;
        }
      }
    }
    
    // Mock submission - in a real implementation this would be an API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Question paper created successfully!");
      navigate("/dashboard/question-papers");
    }, 1000);
  };
  
  // Preview tab content
  const renderPreview = () => {
    return (
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{paperTitle || "Question Paper Title"}</h2>
          <p className="mt-1 text-gray-600">
            {paperSubject && paperClass ? `${paperSubject} - Class ${paperClass}` : "Subject - Class"}
          </p>
          <p className="mt-1 text-gray-600">
            Time: {duration} minutes | Total Marks: {calculateTotalMarks()}
          </p>
          {paperDescription && (
            <p className="mt-3 text-sm">{paperDescription}</p>
          )}
        </div>
        
        {sections.map((section, index) => (
          <div key={section.id} className="mb-8">
            <h3 className="text-lg font-bold border-b pb-1 mb-3">
              {section.title}
              {calculateSectionMarks(section.questions) > 0 && 
                <span className="text-gray-600 text-sm font-normal ml-2">
                  ({calculateSectionMarks(section.questions)} Marks)
                </span>
              }
            </h3>
            {section.instructions && (
              <p className="text-sm italic mb-4">{section.instructions}</p>
            )}
            
            <ol className="list-decimal pl-6 space-y-4">
              {section.questions.map((q, qIndex) => (
                <li key={q.id}>
                  <span>{q.question}</span>
                  <span className="text-gray-600 text-sm ml-2">
                    [{q.marks} {q.marks === 1 ? "mark" : "marks"}]
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  };
  
  const calculateSectionMarks = (questions: { marks: number }[]) => {
    return questions.reduce((total, q) => total + q.marks, 0);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create Question Paper</h1>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Question Paper"}
          </Button>
        </div>
        
        <Tabs defaultValue="structure" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Paper Structure</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle>Paper Details</CardTitle>
                <CardDescription>
                  Set up the basic information for your question paper.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="paper-title">Paper Title *</Label>
                      <Input
                        id="paper-title"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        placeholder="e.g., Mid-Term Physics Examination"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="paper-subject">Subject *</Label>
                      <Select
                        value={paperSubject}
                        onValueChange={setPaperSubject}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Physics", "Chemistry", "Biology", "Mathematics", "English", "History"].map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="paper-class">Class *</Label>
                      <Select
                        value={paperClass}
                        onValueChange={setPaperClass}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {["8", "9", "10", "11", "12"].map((cls) => (
                            <SelectItem key={cls} value={cls}>
                              {cls}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="10"
                        step="10"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="paper-description">Description (Optional)</Label>
                      <Textarea
                        id="paper-description"
                        value={paperDescription}
                        onChange={(e) => setPaperDescription(e.target.value)}
                        placeholder="Add any additional information about the paper"
                        rows={3}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Sections</h2>
                <Button onClick={addSection}>
                  <Plus className="h-4 w-4 mr-2" /> 
                  Add Section
                </Button>
              </div>
              
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <Input 
                          value={section.title} 
                          onChange={(e) => updateSection(section.id, "title", e.target.value)}
                          className="max-w-xs font-medium"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          disabled={sections.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`section-${index}-instructions`}>Instructions (Optional)</Label>
                          <Textarea
                            id={`section-${index}-instructions`}
                            value={section.instructions}
                            onChange={(e) => updateSection(section.id, "instructions", e.target.value)}
                            placeholder="Add instructions for this section"
                            rows={2}
                          />
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-2">
                            <Label>Questions ({section.questions.length})</Label>
                            <span className="text-sm text-gray-500">
                              Total Marks: {calculateSectionMarks(section.questions)}
                            </span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setActiveTab("questions");
                              setTimeout(() => {
                                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                              }, 100);
                            }}
                          >
                            Manage Questions <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="questions">
            <div className="space-y-8">
              {sections.map((section) => (
                <Card key={section.id} id={section.id}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>
                      {section.instructions || "No instructions provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {section.questions.length > 0 ? (
                      <div className="space-y-4">
                        {section.questions.map((question, qIndex) => (
                          <div key={question.id} className="flex items-start gap-4 border-b pb-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Q{qIndex + 1}.</span>
                                <Textarea
                                  value={question.question}
                                  onChange={(e) => updateQuestion(section.id, question.id, "question", e.target.value)}
                                  placeholder="Enter question text"
                                />
                              </div>
                              <div className="flex items-center">
                                <Label htmlFor={`marks-${question.id}`} className="mr-2 whitespace-nowrap">
                                  Marks:
                                </Label>
                                <Select
                                  value={question.marks.toString()}
                                  onValueChange={(value) => updateQuestion(section.id, question.id, "marks", parseInt(value))}
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
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
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(section.id, question.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-gray-500">
                        No questions added to this section yet.
                      </div>
                    )}
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => addQuestionToSection(section.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            {renderPreview()}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestionPaper;
