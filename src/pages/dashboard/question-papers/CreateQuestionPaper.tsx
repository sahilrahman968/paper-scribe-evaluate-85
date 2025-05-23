import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { constructQuestionPaperDetails } from "@/utils/paperUtils";

// Define the question interface (similar to the one in CreateQuestion)
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

// Define section interface
interface Section {
  title: string;
  instructions: string;
  questions: Question[];
}

const CreateQuestionPaper = () => {
  // Create a state variable for the question paper details
  const [questionPaperDetails, setQuestionPaperDetails] = useState({
    paperTitle: "",
    subject: "",
    class: "",
    duration: 0,
    description: "",
    marks: 0,
    sections: [] as any[]
  });

  // Example effect to initialize with sample data (for demonstration)
  useEffect(() => {
    // This would typically come from a form or API
    const sampleQuestion: Question = {
      id: 1,
      question: "Explain Newton's Third Law of Motion with examples.",
      board: "CBSE",
      class: "10",
      subject: "Physics",
      chapter: "Laws of Motion",
      topic: "Newton's Laws",
      difficulty: "Medium",
      marks: "5",
      questionType: "subjective",
      answer: "Newton's Third Law states that for every action, there is an equal and opposite reaction..."
    };
    
    // Create sample sections
    const sampleSections: Section[] = [
      {
        title: "Section A",
        instructions: "Answer all questions in this section",
        questions: [sampleQuestion]
      }
    ];
    
    // Use the utility function to construct question paper details
    const paperDetails = constructQuestionPaperDetails(
      "Physics Test Paper",
      "Physics",
      "10",
      60, // Duration in minutes
      "End of term physics examination",
      sampleSections
    );
    
    setQuestionPaperDetails(paperDetails);
  }, []);
  
  // Use effect to log question paper details whenever it changes
  useEffect(() => {
    console.log('questionPaperDetails', questionPaperDetails);
  }, [questionPaperDetails]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create Question Paper</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Paper Details</h2>
            <div>
              <p>Title: {questionPaperDetails.paperTitle}</p>
              <p>Subject: {questionPaperDetails.subject}</p>
              <p>Class: {questionPaperDetails.class}</p>
              <p>Duration: {questionPaperDetails.duration} minutes</p>
              <p>Total Marks: {questionPaperDetails.marks}</p>
            </div>
            
            <h2 className="text-xl font-semibold mt-4">Sections</h2>
            {questionPaperDetails.sections.map((section, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium">{section.sectionTitle}</h3>
                <p>Instructions: {section.instructions}</p>
                <p>Section Marks: {section.marks}</p>
                <p>Questions: {section.questions.length}</p>
              </div>
            ))}
            
            {/* Form elements for creating/editing question paper would go here */}
            <div className="mt-6">
              <p className="text-gray-500">This is a placeholder for the question paper creation form. In a complete implementation, you would have form controls to add/edit paper details and sections.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestionPaper;
