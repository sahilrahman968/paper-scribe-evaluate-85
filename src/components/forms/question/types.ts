
export interface Question {
  id?: number;
  question: string;
  board: string;
  class: string;
  subject: string;
  chapter: string;
  topic?: string;
  topics: string[];
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
    options?: { text: string; isCorrect: boolean; image?: string }[];
  }[];
  questionImage?: string;
}

export interface QuestionFormProps {
  type: "manual" | "ai";
  initialData?: Question;
  isEdit?: boolean;
  isView?: boolean;
}

export type RubricItem = {
  criteria: string;
  weight: number;
};

export type OptionItem = {
  text: string;
  isCorrect: boolean;
  image?: string;
};

export type ChildQuestionItem = {
  question: string;
  questionImage?: string;
  answer?: string;
  marks: number;
  options?: OptionItem[];
};

export interface FormData {
  id?: number;
  question: string;
  answer: string;
  board: string;
  class: string;
  subject: string;
  chapter: string;
  topics: string[];
  marks: string;
  difficulty: string;
  questionType: string;
  parentQuestion: string;
  parentQuestionImage: string;
  questionImage: string;
}

export interface FormContextType {
  formData: FormData;
  options: OptionItem[];
  rubrics: RubricItem[];
  childQuestions: ChildQuestionItem[];
  isView: boolean;
  isEdit: boolean;
  isGenerating: boolean;
  isSubmitting: boolean;
  handleInputChange: (field: string, value: string | string[]) => void;
  handleImageUpload: (field: string) => void;
  handleOptionChange: (index: number, field: "text" | "isCorrect", value: string | boolean) => void;
  handleOptionImageUpload: (index: number) => void;
  handleRubricChange: (index: number, field: "criteria" | "weight", value: string | number) => void;
  handleChildQuestionChange: (index: number, field: string, value: any) => void;
  handleChildQuestionImageUpload: (index: number) => void;
  handleChildOptionChange: (questionIndex: number, optionIndex: number, field: "text" | "isCorrect", value: string | boolean) => void;
  handleChildOptionImageUpload: (questionIndex: number, optionIndex: number) => void;
  addRubric: () => void;
  removeRubric: (index: number) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
  addChildQuestion: () => void;
  removeChildQuestion: (index: number) => void;
  addChildOption: (questionIndex: number) => void;
  removeChildOption: (questionIndex: number, optionIndex: number) => void;
}

// Mock data structures
export const boards = ["CBSE", "ICSE", "State Board"];
export const classes = ["8", "9", "10", "11", "12"];
export const subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "English", "History"];
export const difficulties = ["Easy", "Medium", "Hard"];
export const questionTypes = ["subjective", "single-correct", "multiple-correct", "true-false", "fill-in-the-blank", "nested"];

// Mock chapters based on subject
export const chaptersBySubject: Record<string, string[]> = {
  "Physics": ["Mechanics", "Electromagnetism", "Thermodynamics", "Optics", "Modern Physics", "Laws of Motion"],
  "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Electrochemistry"],
  "Biology": ["Cell Biology", "Genetics", "Human Physiology", "Ecology", "Evolution"],
  "Mathematics": ["Algebra", "Geometry", "Calculus", "Trigonometry", "Statistics", "Probability"],
  "English": ["Grammar", "Literature", "Writing", "Comprehension"],
  "History": ["Ancient History", "Medieval History", "Modern History", "World Wars"]
};

// Mock topics based on chapter
export const topicsByChapter: Record<string, { value: string; label: string }[]> = {
  "Mechanics": [
    { value: "Newton's Laws", label: "Newton's Laws" },
    { value: "Kinematics", label: "Kinematics" },
    { value: "Dynamics", label: "Dynamics" }
  ],
  "Electromagnetism": [
    { value: "Electric Fields", label: "Electric Fields" },
    { value: "Magnetic Fields", label: "Magnetic Fields" },
    { value: "Electromagnetic Induction", label: "Electromagnetic Induction" }
  ],
  "Thermodynamics": [
    { value: "Laws of Thermodynamics", label: "Laws of Thermodynamics" },
    { value: "Heat Transfer", label: "Heat Transfer" },
    { value: "Entropy", label: "Entropy" }
  ],
  "Laws of Motion": [
    { value: "Newton's First Law", label: "Newton's First Law" },
    { value: "Newton's Second Law", label: "Newton's Second Law" },
    { value: "Newton's Third Law", label: "Newton's Third Law" },
    { value: "Friction", label: "Friction" }
  ],
  "Organic Chemistry": [
    { value: "Hydrocarbons", label: "Hydrocarbons" },
    { value: "Functional Groups", label: "Functional Groups" },
    { value: "Isomerism", label: "Isomerism" }
  ],
  "Algebra": [
    { value: "Equations", label: "Equations" },
    { value: "Polynomials", label: "Polynomials" },
    { value: "Complex Numbers", label: "Complex Numbers" }
  ]
};
