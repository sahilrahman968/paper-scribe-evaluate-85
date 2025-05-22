import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, ArrowRight, FileText, BookOpen, Wand, Check, X } from "lucide-react";
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
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface SubQuestion {
  id: string;
  question: string;
  options?: string[];
  correctOption?: number;
  marks: number;
}

interface Section {
  id: string;
  title: string;
  instructions?: string;
  questions: {
    id: string;
    question: string;
    marks: number;
    type?: string;
    chapter?: string;
    topic?: string;
    subQuestions?: SubQuestion[];
    options?: string[];
    correctOption?: number;
    matches?: {left: string, right: string}[];
  }[];
}

// Sample data for demo purposes
const QUESTION_TYPES = [
  "Multiple Choice",
  "Short Answer",
  "Long Answer",
  "True/False",
  "Fill in the blanks",
  "Match the following",
  "Composite"
];

const CHAPTERS = [
  "Chapter 1: Introduction",
  "Chapter 2: Fundamentals",
  "Chapter 3: Advanced Concepts",
  "Chapter 4: Applications",
  "Chapter 5: Future Perspectives"
];

const TOPICS = {
  "Chapter 1: Introduction": [
    "Basic Principles", 
    "Historical Context", 
    "Key Terminology"
  ],
  "Chapter 2: Fundamentals": [
    "Core Concepts", 
    "Basic Formulas", 
    "Problem Solving Approaches"
  ],
  "Chapter 3: Advanced Concepts": [
    "Complex Theories", 
    "Mathematical Models", 
    "Critical Analysis"
  ],
  "Chapter 4: Applications": [
    "Real World Examples", 
    "Case Studies", 
    "Practical Implementations"
  ],
  "Chapter 5: Future Perspectives": [
    "Emerging Trends", 
    "Research Directions", 
    "Potential Impacts"
  ]
};

// Sample question bank data
const SAMPLE_QUESTION_BANK = [
  {
    id: "qb1",
    question: "Define Newton's First Law of Motion and explain its significance.",
    type: "Long Answer",
    marks: 5,
    chapter: "Chapter 2: Fundamentals",
    topic: "Core Concepts"
  },
  {
    id: "qb2",
    question: "What is the SI unit of force?",
    type: "Short Answer",
    marks: 1,
    chapter: "Chapter 1: Introduction",
    topic: "Key Terminology"
  },
  {
    id: "qb3",
    question: "Describe the process of photosynthesis.",
    type: "Long Answer",
    marks: 5,
    chapter: "Chapter 3: Advanced Concepts",
    topic: "Complex Theories"
  },
  {
    id: "qb4",
    question: "Calculate the acceleration of an object with mass 10kg when a force of 50N is applied.",
    type: "Short Answer",
    marks: 3,
    chapter: "Chapter 2: Fundamentals",
    topic: "Basic Formulas"
  },
  {
    id: "qb5",
    question: "The Pythagorean theorem applies to which type of triangle?",
    type: "Multiple Choice",
    marks: 1,
    chapter: "Chapter 2: Fundamentals",
    topic: "Core Concepts"
  }
];

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
        { id: "q1", question: "Define Newton's First Law of Motion.", marks: 1, type: "Short Answer", chapter: "Chapter 2: Fundamentals", topic: "Core Concepts" },
        { id: "q2", question: "What is the SI unit of force?", marks: 1, type: "Short Answer", chapter: "Chapter 1: Introduction", topic: "Key Terminology" },
      ],
    },
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(QUESTION_TYPES[0]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionMarks, setNewQuestionMarks] = useState(1);
  const [questionAddMethod, setQuestionAddMethod] = useState<"manual" | "bank" | "ai">("manual");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBankQuestions, setSelectedBankQuestions] = useState<string[]>([]);
  
  // New state for question options
  const [questionOptions, setQuestionOptions] = useState<string[]>(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [matchingItems, setMatchingItems] = useState<{left: string, right: string}[]>([
    {left: "", right: ""},
    {left: "", right: ""},
    {left: "", right: ""},
    {left: "", right: ""}
  ]);
  
  // State for sub-questions in composite questions
  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([]);
  const [currentSubQuestion, setCurrentSubQuestion] = useState<SubQuestion | null>(null);
  const [isEditingSubQuestion, setIsEditingSubQuestion] = useState(false);
  
  // Filter topics based on selected chapter
  const availableTopics = selectedChapter ? TOPICS[selectedChapter as keyof typeof TOPICS] || [] : [];
  
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
    setCurrentSectionId(sectionId);
    setNewQuestionText("");
    setSelectedQuestionType(QUESTION_TYPES[0]);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setNewQuestionMarks(1);
    setQuestionAddMethod("manual");
    setAiPrompt("");
    setSelectedBankQuestions([]);
    setQuestionOptions(["", "", "", ""]);
    setCorrectOptionIndex(0);
    setMatchingItems([
      {left: '', right: ''},
      {left: '', right: ''},
      {left: '', right: ''},
      {left: '', right: ''}
    ]);
    setSubQuestions([]);
    setCurrentSubQuestion(null);
    setIsEditingSubQuestion(false);
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
  
  // Handle updating question options
  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...questionOptions];
    newOptions[index] = value;
    setQuestionOptions(newOptions);
  };
  
  // Handle updating matching items
  const updateMatchingItem = (index: number, side: 'left' | 'right', value: string) => {
    const newItems = [...matchingItems];
    newItems[index] = { ...newItems[index], [side]: value };
    setMatchingItems(newItems);
  };
  
  // Add another matching item
  const addMatchingItem = () => {
    setMatchingItems([...matchingItems, { left: '', right: '' }]);
  };
  
  // Remove a matching item
  const removeMatchingItem = (index: number) => {
    if (matchingItems.length <= 2) {
      toast.error("Matching questions require at least 2 pairs");
      return;
    }
    setMatchingItems(matchingItems.filter((_, i) => i !== index));
  };
  
  // Add another option
  const addOption = () => {
    setQuestionOptions([...questionOptions, '']);
  };
  
  // Remove an option
  const removeOption = (index: number) => {
    if (questionOptions.length <= 2) {
      toast.error("Multiple choice questions require at least 2 options");
      return;
    }
    const newOptions = questionOptions.filter((_, i) => i !== index);
    setQuestionOptions(newOptions);
    
    // Adjust correctOptionIndex if needed
    if (index === correctOptionIndex) {
      setCorrectOptionIndex(0);
    } else if (index < correctOptionIndex) {
      setCorrectOptionIndex(correctOptionIndex - 1);
    }
  };
  
  // Handle adding sub-question
  const addSubQuestion = () => {
    setCurrentSubQuestion({
      id: `sub-${Date.now()}`,
      question: '',
      marks: 1,
    });
    setIsEditingSubQuestion(true);
  };
  
  // Save current sub-question
  const saveSubQuestion = () => {
    if (!currentSubQuestion) return;
    
    if (!currentSubQuestion.question.trim()) {
      toast.error("Sub-question text cannot be empty");
      return;
    }
    
    if (isEditingSubQuestion) {
      // Edit existing sub-question
      setSubQuestions(subQuestions.map(sq => 
        sq.id === currentSubQuestion.id ? currentSubQuestion : sq
      ));
    } else {
      // Add new sub-question
      setSubQuestions([...subQuestions, currentSubQuestion]);
    }
    
    setCurrentSubQuestion(null);
    setIsEditingSubQuestion(false);
  };
  
  // Edit a sub-question
  const editSubQuestion = (subQuestionId: string) => {
    const subQuestion = subQuestions.find(sq => sq.id === subQuestionId);
    if (subQuestion) {
      setCurrentSubQuestion(subQuestion);
      setIsEditingSubQuestion(true);
    }
  };
  
  // Delete a sub-question
  const deleteSubQuestion = (subQuestionId: string) => {
    setSubQuestions(subQuestions.filter(sq => sq.id !== subQuestionId));
  };
  
  // Calculate total marks from sub-questions
  const calculateSubQuestionMarks = () => {
    return subQuestions.reduce((total, sq) => total + sq.marks, 0);
  };
  
  // Handle adding question based on selected method
  const handleAddQuestion = () => {
    if (!currentSectionId) return;
    
    if (questionAddMethod === "manual") {
      // Validate manual question input
      if (!newQuestionText.trim()) {
        toast.error("Question text cannot be empty");
        return;
      }
      
      // Validate question type specific requirements
      if (selectedQuestionType === "Multiple Choice") {
        if (questionOptions.filter(opt => opt.trim()).length < 2) {
          toast.error("Multiple choice questions need at least 2 non-empty options");
          return;
        }
      }
      
      if (selectedQuestionType === "Match the following") {
        if (matchingItems.filter(item => item.left.trim() && item.right.trim()).length < 2) {
          toast.error("Matching questions need at least 2 complete pairs");
          return;
        }
      }
      
      if (selectedQuestionType === "Composite") {
        if (subQuestions.length === 0) {
          toast.error("Composite questions need at least one sub-question");
          return;
        }
      }
      
      // Create question object based on type
      let questionData: any = {
        id: `q-${Date.now()}`,
        question: newQuestionText,
        marks: selectedQuestionType === "Composite" ? calculateSubQuestionMarks() : newQuestionMarks,
        type: selectedQuestionType,
        chapter: selectedChapter || undefined,
        topic: selectedTopic || undefined,
      };
      
      // Add type-specific data
      if (selectedQuestionType === "Multiple Choice") {
        questionData.options = questionOptions.filter(opt => opt.trim());
        questionData.correctOption = correctOptionIndex;
      }
      
      if (selectedQuestionType === "Match the following") {
        questionData.matches = matchingItems.filter(item => item.left.trim() && item.right.trim());
      }
      
      if (selectedQuestionType === "True/False") {
        questionData.options = ["True", "False"];
        questionData.correctOption = correctOptionIndex;
      }
      
      if (selectedQuestionType === "Composite") {
        questionData.subQuestions = [...subQuestions];
      }
      
      // Add question to section
      setSections(
        sections.map((section) =>
          section.id === currentSectionId
            ? {
                ...section,
                questions: [
                  ...section.questions,
                  questionData,
                ],
              }
            : section
        )
      );
      
      toast.success("Question added successfully");
      setCurrentSectionId(null);
      
    } else if (questionAddMethod === "bank") {
      // Validate question bank selection
      if (selectedBankQuestions.length === 0) {
        toast.error("Please select at least one question from the bank");
        return;
      }
      
      // Add selected questions from question bank
      const selectedQuestions = SAMPLE_QUESTION_BANK.filter(q => 
        selectedBankQuestions.includes(q.id)
      );
      
      setSections(
        sections.map((section) =>
          section.id === currentSectionId
            ? {
                ...section,
                questions: [
                  ...section.questions,
                  ...selectedQuestions.map(q => ({
                    id: `q-${Date.now()}-${q.id}`,
                    question: q.question,
                    marks: q.marks,
                    type: q.type,
                    chapter: q.chapter,
                    topic: q.topic,
                  })),
                ],
              }
            : section
        )
      );
      
      toast.success(`${selectedQuestions.length} questions added from question bank`);
      setCurrentSectionId(null);
      
    } else if (questionAddMethod === "ai") {
      // Validate AI prompt
      if (!aiPrompt.trim()) {
        toast.error("Please enter a prompt for AI generation");
        return;
      }
      
      // Mock AI question generation
      setIsGenerating(true);
      
      setTimeout(() => {
        // Simulate AI generating a question based on prompt
        const aiGeneratedQuestion = {
          id: `q-${Date.now()}-ai`,
          question: `[AI Generated] ${aiPrompt}`,
          marks: newQuestionMarks,
          type: selectedQuestionType,
          chapter: selectedChapter || undefined,
          topic: selectedTopic || undefined,
        };
        
        setSections(
          sections.map((section) =>
            section.id === currentSectionId
              ? {
                  ...section,
                  questions: [
                    ...section.questions,
                    aiGeneratedQuestion,
                  ],
                }
              : section
          )
        );
        
        setIsGenerating(false);
        toast.success("AI generated question added successfully");
        setCurrentSectionId(null);
      }, 1500);
    }
  };
  
  // Toggle selection of questions from question bank
  const toggleQuestionSelection = (questionId: string) => {
    if (selectedBankQuestions.includes(questionId)) {
      setSelectedBankQuestions(selectedBankQuestions.filter(id => id !== questionId));
    } else {
      setSelectedBankQuestions([...selectedBankQuestions, questionId]);
    }
  };
  
  // Function to check if all bank questions are selected
  const areAllBankQuestionsSelected = () => {
    return SAMPLE_QUESTION_BANK.length === selectedBankQuestions.length;
  };
  
  // Function to toggle selection of all bank questions
  const toggleAllBankQuestions = () => {
    if (areAllBankQuestionsSelected()) {
      setSelectedBankQuestions([]);
    } else {
      setSelectedBankQuestions(SAMPLE_QUESTION_BANK.map(q => q.id));
    }
  };
  
  // Calculate section marks
  const calculateSectionMarks = (questions: { marks: number }[]) => {
    return questions.reduce((total, q) => total + q.marks, 0);
  };
  
  // Render dynamic question form based on type
  const renderQuestionTypeForm = () => {
    switch (selectedQuestionType) {
      case "Multiple Choice":
        return (
          <div className="space-y-4 mt-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Multiple Choice Options</h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addOption}
              >
                Add Option
              </Button>
            </div>
            
            {questionOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <RadioGroup value={correctOptionIndex.toString()} onValueChange={(value) => setCorrectOptionIndex(parseInt(value))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  </div>
                </RadioGroup>
                <Input
                  value={option}
                  onChange={(e) => updateQuestionOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                {questionOptions.length > 2 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Select the radio button next to the correct answer.</p>
          </div>
        );
        
      case "True/False":
        return (
          <div className="space-y-4 mt-4 border rounded-md p-4">
            <h4 className="text-sm font-medium">Select the correct answer:</h4>
            <RadioGroup value={correctOptionIndex.toString()} onValueChange={(value) => setCorrectOptionIndex(parseInt(value))}>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="true-option" />
                  <Label htmlFor="true-option">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="false-option" />
                  <Label htmlFor="false-option">False</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        );
        
      case "Match the following":
        return (
          <div className="space-y-4 mt-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Matching Pairs</h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addMatchingItem}
              >
                Add Pair
              </Button>
            </div>
            
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <div className="font-medium text-sm">Column A</div>
              <div className="font-medium text-sm">Column B</div>
              <div></div>
              
              {matchingItems.map((item, index) => (
                <React.Fragment key={index}>
                  <Input
                    value={item.left}
                    onChange={(e) => updateMatchingItem(index, 'left', e.target.value)}
                    placeholder={`Item ${index + 1}`}
                  />
                  <Input
                    value={item.right}
                    onChange={(e) => updateMatchingItem(index, 'right', e.target.value)}
                    placeholder={`Match ${index + 1}`}
                  />
                  {matchingItems.length > 2 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeMatchingItem(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
        
      case "Composite":
        return (
          <div className="space-y-4 mt-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">
                Sub-questions (Total: {calculateSubQuestionMarks()} marks)
              </h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addSubQuestion}
                disabled={isEditingSubQuestion}
              >
                Add Sub-question
              </Button>
            </div>
            
            {!isEditingSubQuestion ? (
              <div className="space-y-2">
                {subQuestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sub-questions added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {subQuestions.map((sq, index) => (
                      <div key={sq.id} className="flex items-center justify-between p-2 border rounded-sm">
                        <div className="flex-1 mr-2">
                          <p className="text-sm font-medium">{index + 1}. {sq.question}</p>
                          <p className="text-xs text-muted-foreground">{sq.marks} {sq.marks === 1 ? 'mark' : 'marks'}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => editSubQuestion(sq.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteSubQuestion(sq.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 border p-3 rounded-md">
                <div>
                  <Label htmlFor="sub-question-text">Sub-question Text</Label>
                  <Textarea
                    id="sub-question-text"
                    value={currentSubQuestion?.question || ''}
                    onChange={(e) => setCurrentSubQuestion({
                      ...currentSubQuestion!,
                      question: e.target.value
                    })}
                    placeholder="Enter sub-question text"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sub-question-marks">Marks</Label>
                  <Select
                    value={currentSubQuestion?.marks.toString() || "1"}
                    onValueChange={(value) => setCurrentSubQuestion({
                      ...currentSubQuestion!,
                      marks: parseInt(value)
                    })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((mark) => (
                        <SelectItem key={mark} value={mark.toString()}>
                          {mark}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCurrentSubQuestion(null);
                      setIsEditingSubQuestion(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={saveSubQuestion}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Preview tab content
  const renderPreview = () => {
    return (
      <div className="bg-white p-4 md:p-8 rounded-lg shadow">
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
                  <div>
                    <span>{q.question}</span>
                    <span className="text-gray-600 text-sm ml-2">
                      [{q.marks} {q.marks === 1 ? "mark" : "marks"}]
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {q.type && <span className="mr-3">{q.type}</span>}
                    {q.chapter && <span className="mr-3">{q.chapter}</span>}
                    {q.topic && <span>{q.topic}</span>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
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
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <Label htmlFor={`type-${question.id}`} className="text-xs mb-1 block">
                                    Type
                                  </Label>
                                  <Select
                                    value={question.type || QUESTION_TYPES[0]}
                                    onValueChange={(value) => updateQuestion(section.id, question.id, "type", value)}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {QUESTION_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`chapter-${question.id}`} className="text-xs mb-1 block">
                                    Chapter
                                  </Label>
                                  <Select
                                    value={question.chapter || ""}
                                    onValueChange={(value) => {
                                      updateQuestion(section.id, question.id, "chapter", value);
                                      // Reset topic when chapter changes
                                      updateQuestion(section.id, question.id, "topic", "");
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select chapter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {CHAPTERS.map((chapter) => (
                                        <SelectItem key={chapter} value={chapter}>
                                          {chapter}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`topic-${question.id}`} className="text-xs mb-1 block">
                                    Topic
                                  </Label>
                                  <Select
                                    value={question.topic || ""}
                                    onValueChange={(value) => updateQuestion(section.id, question.id, "topic", value)}
                                    disabled={!question.chapter}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={!question.chapter ? "Select chapter first" : "Select topic"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {question.chapter && 
                                        TOPICS[question.chapter as keyof typeof TOPICS]?.map((topic) => (
                                          <SelectItem key={topic} value={topic}>
                                            {topic}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`marks-${question.id}`} className="text-xs mb-1 block">
                                    Marks
                                  </Label>
                                  <Select
                                    value={question.marks.toString()}
                                    onValueChange={(value) => updateQuestion(section.id, question.id, "marks", parseInt(value))}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
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
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => addQuestionToSection(section.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="wide" className="overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Add Question to {section.title}</SheetTitle>
                            <SheetDescription>
                              Choose how you want to add a question
                            </SheetDescription>
                          </SheetHeader>
                          
                          <div className="py-4">
                            <Tabs defaultValue="manual" onValueChange={(value) => setQuestionAddMethod(value as "manual" | "bank" | "ai")}>
                              <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="manual" className="flex items-center gap-1">
                                  <FileText className="h-3.5 w-3.5" /> Manual
                                </TabsTrigger>
                                <TabsTrigger value="bank" className="flex items-center gap-1">
                                  <BookOpen className="h-3.5 w-3.5" /> Question Bank
                                </TabsTrigger>
                                <TabsTrigger value="ai" className="flex items-center gap-1">
                                  <Wand className="h-3.5 w-3.5" /> Generate with AI
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="manual" className="space-y-4">
                                <div>
                                  <Label htmlFor="new-question-text">Question Text</Label>
                                  <Textarea
                                    id="new-question-text"
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                    placeholder="Enter your question here"
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="new-question-type">Question Type</Label>
                                    <Select
                                      value={selectedQuestionType}
                                      onValueChange={setSelectedQuestionType}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {QUESTION_TYPES.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  {selectedQuestionType !== "Composite" && (
                                    <div>
                                      <Label htmlFor="new-question-marks">Marks</Label>
                                      <Select
                                        value={newQuestionMarks.toString()}
                                        onValueChange={(value) => setNewQuestionMarks(parseInt(value))}
                                      >
                                        <SelectTrigger>
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
                                  )}
                                </div>
                                
                                {renderQuestionTypeForm()}
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="new-question-chapter">Chapter</Label>
                                    <Select
                                      value={selectedChapter || ""}
                                      onValueChange={(value) => {
                                        setSelectedChapter(value);
                                        setSelectedTopic(null);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select chapter" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {CHAPTERS.map((chapter) => (
                                          <SelectItem key={chapter} value={chapter}>
                                            {chapter}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="new-question-topic">Topic</Label>
                                    <Select
                                      value={selectedTopic || ""}
                                      onValueChange={setSelectedTopic}
                                      disabled={!selectedChapter}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder={!selectedChapter ? "Select chapter first" : "Select topic"} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableTopics.map((topic) => (
                                          <SelectItem key={topic} value={topic}>
                                            {topic}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="p-4 border rounded-lg bg-muted">
                                  <p className="text-sm">The AI will generate a question based on your description and selected parameters. The question will be tailored to the subject and class level of this question paper.</p>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="bank" className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                  <Label>Available Questions</Label>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={toggleAllBankQuestions}
                                  >
                                    {areAllBankQuestionsSelected() ? "Deselect All" : "Select All"}
                                  </Button>
                                </div>
                                
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="grid grid-cols-12 bg-muted px-3 py-2 text-xs font-semibold">
                                    <div className="col-span-1"></div>
                                    <div className="col-span-5">Question</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-3">Chapter/Topic</div>
                                    <div className="col-span-1 text-right">Marks</div>
                                  </div>
                                  
                                  <div className="divide-y">
                                    {SAMPLE_QUESTION_BANK.map((question) => (
                                      <div 
                                        key={question.id} 
                                        className={`grid grid-cols-12 px-3 py-2 text-sm hover:bg-muted/50 ${
                                          selectedBankQuestions.includes(question.id) ? 'bg-secondary/50' : ''
                                        }`}
                                        onClick={() => toggleQuestionSelection(question.id)}
                                      >
                                        <div className="col-span-1">
                                          <input 
                                            type="checkbox" 
                                            checked={selectedBankQuestions.includes(question.id)}
                                            onChange={() => {}}
                                            className="rounded"
                                          />
                                        </div>
                                        <div className="col-span-5 line-clamp-2">{question.question}</div>
                                        <div className="col-span-2">{question.type}</div>
                                        <div className="col-span-3 text-xs">
                                          <div>{question.chapter?.split(":")[0]}</div>
                                          <div className="text-muted-foreground">{question.topic}</div>
                                        </div>
                                        <div className="col-span-1 text-right">{question.marks}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="text-sm">
                                  <span className="font-medium">Selected:</span> {selectedBankQuestions.length} questions
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="ai" className="space-y-4">
                                <div>
                                  <Label htmlFor="ai-prompt">Describe the question you want to generate</Label>
                                  <Textarea
                                    id="ai-prompt"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="e.g., Create a multiple choice question about Newton's laws of motion for class 10 physics"
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="ai-question-type">Question Type</Label>
                                    <Select
                                      value={selectedQuestionType}
                                      onValueChange={setSelectedQuestionType}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {QUESTION_TYPES.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="ai-question-marks">Marks</Label>
                                    <Select
                                      value={newQuestionMarks.toString()}
                                      onValueChange={(value) => setNewQuestionMarks(parseInt(value))}
                                    >
                                      <SelectTrigger>
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
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="ai-question-chapter">Chapter</Label>
                                    <Select
                                      value={selectedChapter || ""}
                                      onValueChange={(value) => {
                                        setSelectedChapter(value);
                                        setSelectedTopic(null);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select chapter" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {CHAPTERS.map((chapter) => (
                                          <SelectItem key={chapter} value={chapter}>
                                            {chapter}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="ai-question-topic">Topic</Label>
                                    <Select
                                      value={selectedTopic || ""}
                                      onValueChange={setSelectedTopic}
                                      disabled={!selectedChapter}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder={!selectedChapter ? "Select chapter first" : "Select topic"} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableTopics.map((topic) => (
                                          <SelectItem key={topic} value={topic}>
                                            {topic}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="p-4 border rounded-lg bg-muted">
                                  <p className="text-sm">The AI will generate a question based on your description and selected parameters. The question will be tailored to the subject and class level of this question paper.</p>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                          
                          <SheetFooter>
                            <SheetClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </SheetClose>
                            <Button 
                              onClick={handleAddQuestion}
                              disabled={
                                (questionAddMethod === "manual" && !newQuestionText) ||
                                (questionAddMethod === "bank" && selectedBankQuestions.length === 0) ||
                                (questionAddMethod === "ai" && !aiPrompt) ||
                                isGenerating
                              }
                            >
                              {isGenerating ? "Generating..." : "Add Question"}
                            </Button>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
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
