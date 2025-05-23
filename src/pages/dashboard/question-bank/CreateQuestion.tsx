
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuestionForm from "@/components/forms/QuestionForm";
import { constructQuestionPaperDetails } from "@/utils/paperUtils";

interface Question {
  id: number;
  question: string;
  board: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: string;
  marks: string;
  questionType: string;
  answer?: string;
  options?: { text: string; isCorrect: boolean; image?: string }[];
  rubrics?: { criteria: string; weight: number }[];
  parentQuestion?: string;
  parentQuestionImage?: string;
  childQuestions?: {
    question: string;
    questionImage?: string;
    answer?: string;
    marks: number;
    questionType?: string;
    options?: { text: string; isCorrect: boolean; image?: string }[];
  }[];
  questionImage?: string;
}

const CreateQuestion = () => {
  const { id, mode } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState<Question | null>(null);
  
  // Create a state variable for the question paper details
  const [questionPaperDetails, setQuestionPaperDetails] = useState({
    paperTitle: "",
    subject: "",
    class: "",
    duration: 0,
    description: "",
    marks: 0,
    sections: []
  });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Mock API call to fetch question data
      setTimeout(() => {
        // This would be a real API call in production
        const mockQuestion: Question = {
          id: parseInt(id),
          question: "Explain Newton's Third Law of Motion with examples.",
          board: "CBSE",
          class: "10",
          subject: "Physics",
          chapter: "Laws of Motion",
          topic: "Newton's Laws",
          difficulty: "Medium",
          marks: "5",
          questionType: "subjective",
          answer: "Newton's Third Law states that for every action, there is an equal and opposite reaction. This means that when one body exerts a force on another body, the second body exerts a force of equal magnitude but opposite direction on the first body...",
          rubrics: [
            { criteria: "Understanding of the law", weight: 30 },
            { criteria: "Examples provided", weight: 40 },
            { criteria: "Clear explanation", weight: 30 }
          ]
        };

        setQuestionData(mockQuestion);
        setIsLoading(false);
        
        // Update question paper details with the fetched data
        if (mockQuestion) {
          // For demonstration, we'll create a sample structure with this question
          setQuestionPaperDetails(prevDetails => {
            const updatedDetails = {
              ...prevDetails,
              paperTitle: "Physics Test Paper",
              subject: mockQuestion.subject,
              class: mockQuestion.class,
              duration: 60, // Default 60 minutes
              description: "End of term physics examination",
              sections: [
                {
                  sectionTitle: "Section A",
                  instructions: "Answer all questions in this section",
                  marks: Number(mockQuestion.marks),
                  questions: [mockQuestion]
                }
              ]
            };
            
            // Calculate total marks
            updatedDetails.marks = updatedDetails.sections.reduce((total, section) => {
              return total + section.marks;
            }, 0);
            
            return updatedDetails;
          });
        }
      }, 500);
    }
  }, [id]);
  
  // Use effect to log question paper details whenever it changes
  useEffect(() => {
    console.log('questionPaperDetails', questionPaperDetails);
  }, [questionPaperDetails]);

  // Determine if we are creating, editing, or viewing a question
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = !mode && !id;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {isCreate && "Create Question"}
          {isView && "View Question"}
          {isEdit && "Edit Question"}
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-lg">Loading question data...</div>
            </div>
          ) : (
            <QuestionForm 
              type="manual" 
              initialData={questionData || undefined} 
              isEdit={isEdit}
              isView={isView}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestion;
