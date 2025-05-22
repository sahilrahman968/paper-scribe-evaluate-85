import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DragHandle
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  number: number;
  text: string;
  marks: number;
}

const CreateQuestionPaper = () => {
  const [paperTitle, setPaperTitle] = useState("Untitled Paper");
  const [totalMarks, setTotalMarks] = useState(0);
  const [sections, setSections] = useState<Section[]>([
    {
      id: "section-1",
      title: "Section A",
      questions: [
        { id: "q1", number: 1, text: "Question 1", marks: 10 },
        { id: "q2", number: 2, text: "Question 2", marks: 10 },
      ],
    },
    {
      id: "section-2",
      title: "Section B",
      questions: [
        { id: "q3", number: 1, text: "Question 3", marks: 20 },
      ],
    },
  ]);

  const handleAddSection = () => {
    const newSectionId = `section-${sections.length + 1}`;
    setSections([
      ...sections,
      {
        id: newSectionId,
        title: `Section ${sections.length + 1}`,
        questions: [],
      },
    ]);
  };

  const handleAddQuestion = (sectionId: string) => {
    const sectionIndex = sections.findIndex((section) => section.id === sectionId);
    if (sectionIndex === -1) return;

    const newQuestionId = `q-${new Date().getTime()}`;
    const newQuestion: Question = {
      id: newQuestionId,
      number: sections[sectionIndex].questions.length + 1,
      text: "New Question",
      marks: 5,
    };

    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      questions: [...updatedSections[sectionIndex].questions, newQuestion],
    };

    setSections(updatedSections);
  };

  const handleRemoveQuestion = (sectionId: string, questionId: string) => {
    const sectionIndex = sections.findIndex((section) => section.id === sectionId);
    if (sectionIndex === -1) return;

    const updatedQuestions = sections[sectionIndex].questions.filter(
      (question) => question.id !== questionId
    );

    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      questions: updatedQuestions.map((q, index) => ({ ...q, number: index + 1 })),
    };

    setSections(updatedSections);
  };

  // Add a function to handle question reordering
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, sectionId: string, questionId: string) => {
    e.dataTransfer.setData("questionId", questionId);
    e.dataTransfer.setData("sectionId", sectionId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetSectionId: string, targetIndex: number) => {
    e.preventDefault();
    const draggedQuestionId = e.dataTransfer.getData("questionId");
    const sourceSectionId = e.dataTransfer.getData("sectionId");
    
    // Only allow reordering within the same section
    if (sourceSectionId !== targetSectionId) return;
    
    // Find the section
    const sectionIndex = sections.findIndex(section => section.id === targetSectionId);
    if (sectionIndex === -1) return;
    
    // Get the questions in this section
    const sectionQuestions = [...sections[sectionIndex].questions];
    
    // Find the question to move
    const questionIndex = sectionQuestions.findIndex(q => q.id === draggedQuestionId);
    if (questionIndex === -1) return;
    
    // Remove the question from its current position
    const [movedQuestion] = sectionQuestions.splice(questionIndex, 1);
    
    // Insert it at the new position
    sectionQuestions.splice(targetIndex, 0, movedQuestion);
    
    // Update question numbers
    const updatedQuestions = sectionQuestions.map((q, idx) => ({
      ...q,
      number: idx + 1
    }));
    
    // Update the sections state
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      questions: updatedQuestions
    };
    
    setSections(updatedSections);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Create Question Paper</h2>
        <p className="text-muted-foreground">
          Design your question paper with sections and questions.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paper Details</h3>
            <div className="grid gap-2">
              <label htmlFor="paper-title">Paper Title</label>
              <Input
                type="text"
                id="paper-title"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="total-marks">Total Marks</label>
              <Input
                type="number"
                id="total-marks"
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseInt(e.target.value))}
              />
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="paper-details" className="w-full">
        <TabsList>
          <TabsTrigger value="paper-details">Paper Details</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paper-details">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Paper Details</h3>
              <div className="grid gap-2">
                <label htmlFor="paper-title">Paper Title</label>
                <Input
                  type="text"
                  id="paper-title"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="total-marks">Total Marks</label>
                <Input
                  type="number"
                  id="total-marks"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="sections">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sections</h3>
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="border rounded-md p-4">
                  <h4 className="font-semibold">{section.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {section.questions.length} Questions
                  </p>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddSection}>
                Add Section
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions">
          <Card className="p-6">
            {sections.map((section) => (
              <div key={section.id} className="mb-8">
                <h3 className="text-lg font-semibold mb-2">
                  {section.title}
                  <Badge className="ml-2">{section.questions.length} Questions</Badge>
                </h3>
                
                {section.questions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead style={{ width: "40px" }}></TableHead>
                        <TableHead style={{ width: "60px" }}>No.</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead style={{ width: "80px" }}>Marks</TableHead>
                        <TableHead style={{ width: "80px" }}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.questions.map((question, index) => (
                        <TableRow 
                          key={question.id}
                          isDraggable={true}
                          dragData={question.id}
                          onDragStart={(e) => handleDragStart(e, section.id, question.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, section.id, index)}
                        >
                          <TableCell>
                            <DragHandle />
                          </TableCell>
                          <TableCell>{question.number}</TableCell>
                          <TableCell>
                            <div className="font-medium">{question.text}</div>
                          </TableCell>
                          <TableCell>{question.marks}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveQuestion(section.id, question.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-md">
                    No questions added to this section.
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleAddQuestion(section.id)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            ))}
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div>
              <h2>{paperTitle}</h2>
              {sections.map((section) => (
                <div key={section.id} className="mb-4">
                  <h3>{section.title}</h3>
                  <ol className="list-decimal pl-6">
                    {section.questions.map((question) => (
                      <li key={question.id}>
                        {question.text} ({question.marks} marks)
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateQuestionPaper;
