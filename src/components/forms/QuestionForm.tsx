
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

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
    questionType?: string;
    options?: { text: string; isCorrect: boolean }[];
    rubrics?: { criteria: string; weight: number }[];
  };
  isEdit?: boolean;
}

type RubricItem = {
  criteria: string;
  weight: number;
};

type OptionItem = {
  text: string;
  isCorrect: boolean;
};

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
    difficulty: initialData?.difficulty || "",
    questionType: initialData?.questionType || "subjective"
  });
  
  const [options, setOptions] = useState<OptionItem[]>(
    initialData?.options || [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ]
  );
  
  const [rubrics, setRubrics] = useState<RubricItem[]>(
    initialData?.rubrics || [
      { criteria: "Accuracy of content", weight: 40 },
      { criteria: "Presentation and clarity", weight: 30 },
      { criteria: "Use of examples", weight: 30 }
    ]
  );
  
  const boards = ["CBSE", "ICSE", "State Board"];
  const classes = ["8", "9", "10", "11", "12"];
  const subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "English", "History"];
  const difficulties = ["Easy", "Medium", "Hard"];
  const questionTypes = ["subjective", "single-correct", "multiple-correct", "true-false", "fill-in-the-blank"];
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleOptionChange = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
    const newOptions = [...options];
    newOptions[index] = { 
      ...newOptions[index], 
      [field]: value 
    };
    setOptions(newOptions);
  };
  
  const handleRubricChange = (index: number, field: "criteria" | "weight", value: string | number) => {
    const newRubrics = [...rubrics];
    newRubrics[index] = { 
      ...newRubrics[index], 
      [field]: value 
    };
    setRubrics(newRubrics);
  };
  
  const addRubric = () => {
    setRubrics([...rubrics, { criteria: "", weight: 0 }]);
  };
  
  const removeRubric = (index: number) => {
    const newRubrics = [...rubrics];
    newRubrics.splice(index, 1);
    setRubrics(newRubrics);
  };
  
  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };
  
  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };
  
  const validateFormData = () => {
    // Validate required fields
    if (!formData.board || !formData.class || !formData.subject || !formData.difficulty || !formData.marks) {
      toast.error("Please fill all required fields");
      return false;
    }
    
    // Validate question text
    if (!formData.question) {
      toast.error("Question text is required");
      return false;
    }
    
    // Validate question type specific fields
    if (formData.questionType === "single-correct" || formData.questionType === "multiple-correct") {
      // Check if at least two options exist
      if (options.length < 2) {
        toast.error("At least two options are required");
        return false;
      }
      
      // Check if options have text
      const emptyOptions = options.some(option => !option.text.trim());
      if (emptyOptions) {
        toast.error("All options must have text");
        return false;
      }
      
      // For single correct, exactly one option should be marked correct
      if (formData.questionType === "single-correct") {
        const correctCount = options.filter(option => option.isCorrect).length;
        if (correctCount !== 1) {
          toast.error("Single correct question must have exactly one correct answer");
          return false;
        }
      }
      
      // For multiple correct, at least one option should be marked correct
      if (formData.questionType === "multiple-correct") {
        const correctCount = options.filter(option => option.isCorrect).length;
        if (correctCount < 1) {
          toast.error("Multiple correct question must have at least one correct answer");
          return false;
        }
      }
    }
    
    // Validate rubrics for subjective questions
    if (formData.questionType === "subjective") {
      if (rubrics.length === 0) {
        toast.error("At least one evaluation rubric is required for subjective questions");
        return false;
      }
      
      // Check if rubrics have criteria and weight
      const invalidRubrics = rubrics.some(rubric => 
        !rubric.criteria.trim() || typeof rubric.weight !== 'number' || rubric.weight <= 0
      );
      if (invalidRubrics) {
        toast.error("All rubrics must have criteria and a valid weight");
        return false;
      }
      
      // Check if weights sum up to 100
      const totalWeight = rubrics.reduce((sum, rubric) => sum + rubric.weight, 0);
      if (totalWeight !== 100) {
        toast.error("Rubric weights must sum up to 100%");
        return false;
      }
    }
    
    return true;
  };
  
  const generateQuestion = async () => {
    // Validate required fields for AI generation
    if (!formData.board || !formData.class || !formData.subject || !formData.questionType || !formData.difficulty || !formData.marks) {
      toast.error("Please fill syllabus details, question type, difficulty and marks first");
      return;
    }
    
    setIsGenerating(true);
    
    // Mock AI generation - in a real implementation this would call an AI service
    setTimeout(() => {
      // Generate a question based on the form data and question type
      let generatedQuestion = "";
      let generatedAnswer = "";
      let generatedOptions: OptionItem[] = [];
      let generatedRubrics: RubricItem[] = [];
      
      // Generate content based on question type and subject
      if (formData.questionType === "subjective") {
        if (formData.subject === "Physics") {
          generatedQuestion = "Elaborate on the working principle of a nuclear reactor and discuss the safety mechanisms employed to prevent nuclear accidents.";
          generatedAnswer = "A nuclear reactor operates on the principle of controlled nuclear fission...";
          generatedRubrics = [
            { criteria: "Understanding of nuclear fission", weight: 25 },
            { criteria: "Description of reactor components", weight: 25 },
            { criteria: "Explanation of safety mechanisms", weight: 30 },
            { criteria: "Discussion of potential risks", weight: 20 }
          ];
        } else if (formData.subject === "Mathematics") {
          generatedQuestion = "Prove that the sum of interior angles in a polygon with n sides is (n-2) × 180°.";
          generatedAnswer = "To prove this theorem, we can use the triangulation of polygons...";
          generatedRubrics = [
            { criteria: "Correct approach to proof", weight: 40 },
            { criteria: "Mathematical reasoning", weight: 30 },
            { criteria: "Clarity of explanation", weight: 30 }
          ];
        } else {
          generatedQuestion = `Explain the significance of ${formData.topic || "this topic"} in the context of ${formData.subject}.`;
          generatedAnswer = "The significance of this topic can be understood through...";
          generatedRubrics = [
            { criteria: "Content accuracy", weight: 40 },
            { criteria: "Critical analysis", weight: 30 },
            { criteria: "Examples and application", weight: 30 }
          ];
        }
      } else if (formData.questionType === "single-correct" || formData.questionType === "multiple-correct") {
        if (formData.subject === "Physics") {
          if (formData.questionType === "single-correct") {
            generatedQuestion = "Which of the following is a unit of force?";
            generatedOptions = [
              { text: "Newton", isCorrect: true },
              { text: "Joule", isCorrect: false },
              { text: "Watt", isCorrect: false },
              { text: "Coulomb", isCorrect: false }
            ];
          } else {
            generatedQuestion = "Which of the following are vector quantities?";
            generatedOptions = [
              { text: "Force", isCorrect: true },
              { text: "Velocity", isCorrect: true },
              { text: "Mass", isCorrect: false },
              { text: "Temperature", isCorrect: false }
            ];
          }
        } else if (formData.subject === "Mathematics") {
          if (formData.questionType === "single-correct") {
            generatedQuestion = "What is the derivative of sin(x) with respect to x?";
            generatedOptions = [
              { text: "cos(x)", isCorrect: true },
              { text: "-sin(x)", isCorrect: false },
              { text: "tan(x)", isCorrect: false },
              { text: "-cos(x)", isCorrect: false }
            ];
          } else {
            generatedQuestion = "Which of the following are prime numbers?";
            generatedOptions = [
              { text: "2", isCorrect: true },
              { text: "3", isCorrect: true },
              { text: "4", isCorrect: false },
              { text: "5", isCorrect: true }
            ];
          }
        }
      } else if (formData.questionType === "true-false") {
        generatedQuestion = formData.subject === "Physics" ? 
          "Light travels faster than sound. State whether true or false." : 
          "Every prime number greater than 2 is odd. State whether true or false.";
        generatedOptions = [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ];
      } else if (formData.questionType === "fill-in-the-blank") {
        generatedQuestion = formData.subject === "Physics" ? 
          "The SI unit of electric current is __________." :
          "The value of π (pi) up to 2 decimal places is __________.";
        generatedAnswer = formData.subject === "Physics" ? "ampere" : "3.14";
      }
      
      // Update the form with generated content
      setFormData({
        ...formData,
        question: generatedQuestion,
        answer: generatedAnswer
      });
      
      if (generatedOptions.length > 0) {
        setOptions(generatedOptions);
      }
      
      if (generatedRubrics.length > 0 && formData.questionType === "subjective") {
        setRubrics(generatedRubrics);
      }
      
      setIsGenerating(false);
      toast.success("Question generated successfully!");
    }, 1500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data for submission
    const questionData = {
      ...formData,
      options: formData.questionType === "single-correct" || formData.questionType === "multiple-correct" || formData.questionType === "true-false" ? options : undefined,
      rubrics: formData.questionType === "subjective" ? rubrics : undefined
    };
    
    // Mock submission - in a real implementation this would be an API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isEdit ? "Question updated successfully!" : "Question created successfully!");
      navigate("/dashboard/question-bank");
    }, 1000);
  };
  
  const canGenerateWithAI = () => {
    return formData.board && formData.class && formData.subject && formData.questionType && formData.difficulty && formData.marks;
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
        
        <div>
          <Label htmlFor="questionType">Question Type *</Label>
          <Select 
            value={formData.questionType} 
            onValueChange={(value) => handleInputChange("questionType", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="question">Question *</Label>
          <Button 
            type="button" 
            size="sm" 
            disabled={isGenerating || !canGenerateWithAI()}
            onClick={generateQuestion}
          >
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
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
      
      {(formData.questionType === "single-correct" || formData.questionType === "multiple-correct") && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Options *</Label>
            <Button type="button" size="sm" variant="outline" onClick={addOption}>
              <Plus className="h-4 w-4 mr-1" /> Add Option
            </Button>
          </div>
          
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-3 border p-3 rounded-md">
              {formData.questionType === "single-correct" ? (
                <RadioGroup value={option.isCorrect ? index.toString() : ""} onValueChange={(value) => {
                  const newOptions = options.map((opt, idx) => ({
                    ...opt,
                    isCorrect: idx.toString() === value
                  }));
                  setOptions(newOptions);
                }}>
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                </RadioGroup>
              ) : (
                <Checkbox 
                  checked={option.isCorrect}
                  onCheckedChange={(checked) => handleOptionChange(index, "isCorrect", checked === true)}
                  id={`option-${index}`}
                />
              )}
              <Input
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {formData.questionType === "true-false" && (
        <div className="space-y-2">
          <Label>Correct Answer *</Label>
          <RadioGroup 
            defaultValue={options.findIndex(opt => opt.isCorrect) === 0 ? "true" : "false"}
            onValueChange={(value) => {
              setOptions([
                { text: "True", isCorrect: value === "true" },
                { text: "False", isCorrect: value === "false" }
              ]);
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false">False</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {(formData.questionType === "fill-in-the-blank" || formData.questionType === "subjective") && (
        <div>
          <Label htmlFor="answer">Model Answer {formData.questionType === "fill-in-the-blank" ? "*" : ""}</Label>
          <Textarea
            id="answer"
            placeholder={
              formData.questionType === "fill-in-the-blank" 
                ? "Enter the correct answer" 
                : "Enter model answer (optional)"
            }
            value={formData.answer}
            onChange={(e) => handleInputChange("answer", e.target.value)}
            rows={formData.questionType === "fill-in-the-blank" ? 2 : 5}
            required={formData.questionType === "fill-in-the-blank"}
            className="mt-1"
          />
        </div>
      )}
      
      {formData.questionType === "subjective" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Evaluation Rubric *</Label>
            <Button type="button" size="sm" variant="outline" onClick={addRubric}>
              <Plus className="h-4 w-4 mr-1" /> Add Criteria
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">Total weight must sum to 100%</p>
          
          {rubrics.map((rubric, index) => (
            <div key={index} className="flex items-center gap-3 border p-3 rounded-md">
              <Input
                placeholder="Evaluation criteria"
                value={rubric.criteria}
                onChange={(e) => handleRubricChange(index, "criteria", e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={rubric.weight}
                  onChange={(e) => handleRubricChange(index, "weight", parseInt(e.target.value) || 0)}
                  className="w-20"
                />
                <span>%</span>
              </div>
              {rubrics.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeRubric(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="text-sm font-medium">
            Total: {rubrics.reduce((sum, rubric) => sum + rubric.weight, 0)}%
          </div>
        </div>
      )}
      
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
