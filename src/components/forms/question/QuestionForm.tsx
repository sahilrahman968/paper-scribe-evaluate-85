
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { FormProvider } from "./FormContext";
import { MetadataFields } from "./MetadataFields";
import { StandardQuestionInput } from "./StandardQuestionInput";
import { OptionsInput } from "./OptionsInput";
import { TrueFalseInput } from "./TrueFalseInput";
import { AnswerField } from "./AnswerField";
import { RubricsInput } from "./RubricsInput";
import { NestedQuestions } from "./NestedQuestions";
import { validateFormData } from "./validation";
import { QuestionFormProps, OptionItem } from "./types";

const QuestionForm = ({ type, initialData, isEdit = false, isView = false }: QuestionFormProps) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // These state variables will be passed to the FormProvider
  const [formData, setFormData] = useState({
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
  
  const [rubrics, setRubrics] = useState(
    initialData?.rubrics || [
      { criteria: "Accuracy of content", weight: 40 },
      { criteria: "Presentation and clarity", weight: 30 },
      { criteria: "Use of examples", weight: 30 }
    ]
  );
  
  const [childQuestions, setChildQuestions] = useState(
    initialData?.childQuestions || []
  );
  
  useEffect(() => {
    if (formData.questionType === "true-false") {
      setOptions([
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ]);
    } else if (formData.questionType === "single-correct" || formData.questionType === "multiple-correct") {
      if (options.length < 2) {
        setOptions([
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false }
        ]);
      }
    }
  }, [formData.questionType]);
  
  const generateQuestion = async () => {
    if (!formData.board || !formData.class || !formData.subject || !formData.questionType || !formData.difficulty || !formData.marks) {
      toast.error("Please fill syllabus details, question type, difficulty and marks first");
      return;
    }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      let generatedQuestion = "";
      let generatedAnswer = "";
      let generatedOptions: OptionItem[] = [];
      let generatedRubrics = [];
      let generatedParentQuestion = "";
      let generatedChildQuestions = [];
      
      if (formData.questionType === "nested") {
        generatedParentQuestion = formData.subject === "Physics" 
          ? "Answer the following questions about Newton's Laws of Motion:" 
          : `Answer the following questions about ${formData.topics.length ? formData.topics[0] : "this topic"}:`;
          
        if (formData.subject === "Physics") {
          generatedChildQuestions = [
            {
              question: "State Newton's First Law of Motion and give an example from daily life.",
              marks: 3,
              answer: "Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an external force."
            },
            {
              question: "Explain the concept of momentum and its conservation.",
              marks: 3,
              answer: "Momentum is the product of mass and velocity. The conservation of momentum states that in a closed system, the total momentum remains constant."
            },
            {
              question: "A 2kg object moving at 5 m/s collides with a stationary 3kg object. If they stick together after collision, what will be their final velocity?",
              marks: 4,
              answer: "Using conservation of momentum: m1v1 + m2v2 = (m1 + m2)v_final\n2kg × 5m/s + 3kg × 0m/s = (2kg + 3kg) × v_final\n10kg·m/s = 5kg × v_final\nv_final = 2 m/s"
            }
          ];
        } else if (formData.subject === "Mathematics") {
          generatedChildQuestions = [
            {
              question: "Solve the quadratic equation: x² - 5x + 6 = 0",
              marks: 2,
              answer: "Factoring: x² - 5x + 6 = 0\n(x - 3)(x - 2) = 0\nx = 3 or x = 2"
            },
            {
              question: "Calculate the derivative of f(x) = x³ - 4x² + 5x - 7",
              marks: 3,
              answer: "f'(x) = 3x² - 8x + 5"
            },
            {
              question: "Find the area of a circle with radius 7 cm.",
              marks: 2,
              answer: "A = πr² = π × 7² = 49π cm²"
            }
          ];
        } else {
          generatedChildQuestions = [
            {
              question: `Explain the key concepts related to ${formData.topics.length ? formData.topics[0] : "this topic"}.`,
              marks: 3,
              answer: "The key concepts include..."
            },
            {
              question: `Describe the importance of ${formData.topics.length ? formData.topics[0] : "this topic"} in modern applications.`,
              marks: 3,
              answer: "The importance can be seen in various applications..."
            },
            {
              question: `Analyze the challenges faced in implementing ${formData.topics.length ? formData.topics[0] : "this topic"}.`,
              marks: 4,
              answer: "The challenges include..."
            }
          ];
        }
        
        setFormData({
          ...formData,
          parentQuestion: generatedParentQuestion
        });
        setChildQuestions(generatedChildQuestions);
      } else if (formData.questionType === "subjective") {
        if (formData.subject === "Physics") {
          generatedQuestion = "<p>Elaborate on the working principle of a nuclear reactor and discuss the safety mechanisms employed to prevent nuclear accidents.</p>";
          generatedAnswer = "<p>A nuclear reactor operates on the principle of controlled nuclear fission...</p>";
          generatedRubrics = [
            { criteria: "Understanding of nuclear fission", weight: 25 },
            { criteria: "Description of reactor components", weight: 25 },
            { criteria: "Explanation of safety mechanisms", weight: 30 },
            { criteria: "Discussion of potential risks", weight: 20 }
          ];
        } else if (formData.subject === "Mathematics") {
          generatedQuestion = "<p>Prove that the sum of interior angles in a polygon with n sides is (n-2) × 180°.</p>";
          generatedAnswer = "<p>To prove this theorem, we can use the triangulation of polygons...</p>";
          generatedRubrics = [
            { criteria: "Correct approach to proof", weight: 40 },
            { criteria: "Mathematical reasoning", weight: 30 },
            { criteria: "Clarity of explanation", weight: 30 }
          ];
        } else {
          generatedQuestion = `<p>Explain the significance of ${formData.topics.length ? formData.topics[0] : "this topic"} in the context of ${formData.subject}.</p>`;
          generatedAnswer = "<p>The significance of this topic can be understood through...</p>";
          generatedRubrics = [
            { criteria: "Content accuracy", weight: 40 },
            { criteria: "Critical analysis", weight: 30 },
            { criteria: "Examples and application", weight: 30 }
          ];
        }
        
        setFormData({
          ...formData,
          question: generatedQuestion,
          answer: generatedAnswer
        });
        
        setRubrics(generatedRubrics);
      } else if (formData.questionType === "single-correct" || formData.questionType === "multiple-correct") {
        if (formData.subject === "Physics") {
          if (formData.questionType === "single-correct") {
            generatedQuestion = "<p>Which of the following is a unit of force?</p>";
            generatedOptions = [
              { text: "Newton", isCorrect: true },
              { text: "Joule", isCorrect: false },
              { text: "Watt", isCorrect: false },
              { text: "Coulomb", isCorrect: false }
            ];
          } else {
            generatedQuestion = "<p>Which of the following are vector quantities?</p>";
            generatedOptions = [
              { text: "Force", isCorrect: true },
              { text: "Velocity", isCorrect: true },
              { text: "Mass", isCorrect: false },
              { text: "Temperature", isCorrect: false }
            ];
          }
        } else if (formData.subject === "Mathematics") {
          if (formData.questionType === "single-correct") {
            generatedQuestion = "<p>What is the derivative of sin(x) with respect to x?</p>";
            generatedOptions = [
              { text: "cos(x)", isCorrect: true },
              { text: "-sin(x)", isCorrect: false },
              { text: "tan(x)", isCorrect: false },
              { text: "-cos(x)", isCorrect: false }
            ];
          } else {
            generatedQuestion = "<p>Which of the following are prime numbers?</p>";
            generatedOptions = [
              { text: "2", isCorrect: true },
              { text: "3", isCorrect: true },
              { text: "4", isCorrect: false },
              { text: "5", isCorrect: true }
            ];
          }
        }
        
        setFormData({
          ...formData,
          question: generatedQuestion
        });
        
        setOptions(generatedOptions);
      } else if (formData.questionType === "true-false") {
        generatedQuestion = formData.subject === "Physics" ? 
          "<p>Light travels faster than sound. State whether true or false.</p>" : 
          "<p>Every prime number greater than 2 is odd. State whether true or false.</p>";
        
        setFormData({
          ...formData,
          question: generatedQuestion
        });
        
        setOptions([
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ]);
      } else if (formData.questionType === "fill-in-the-blank") {
        generatedQuestion = formData.subject === "Physics" ? 
          "<p>The SI unit of electric current is __________.</p>" :
          "<p>The value of π (pi) up to 2 decimal places is __________.</p>";
        generatedAnswer = formData.subject === "Physics" ? "ampere" : "3.14";
        
        setFormData({
          ...formData,
          question: generatedQuestion,
          answer: generatedAnswer
        });
      }
      
      setIsGenerating(false);
      toast.success("Question generated successfully!");
    }, 1500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData(formData, options, rubrics, childQuestions)) {
      return;
    }
    
    setIsSubmitting(true);
    
    const questionData = {
      ...formData,
      options: formData.questionType === "single-correct" || formData.questionType === "multiple-correct" || formData.questionType === "true-false" ? options : undefined,
      rubrics: formData.questionType === "subjective" ? rubrics : undefined,
      childQuestions: formData.questionType === "nested" ? childQuestions : undefined
    };
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isEdit ? "Question updated successfully!" : "Question created successfully!");
      navigate("/dashboard/question-bank");
    }, 1000);
  };
  
  return (
    <FormProvider
      initialData={initialData}
      isEdit={isEdit}
      isView={isView}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <MetadataFields />
        
        {formData.questionType !== "nested" ? (
          <StandardQuestionInput />
        ) : (
          <NestedQuestions />
        )}
        
        <OptionsInput />
        
        <TrueFalseInput />
        
        <AnswerField />
        
        <RubricsInput />
        
        {!isView && (
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
        )}
        
        {isView && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => navigate("/dashboard/question-bank")}
            >
              Back to Question Bank
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default QuestionForm;
