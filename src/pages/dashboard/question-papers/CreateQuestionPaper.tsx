import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, ArrowRight, FileText, BookOpen, Wand, Check, X, Eye } from "lucide-react";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  DragHandle
} from "@/components/ui/table";
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
  type?: string;
  chapter?: string;
  topic?: string;
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
  "Nested"
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    {left: '', right: ''},
    {left: '', right: ''},
    {left: '', right: ''},
    {left: '', right: ''}
  ]);
  
  // State for child questions in nested questions
  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([]);
  const [currentSubQuestion, setCurrentSubQuestion] = useState<SubQuestion | null>(null);
  const [isEditingSubQuestion, setIsEditingSubQuestion] = useState(false);
  const [subQuestionType, setSubQuestionType] = useState<string>(QUESTION_TYPES[0]);
  const [subQuestionOptions, setSubQuestionOptions] = useState<string[]>(["", "", "", ""]);
  const [subQuestionCorrectOption, setSubQuestionCorrectOption] = useState<number>(0);
  const [subQuestionChapter, setSubQuestionChapter] = useState<string | null>(null);
  const [subQuestionTopic, setSubQuestionTopic] = useState<string | null>(null);
  
  // Filter topics based on selected chapter
  const availableTopics = selectedChapter ? TOPICS[selectedChapter as keyof typeof TOPICS] || [] : [];
  
  // Filter topics for child question based on selected chapter
  const availableSubQuestionTopics = subQuestionChapter ? TOPICS[subQuestionChapter as keyof typeof TOPICS] || [] : [];
  
  // Add state to track drag operation
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

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
    setSubQuestionChapter(null);
    setSubQuestionTopic(null);
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
  
  // Handle adding child question
  const addSubQuestion = () => {
    setCurrentSubQuestion({
      id: `sub-${Date.now()}`,
      question: '',
      marks: 1,
    });
    setIsEditingSubQuestion(true);
    setSubQuestionType(QUESTION_TYPES[0]);
    setSubQuestionOptions(["", "", "", ""]);
    setSubQuestionCorrectOption(0);
    setSubQuestionChapter(null);
    setSubQuestionTopic(null);
  };
  
  // Save current child question
  const saveSubQuestion = () => {
    if (!currentSubQuestion) return;
    
    if (!currentSubQuestion.question.trim()) {
      toast.error("Child question text cannot be empty");
      return;
    }
    
    // Create a copy of the current child question to add type-specific properties
    let finalSubQuestion: any = { 
      ...currentSubQuestion,
      chapter: subQuestionChapter || undefined,
      topic: subQuestionTopic || undefined
    };
    
    // Add type-specific data for child question
    if (subQuestionType === "Multiple Choice") {
      const validOptions = subQuestionOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast.error("Multiple choice questions need at least 2 non-empty options");
        return;
      }
      finalSubQuestion.options = validOptions;
      finalSubQuestion.correctOption = subQuestionCorrectOption;
    }
    
    if (subQuestionType === "True/False") {
      finalSubQuestion.options = ["True", "False"];
      finalSubQuestion.correctOption = subQuestionCorrectOption;
    }
    
    // Save the type with the child question
    finalSubQuestion.type = subQuestionType;
    
    if (isEditingSubQuestion) {
      // Edit existing child question
      setSubQuestions(subQuestions.map(sq => 
        sq.id === finalSubQuestion.id ? finalSubQuestion : sq
      ));
    } else {
      // Add new child question
      setSubQuestions([...subQuestions, finalSubQuestion]);
    }
    
    setCurrentSubQuestion(null);
    setIsEditingSubQuestion(false);
  };
  
  // Edit a child question
  const editSubQuestion = (subQuestionId: string) => {
    const subQuestion = subQuestions.find(sq => sq.id === subQuestionId);
    if (subQuestion) {
      setCurrentSubQuestion(subQuestion);
      setSubQuestionType(subQuestion.type || QUESTION_TYPES[0]);
      setSubQuestionChapter(subQuestion.chapter || null);
      setSubQuestionTopic(subQuestion.topic || null);
      
      // Set options if it's a multiple choice question
      if (subQuestion.type === "Multiple Choice" && subQuestion.options) {
        // Ensure we have at least 4 options, filling with empty strings if needed
        const options = [...subQuestion.options];
        while (options.length < 4) options.push("");
        setSubQuestionOptions(options);
        setSubQuestionCorrectOption(subQuestion.correctOption || 0);
      } else if (subQuestion.type === "True/False") {
        setSubQuestionCorrectOption(subQuestion.correctOption || 0);
      }
      
      setIsEditingSubQuestion(true);
    }
  };
  
  // Delete a child question
  const deleteSubQuestion = (subQuestionId: string) => {
    setSubQuestions(subQuestions.filter(sq => sq.id !== subQuestionId));
  };
  
  // Calculate total marks from child questions
  const calculateSubQuestionMarks = () => {
    return subQuestions.reduce((total, sq) => total + sq.marks, 0);
  };
  
  // Render type-specific form for child questions
  const renderSubQuestionTypeForm = () => {
    switch (subQuestionType) {
      case "Multiple Choice":
        return (
          <div className="space-y-3 mt-3">
            <div className="flex justify-between items-center">
              <h5 className="text-sm font-medium">Multiple Choice Options</h5>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSubQuestionOptions([...subQuestionOptions, ""])}
              >
                Add Option
              </Button>
            </div>
            
            {subQuestionOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <RadioGroup 
                  value={subQuestionCorrectOption.toString()} 
                  onValueChange={(value) => setSubQuestionCorrectOption(parseInt(value))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`sub-option-${index}`} />
                  </div>
                </RadioGroup>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...subQuestionOptions];
                    newOptions[index] = e.target.value;
                    setSubQuestionOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                {subQuestionOptions.length > 2 && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      if (subQuestionOptions.length <= 2) return;
                      const newOptions = subQuestionOptions.filter((_, i) => i !== index);
                      setSubQuestionOptions(newOptions);
                      
                      // Adjust correctOptionIndex if needed
                      if (index === subQuestionCorrectOption) {
                        setSubQuestionCorrectOption(0);
                      } else if (index < subQuestionCorrectOption) {
                        setSubQuestionCorrectOption(subQuestionCorrectOption - 1);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        );
        
      case "True/False":
        return (
          <div className="space-y-3 mt-3">
            <h5 className="text-sm font-medium">Select the correct answer:</h5>
            <RadioGroup 
              value={subQuestionCorrectOption.toString()} 
              onValueChange={(value) => setSubQuestionCorrectOption(parseInt(value))}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="sub-true-option" />
                  <Label htmlFor="sub-true-option">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="sub-false-option" />
                  <Label htmlFor="sub-false-option">False</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        );
        
      default:
        return null;
    }
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
      
      if (selectedQuestionType === "Nested") {
        if (subQuestions.length === 0) {
          toast.error("Nested questions need at least one child question");
          return;
        }
      }
      
      // Create question object based on type
      let questionData: any = {
        id: `q-${Date.now()}`,
        question: newQuestionText,
        marks: selectedQuestionType === "Nested" ? calculateSubQuestionMarks() : newQuestionMarks,
        type: selectedQuestionType,
      };
      
      // Add chapter and topic only if not nested type
      if (selectedQuestionType !== "Nested") {
        questionData.chapter = selectedChapter || undefined;
        questionData.topic = selectedTopic || undefined;
      }
      
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
      
      if (selectedQuestionType === "Nested") {
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
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent, sectionId: string, questionId: string) => {
    setDraggedQuestionId(questionId);
    setDraggedSectionId(sectionId);
    // Add data to the drag event
    e.dataTransfer.setData('application/json', JSON.stringify({
      questionId,
      sectionId
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop to reorder questions
  const handleDrop = (e: React.DragEvent, targetSectionId: string, targetQuestionId: string) => {
    e.preventDefault();

    // Only allow drops within the same section
    if (draggedSectionId !== targetSectionId || !draggedQuestionId || draggedQuestionId === targetQuestionId) {
      return;
    }

    // Find the section and questions
    const sectionIndex = sections.findIndex(section => section.id === targetSectionId);
    if (sectionIndex === -1) return;

    const section = sections[sectionIndex];
    const questions = [...section.questions];
    
    // Find positions
    const draggedIndex = questions.findIndex(q => q.id === draggedQuestionId);
    const targetIndex = questions.findIndex(q => q.id === targetQuestionId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Reorder the questions
    const [draggedQuestion] = questions.splice(draggedIndex, 1);
    questions.splice(targetIndex, 0, draggedQuestion);
    
    // Update the sections with new order
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...section,
      questions
    };
    
    setSections(updatedSections);
    toast.success("Question reordered successfully");
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
                <RadioGroup 
                  value={correctOptionIndex.toString()} 
                  onValueChange={(value) => setCorrectOptionIndex(parseInt(value))}
                >
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
            <RadioGroup 
              value={correctOptionIndex.toString()} 
              onValueChange={(value) => setCorrectOptionIndex(parseInt(value))}
            >
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
        
      case "Nested":
        return (
          <div className="space-y-4 mt-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">
                Child questions (Total: {calculateSubQuestionMarks()} marks)
              </h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addSubQuestion}
                disabled={isEditingSubQuestion}
              >
                Add Child question
              </Button>
            </div>
            
            {!isEditingSubQuestion ? (
              <div className="space-y-2">
                {subQuestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No child questions added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {subQuestions.map((sq, index) => (
                      <div key={sq.id} className="flex items-center justify-between p-2 border rounded-sm">
                        <div className="flex-1 mr-2">
                          <p className="text-sm font-medium">{index + 1}. {sq.question}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">{sq.marks} {sq.marks === 1 ? 'mark' : 'marks'}</p>
                            {sq.type && <span className="text-xs px-2 py-1 bg-muted rounded-full">{sq.type}</span>}
                            {sq.chapter && <span className="text-xs px-2 py-1 bg-muted/50 rounded-full">{sq.chapter.split(':')[0]}</span>}
                            {sq.options && sq.options.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                ({sq.options.length} options)
                              </p>
                            )}
                          </div>
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
                  <Label htmlFor="sub-question-text">Child question Text</Label>
                  <Textarea
                    id="sub-question-text"
                    value={currentSubQuestion?.question || ''}
                    onChange={(e) => setCurrentSubQuestion({
                      ...currentSubQuestion!,
                      question: e.target.value
                    })}
                    placeholder="Enter child question text"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sub-question-type">Question Type</Label>
                    <Select
                      value={subQuestionType}
                      onValueChange={setSubQuestionType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.filter(type => type !== "Nested").map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <SelectTrigger>
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
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sub-question-chapter">Chapter</Label>
                    <Select
                      value={subQuestionChapter || ""}
                      onValueChange={(value) => {
                        setSubQuestionChapter(value);
                        setSubQuestionTopic(null);
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
                    <Label htmlFor="sub-question-topic">Topic</Label>
                    <Select
                      value={subQuestionTopic || ""}
                      onValueChange={setSubQuestionTopic}
                      disabled={!subQuestionChapter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={!subQuestionChapter ? "Select chapter first" : "Select topic"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubQuestionTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Render type-specific form for child questions */}
                {renderSubQuestionTypeForm()}
                
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
      <div className="bg-white p-4 md:p-8 rounded-lg shadow max-h-[80vh] overflow-y-auto">
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
      <div className="space-y-6 relative">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="structure">Paper Structure</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
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
          
          {renderQuestionsTab()}
          
          <TabsContent value="preview">
            {renderPreview()}
          </TabsContent>
        </Tabs>
        
        {/* Floating preview button */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-8 right-8 rounded-full shadow-lg z-10 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Eye className="h-5 w-5" />
              <span className="sr-only">Preview Question Paper</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80%]">
            <DialogHeader>
              <DialogTitle>Question Paper Preview</DialogTitle>
              <DialogDescription>
                Preview how your question paper will look when printed
              </DialogDescription>
            </DialogHeader>
            {renderPreview()}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestionPaper;
