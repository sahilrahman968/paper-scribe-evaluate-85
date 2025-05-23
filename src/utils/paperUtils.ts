
/**
 * Constructs a complete question paper object from the provided details
 * 
 * @param paperDetails The question paper details including title, description, and questions
 * @returns The complete question paper object
 */
export const constructPaperDetails = (
  title: string,
  description: string,
  questions: any[], // Using any[] as we don't know the exact question structure
  duration?: number,
  totalMarks?: number,
  isDraft?: boolean
) => {
  const paperDetails = {
    title,
    description,
    questions,
    metadata: {
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      duration: duration || 0,
      totalMarks: totalMarks || calculateTotalMarks(questions),
      isDraft: isDraft || false,
      questionCount: questions.length,
    }
  };

  // Log the paper details to the console as requested
  console.log('paperDetails', paperDetails);
  
  return paperDetails;
};

/**
 * Calculates the total marks for all questions in the paper
 * 
 * @param questions Array of questions in the paper
 * @returns The total marks
 */
const calculateTotalMarks = (questions: any[]): number => {
  return questions.reduce((total, question) => {
    return total + (question.marks || 0);
  }, 0);
};
