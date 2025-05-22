
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { 
  FormData, 
  FormContextType, 
  OptionItem,
  RubricItem,
  ChildQuestionItem,
  Question
} from "./types";

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
  initialData?: Question;
  isEdit?: boolean;
  isView?: boolean;
}

export const FormProvider = ({ children, initialData, isEdit = false, isView = false }: FormProviderProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    id: initialData?.id,
    question: initialData?.question || "",
    answer: initialData?.answer || "",
    board: initialData?.board || "",
    class: initialData?.class || "",
    subject: initialData?.subject || "",
    chapter: initialData?.chapter || "",
    topics: initialData?.topics || [],
    marks: initialData?.marks || "",
    difficulty: initialData?.difficulty || "",
    questionType: initialData?.questionType || "subjective",
    parentQuestion: initialData?.parentQuestion || "",
    parentQuestionImage: initialData?.parentQuestionImage || "",
    questionImage: initialData?.questionImage || ""
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
  
  const [childQuestions, setChildQuestions] = useState<ChildQuestionItem[]>(
    initialData?.childQuestions || []
  );
  
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleImageUpload = (field: string) => {
    const mockImageUrl = `https://source.unsplash.com/random/800x600?${Math.random()}`;
    
    setFormData({
      ...formData,
      [field]: mockImageUrl
    });
    toast.success("Image uploaded successfully!");
  };
  
  const handleOptionImageUpload = (index: number) => {
    const mockImageUrl = `https://source.unsplash.com/random/400x300?${Math.random()}`;
    
    const newOptions = [...options];
    newOptions[index] = { 
      ...newOptions[index], 
      image: mockImageUrl 
    };
    setOptions(newOptions);
    toast.success("Option image uploaded successfully!");
  };
  
  const handleChildQuestionImageUpload = (index: number) => {
    const mockImageUrl = `https://source.unsplash.com/random/800x600?${Math.random()}`;
    
    const newChildQuestions = [...childQuestions];
    newChildQuestions[index] = { 
      ...newChildQuestions[index], 
      questionImage: mockImageUrl 
    };
    setChildQuestions(newChildQuestions);
    toast.success("Child question image uploaded successfully!");
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
  
  const handleChildQuestionChange = (index: number, field: string, value: any) => {
    const newChildQuestions = [...childQuestions];
    newChildQuestions[index] = { 
      ...newChildQuestions[index], 
      [field]: value 
    };
    setChildQuestions(newChildQuestions);
  };
  
  const handleChildOptionChange = (questionIndex: number, optionIndex: number, field: "text" | "isCorrect", value: string | boolean) => {
    const newChildQuestions = [...childQuestions];
    if (!newChildQuestions[questionIndex].options) {
      newChildQuestions[questionIndex].options = [];
    }
    
    if (!newChildQuestions[questionIndex].options![optionIndex]) {
      newChildQuestions[questionIndex].options![optionIndex] = { text: "", isCorrect: false };
    }
    
    newChildQuestions[questionIndex].options![optionIndex] = {
      ...newChildQuestions[questionIndex].options![optionIndex],
      [field]: value
    };
    
    setChildQuestions(newChildQuestions);
  };
  
  const handleChildOptionImageUpload = (questionIndex: number, optionIndex: number) => {
    const mockImageUrl = `https://source.unsplash.com/random/400x300?${Math.random()}`;
    
    const newChildQuestions = [...childQuestions];
    if (!newChildQuestions[questionIndex].options) {
      newChildQuestions[questionIndex].options = [];
    }
    
    if (!newChildQuestions[questionIndex].options![optionIndex]) {
      newChildQuestions[questionIndex].options![optionIndex] = { text: "", isCorrect: false };
    }
    
    newChildQuestions[questionIndex].options![optionIndex] = {
      ...newChildQuestions[questionIndex].options![optionIndex],
      image: mockImageUrl
    };
    
    setChildQuestions(newChildQuestions);
    toast.success("Option image uploaded successfully!");
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
  
  const addChildQuestion = () => {
    setChildQuestions([
      ...childQuestions, 
      { 
        question: "", 
        answer: "", 
        marks: 1,
        options: formData.questionType === "nested" ? [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false }
        ] : undefined
      }
    ]);
  };
  
  const removeChildQuestion = (index: number) => {
    const newChildQuestions = [...childQuestions];
    newChildQuestions.splice(index, 1);
    setChildQuestions(newChildQuestions);
  };
  
  const addChildOption = (questionIndex: number) => {
    const newChildQuestions = [...childQuestions];
    if (!newChildQuestions[questionIndex].options) {
      newChildQuestions[questionIndex].options = [];
    }
    
    newChildQuestions[questionIndex].options!.push({ text: "", isCorrect: false });
    setChildQuestions(newChildQuestions);
  };
  
  const removeChildOption = (questionIndex: number, optionIndex: number) => {
    const newChildQuestions = [...childQuestions];
    if (newChildQuestions[questionIndex].options && newChildQuestions[questionIndex].options!.length > 2) {
      newChildQuestions[questionIndex].options!.splice(optionIndex, 1);
      setChildQuestions(newChildQuestions);
    }
  };

  const contextValue: FormContextType = {
    formData,
    options,
    rubrics,
    childQuestions,
    isView,
    isEdit,
    isGenerating,
    isSubmitting,
    handleInputChange,
    handleImageUpload,
    handleOptionChange,
    handleOptionImageUpload,
    handleRubricChange,
    handleChildQuestionChange,
    handleChildQuestionImageUpload,
    handleChildOptionChange,
    handleChildOptionImageUpload,
    addRubric,
    removeRubric,
    addOption,
    removeOption,
    addChildQuestion,
    removeChildQuestion,
    addChildOption,
    removeChildOption
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};
