
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

/**
 * Constructs a detailed question paper object with the specified structure
 * 
 * @param paperTitle The title of the question paper
 * @param subject The subject of the question paper
 * @param className The class for which the paper is intended
 * @param duration The duration of the exam in minutes
 * @param description Description of the paper
 * @param sections Array of sections with their questions
 * @returns The constructed question paper details object
 */
export const constructQuestionPaperDetails = (
  paperTitle: string,
  subject: string,
  className: string,
  duration: number,
  description: string,
  sections: any[]
) => {
  // Calculate total marks of the paper
  const marks = sections.reduce((total, section) => {
    const sectionMarks = section.questions.reduce((sectionTotal: number, question: any) => {
      return sectionTotal + (Number(question.marks) || 0);
    }, 0);
    return total + sectionMarks;
  }, 0);

  // Construct sections with marks calculation
  const formattedSections = sections.map(section => {
    const sectionMarks = section.questions.reduce((total: number, question: any) => {
      return total + (Number(question.marks) || 0);
    }, 0);

    return {
      sectionTitle: section.title,
      instructions: section.instructions,
      marks: sectionMarks,
      questions: section.questions
    };
  });

  return {
    paperTitle,
    subject,
    class: className,
    duration,
    description,
    marks,
    sections: formattedSections
  };
};
