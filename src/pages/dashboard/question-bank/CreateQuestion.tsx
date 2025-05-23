
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuestionForm from "@/components/forms/QuestionForm";

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

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Fetch question data from API
      setTimeout(() => {
        // This would be a real API call in production
        // Removed dummy data and will fetch from API instead
        fetch(`/api/questions/${id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Failed to fetch question data");
            }
            return response.json();
          })
          .then(data => {
            setQuestionData(data);
          })
          .catch(error => {
            console.error("Error fetching question:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 500);
    }
  }, [id]);

  // Determine if we are creating, editing, or viewing a question
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = !mode && !id;

  // Function to log paper details when saving
  const handleSaveQuestion = (formData: any) => {
    const paperDetails = {
      ...formData,
      createdAt: new Date().toISOString(),
      status: formData.isDraft ? 'draft' : 'published'
    };
    
    console.log('paperDetails', paperDetails);
    // Continue with normal form submission
  };

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
              onSave={handleSaveQuestion}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestion;
