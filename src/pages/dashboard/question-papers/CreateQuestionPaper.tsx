import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomId } from "@/utils/paperUtils";
import { toast } from "sonner";

// Define question paper structure
interface QuestionPaperDetails {
  paperTitle: string;
  subject: string;
  class: string;
  duration: string;
  description: string;
  marks: number;
  sections: Array<{
    sectionTitle: string;
    instructions: string;
    marks: number;
    questions: Array<any>;
  }>;
}

const CreateQuestionPaper = () => {
  const [paperTitle, setPaperTitle] = useState("");
  const [paperSubject, setPaperSubject] = useState("");
  const [paperClass, setPaperClass] = useState("");
  const [duration, setDuration] = useState("");
  const [paperDescription, setPaperDescription] = useState("");
  const [sections, setSections] = useState([
    {
      id: getRandomId(),
      title: "Section A",
      instructions: "Answer all questions.",
      questions: [],
    },
  ]);

  const handleTitleChange = (e) => {
    setPaperTitle(e.target.value);
  };

  const handleSubjectChange = (value) => {
    setPaperSubject(value);
  };

  const handleClassChange = (value) => {
    setPaperClass(value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setPaperDescription(e.target.value);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: getRandomId(),
        title: `Section ${sections.length + 1}`,
        instructions: "",
        questions: [],
      },
    ]);
  };

  const updateSection = (sectionId, field, value) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, [field]: value };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const deleteSection = (sectionId) => {
    if (sections.length > 1) {
      const updatedSections = sections.filter((section) => section.id !== sectionId);
      setSections(updatedSections);
    } else {
      toast.error("You must have at least one section.");
    }
  };

  const addQuestion = (sectionId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: [
            ...section.questions,
            {
              id: getRandomId(),
              question: "",
              marks: "1",
            },
          ],
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const updateQuestion = (sectionId, questionId, field, value) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.map((question) => {
          if (question.id === questionId) {
            return { ...question, [field]: value };
          }
          return question;
        });
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const deleteQuestion = (sectionId, questionId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.filter((question) => question.id !== questionId);
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination, draggableId } = result;

    // If the question is dropped within the same section, reorder the questions
    if (source.droppableId === destination.droppableId) {
      const sectionId = source.droppableId;
      const section = sections.find((sec) => sec.id === sectionId);
      const questions = Array.from(section.questions);
      const [removed] = questions.splice(source.index, 1);
      questions.splice(destination.index, 0, removed);

      const updatedSections = sections.map((sec) =>
        sec.id === sectionId ? { ...sec, questions: questions } : sec
      );
      setSections(updatedSections);
    } else {
      // If the question is dropped in a different section, move the question
      const sourceSectionId = source.droppableId;
      const destinationSectionId = destination.droppableId;

      const sourceSection = sections.find((sec) => sec.id === sourceSectionId);
      const destinationSection = sections.find((sec) => sec.id === destinationSectionId);

      const sourceQuestions = Array.from(sourceSection.questions);
      const destinationQuestions = Array.from(destinationSection.questions);

      const [removed] = sourceQuestions.splice(source.index, 1);
      destinationQuestions.splice(destination.index, 0, removed);

      const updatedSections = sections.map((sec) => {
        if (sec.id === sourceSectionId) {
          return { ...sec, questions: sourceQuestions };
        } else if (sec.id === destinationSectionId) {
          return { ...sec, questions: destinationQuestions };
        } else {
          return sec;
        }
      });

      setSections(updatedSections);
    }
  };

  // Calculate total marks of all questions in all sections
  const calculateTotalMarks = (sections) => {
    return sections.reduce((totalMarks, section) => {
      return totalMarks + section.questions.reduce((sectionMarks, question) => {
        return sectionMarks + (parseInt(question.marks) || 0);
      }, 0);
    }, 0);
  };

  // Calculate total marks for a specific section
  const calculateSectionMarks = (section) => {
    return section.questions.reduce((sectionMarks, question) => {
      return sectionMarks + (parseInt(question.marks) || 0);
    }, 0);
  };

  // Build the question paper details object and log it on every relevant change
  useEffect(() => {
    const questionPaperDetails: QuestionPaperDetails = {
      paperTitle,
      subject: paperSubject,
      class: paperClass,
      duration,
      description: paperDescription,
      marks: calculateTotalMarks(sections),
      sections: sections.map(section => ({
        sectionTitle: section.title,
        instructions: section.instructions,
        marks: calculateSectionMarks(section),
        questions: section.questions
      }))
    };

    console.log('questionPaperDetails', questionPaperDetails);
  }, [paperTitle, paperSubject, paperClass, duration, paperDescription, sections]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Create Question Paper</h1>

        {/* Paper Details */}
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Paper Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <Input
                type="text"
                placeholder="Enter paper title"
                value={paperTitle}
                onChange={handleTitleChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <Select onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <Select onValueChange={handleClassChange}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Class 9">Class 9</SelectItem>
                  <SelectItem value="Class 10">Class 10</SelectItem>
                  <SelectItem value="Class 11">Class 11</SelectItem>
                  <SelectItem value="Class 12">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <Input
                type="number"
                placeholder="Enter duration"
                value={duration}
                onChange={handleDurationChange}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea
                placeholder="Enter paper description"
                value={paperDescription}
                onChange={handleDescriptionChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <h2 className="text-lg font-semibold mb-2">Sections</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          {sections.map((section, sectionIndex) => (
            <Card key={section.id} className="mb-4">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-semibold">{section.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <GripVertical className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => deleteSection(section.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Section Title</label>
                  <Input
                    type="text"
                    placeholder="Enter section title"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Instructions</label>
                  <Textarea
                    placeholder="Enter instructions for this section"
                    value={section.instructions}
                    onChange={(e) => updateSection(section.id, "instructions", e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Questions */}
                <Droppable droppableId={section.id}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {section.questions.map((question, questionIndex) => (
                        <Draggable key={question.id} draggableId={question.id} index={questionIndex}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 rounded-md p-3 mb-2"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Question {questionIndex + 1}</h4>
                                <Button variant="outline" size="icon" onClick={() => deleteQuestion(section.id, question.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Question</label>
                                <Textarea
                                  placeholder="Enter question"
                                  value={question.question}
                                  onChange={(e) => updateQuestion(section.id, question.id, "question", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Marks</label>
                                <Input
                                  type="number"
                                  placeholder="Enter marks"
                                  value={question.marks}
                                  onChange={(e) => updateQuestion(section.id, question.id, "marks", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Button variant="secondary" size="sm" className="mt-2" onClick={() => addQuestion(section.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
          ))}
        </DragDropContext>

        <Button variant="secondary" onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestionPaper;
