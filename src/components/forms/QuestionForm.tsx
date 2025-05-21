
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

interface QuestionFormProps {
  type: "manual" | "ai";
  initialData?: {
    question: string;
    answer?: string;
    board: string;
    class: string;
    subject: string;
    chapter: string;
    topic: string;
    marks: string;
    difficulty: string;
  };
  isEdit?: boolean;
}

const QuestionForm = ({ type, initialData, isEdit = false }: QuestionFormProps) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
    board: initialData?.board || "",
    class: initialData?.class || "",
    subject: initialData?.subject || "",
    chapter: initialData?.chapter || "",
    topic: initialData?.topic || "",
    marks: initialData?.marks || "",
    difficulty: initialData?.difficulty || ""
  });
  
  const boards = ["CBSE", "ICSE", "State Board"];
  const classes = ["8", "9", "10", "11", "12"];
  const subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "English", "History"];
  const difficulties = ["Easy", "Medium", "Hard"];
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const generateQuestion = async () => {
    setIsGenerating(true);
    
    // Mock AI generation - in a real implementation this would call an AI service
    setTimeout(() => {
      // Generate a question based on the form data
      let generatedQuestion = "";
      
      if (formData.subject === "Physics") {
        if (formData.topic.includes("Newton")) {
          generatedQuestion = "Explain how Newton's Third Law of Motion applies in rocket propulsion. Illustrate with an example.";
        } else {
          generatedQuestion = "Describe the relationship between force, mass, and acceleration according to Newton's Second Law.";
        }
      } else if (formData.subject === "Mathematics") {
        generatedQuestion = "Solve the quadratic equation: 2x² - 5x + 3 = 0 using the quadratic formula. Show your working.";
      } else {
        generatedQuestion = `Explain the concept of ${formData.topic || "this topic"} in detail with examples.`;
      }
      
      setFormData({
        ...formData,
        question: generatedQuestion,
        answer: "Sample answer would be provided by the AI."
      });
      
      setIsGenerating(false);
      toast.success("Question generated successfully!");
    }, 1500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.question || !formData.board || !formData.class || 
        !formData.subject || !formData.difficulty || !formData.marks) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Mock submission - in a real implementation this would be an API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isEdit ? "Question updated successfully!" : "Question created successfully!");
      navigate("/dashboard/question-bank");
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="board">Examination Board *</Label>
          <Select 
            value={formData.board} 
            onValueChange={(value) => handleInputChange("board", value)}
            required
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
          <Label htmlFor="class">Class *</Label>
          <Select 
            value={formData.class} 
            onValueChange={(value) => handleInputChange("class", value)}
            required
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
          <Label htmlFor="subject">Subject *</Label>
          <Select 
            value={formData.subject} 
            onValueChange={(value) => handleInputChange("subject", value)}
            required
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
          <Label htmlFor="chapter">Chapter</Label>
          <Input
            id="chapter"
            placeholder="Enter chapter name"
            value={formData.chapter}
            onChange={(e) => handleInputChange("chapter", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="Enter topic name"
            value={formData.topic}
            onChange={(e) => handleInputChange("topic", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="marks">Marks *</Label>
          <Select 
            value={formData.marks} 
            onValueChange={(value) => handleInputChange("marks", value)}
            required
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
        
        <div>
          <Label htmlFor="difficulty">Difficulty Level *</Label>
          <Select 
            value={formData.difficulty} 
            onValueChange={(value) => handleInputChange("difficulty", value)}
            required
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
      </div>
      
      {type === "ai" && (
        <div className="border border-dashed border-gray-300 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">AI Question Generation</h3>
          <p className="text-sm text-gray-500 mb-4">
            Fill in the syllabus details above and click "Generate Question" to create a question using AI.
          </p>
          <Button 
            type="button"
            onClick={generateQuestion}
            disabled={isGenerating || !formData.board || !formData.class || !formData.subject}
          >
            {isGenerating ? "Generating..." : "Generate Question"}
          </Button>
        </div>
      )}
      
      <div>
        <Label htmlFor="question">Question *</Label>
        <Textarea
          id="question"
          placeholder="Enter question text here"
          value={formData.question}
          onChange={(e) => handleInputChange("question", e.target.value)}
          rows={5}
          required
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="answer">Model Answer</Label>
        <Textarea
          id="answer"
          placeholder="Enter model answer (optional)"
          value={formData.answer}
          onChange={(e) => handleInputChange("answer", e.target.value)}
          rows={5}
          className="mt-1"
        />
      </div>
      
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/question-bank")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEdit ? "Update Question" : "Save Question"}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
