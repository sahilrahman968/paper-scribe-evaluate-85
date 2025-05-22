
import { FormData, OptionItem, RubricItem, ChildQuestionItem } from "./types";
import { toast } from "@/components/ui/sonner";

export const validateFormData = (
  formData: FormData, 
  options: OptionItem[], 
  rubrics: RubricItem[], 
  childQuestions: ChildQuestionItem[]
): boolean => {
  if (!formData.board || !formData.class || !formData.subject || !formData.difficulty || !formData.marks) {
    toast.error("Please fill all required fields");
    return false;
  }
  
  if (!formData.question && !formData.parentQuestion && formData.questionType !== "nested") {
    toast.error("Question text is required");
    return false;
  }
  
  if (formData.questionType === "nested") {
    if (!formData.parentQuestion) {
      toast.error("Parent question text is required for nested questions");
      return false;
    }
    
    if (childQuestions.length === 0) {
      toast.error("At least one child question is required for nested questions");
      return false;
    }
    
    for (let i = 0; i < childQuestions.length; i++) {
      const childQuestion = childQuestions[i];
      
      if (!childQuestion.question) {
        toast.error(`Child question ${i + 1} text is required`);
        return false;
      }
      
      if (childQuestion.marks <= 0) {
        toast.error(`Child question ${i + 1} marks must be greater than 0`);
        return false;
      }
    }
  }
  
  if (formData.questionType === "single-correct" || formData.questionType === "multiple-correct") {
    if (options.length < 2) {
      toast.error("At least two options are required");
      return false;
    }
    
    const emptyOptions = options.some(option => !option.text.trim());
    if (emptyOptions) {
      toast.error("All options must have text");
      return false;
    }
    
    if (formData.questionType === "single-correct") {
      const correctCount = options.filter(option => option.isCorrect).length;
      if (correctCount !== 1) {
        toast.error("Single correct question must have exactly one correct answer");
        return false;
      }
    }
    
    if (formData.questionType === "multiple-correct") {
      const correctCount = options.filter(option => option.isCorrect).length;
      if (correctCount < 1) {
        toast.error("Multiple correct question must have at least one correct answer");
        return false;
      }
    }
  }
  
  if (formData.questionType === "subjective") {
    if (rubrics.length === 0) {
      toast.error("At least one evaluation rubric is required for subjective questions");
      return false;
    }
    
    const invalidRubrics = rubrics.some(rubric => 
      !rubric.criteria.trim() || typeof rubric.weight !== 'number' || rubric.weight <= 0
    );
    if (invalidRubrics) {
      toast.error("All rubrics must have criteria and a valid weight");
      return false;
    }
    
    const totalWeight = rubrics.reduce((sum, rubric) => sum + rubric.weight, 0);
    if (totalWeight !== 100) {
      toast.error("Rubric weights must sum up to 100%");
      return false;
    }
  }
  
  return true;
};
