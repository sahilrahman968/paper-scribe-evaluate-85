import React, { useState, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, MoveVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'nested';
  options?: Option[];
  answer?: boolean;
  sectionId: string;
  childQuestions?: Question[];
}

interface Section {
  id: string;
  name: string;
}

interface QuestionPaper {
  id?: string;
  name: string;
  sections: Section[];
  questions: Question[];
}

interface SortableQuestionItemProps {
  id: string;
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

const SortableQuestionItem = ({ id, question, onEdit, onDelete }: SortableQuestionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="border rounded-md p-4 mb-2 bg-white relative"
    >
      <div className="flex items-start gap-2">
        <div 
          className="cursor-grab p-1 text-gray-500 hover:text-gray-700 touch-none"
          {...attributes}
          {...listeners}
        >
          <MoveVertical size={16} />
        </div>
        <div className="flex-1">
          <div className="font-medium">{question.text}</div>
          {question.type === 'multiple_choice' && (
            <div className="mt-2 ml-4 space-y-1">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 border rounded-full flex items-center justify-center">
                    {option.isCorrect && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                  </div>
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          )}
          {question.type === 'true_false' && (
            <div className="mt-2 ml-4">
              <span className="font-medium">Answer: </span> 
              <span>{question.answer ? 'True' : 'False'}</span>
            </div>
          )}
          {question.type === 'nested' && (
            <div className="mt-2 ml-4 space-y-2">
              <span className="font-medium">Child Questions:</span>
              {question.childQuestions?.map((childQuestion, index) => (
                <div key={index} className="border-l-2 pl-3 py-1">
                  <div className="font-medium">{childQuestion.text}</div>
                  {childQuestion.type === 'multiple_choice' && (
                    <div className="mt-1 ml-4 space-y-1">
                      {childQuestion.options?.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <div className="w-3 h-3 border rounded-full flex items-center justify-center">
                            {option.isCorrect && <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
                          </div>
                          <span className="text-sm">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {childQuestion.type === 'true_false' && (
                    <div className="mt-1 ml-4 text-sm">
                      <span className="font-medium">Answer: </span> 
                      <span>{childQuestion.answer ? 'True' : 'False'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(question)}>
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(question.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreateQuestionPaper = () => {
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper>({
    name: '',
    sections: [],
    questions: [],
  });
  const [newSectionName, setNewSectionName] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestionPaper({ ...questionPaper, name: e.target.value });
  };

  const handleAddSection = () => {
    if (newSectionName.trim() !== '') {
      const newSection: Section = { id: crypto.randomUUID(), name: newSectionName };
      setQuestionPaper({
        ...questionPaper,
        sections: [...questionPaper.sections, newSection],
      });
      setNewSectionName('');
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setQuestionPaper({
      ...questionPaper,
      sections: questionPaper.sections.filter((section) => section.id !== sectionId),
      questions: questionPaper.questions.filter((question) => question.sectionId !== sectionId),
    });
  };

  const handleCreateQuestion = (sectionId: string) => {
    setSelectedQuestion({
      id: crypto.randomUUID(),
      text: '',
      type: 'multiple_choice',
      options: [{ id: crypto.randomUUID(), text: '', isCorrect: false }],
      sectionId: sectionId,
    });
    setIsQuestionDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsQuestionDialogOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionPaper({
      ...questionPaper,
      questions: questionPaper.questions.filter((question) => question.id !== questionId),
    });
    toast({
      title: 'Question deleted',
      description: 'The question has been successfully deleted.',
    });
  };

  const handleSaveQuestion = (question: Question) => {
    const existingQuestionIndex = questionPaper.questions.findIndex((q) => q.id === question.id);
    if (existingQuestionIndex > -1) {
      const updatedQuestions = [...questionPaper.questions];
      updatedQuestions[existingQuestionIndex] = question;
      setQuestionPaper({ ...questionPaper, questions: updatedQuestions });
      toast({
        title: 'Question updated',
        description: 'The question has been successfully updated.',
      });
    } else {
      setQuestionPaper({ ...questionPaper, questions: [...questionPaper.questions, question] });
      toast({
        title: 'Question created',
        description: 'The question has been successfully created.',
      });
    }
    setIsQuestionDialogOpen(false);
    setSelectedQuestion(null);
  };

  const handleQuestionDialogClose = () => {
    setIsQuestionDialogOpen(false);
    setSelectedQuestion(null);
  };

  const renderQuestions = (sectionId: string, questions: Question[]) => {
    const sectionQuestions = questions.filter(q => q.sectionId === sectionId);
    
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      
      if (over && active.id !== over.id) {
        const activeIndex = sectionQuestions.findIndex(q => q.id === active.id);
        const overIndex = sectionQuestions.findIndex(q => q.id === over.id);
        
        // Get all questions
        const newQuestions = [...questionPaper.questions];
        
        // Find the indices in the full questions array
        const fullActiveIndex = newQuestions.findIndex(q => q.id === active.id);
        const fullOverIndex = newQuestions.findIndex(q => q.id === over.id);
        
        // Perform the array move
        const reorderedQuestions = arrayMove(newQuestions, fullActiveIndex, fullOverIndex);
        
        // Update state with the new order
        setQuestionPaper({
          ...questionPaper,
          questions: reorderedQuestions
        });
      }
    };
    
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
    
    if (sectionQuestions.length === 0) {
      return <div className="text-center text-gray-500 py-4">No questions added to this section yet.</div>;
    }
    
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={sectionQuestions.map(q => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {sectionQuestions.map((question) => (
            <SortableQuestionItem
              key={question.id}
              id={question.id}
              question={question}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
            />
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Create Question Paper</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Question Paper Name</Label>
                    <Input
                      type="text"
                      id="name"
                      value={questionPaper.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sections">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Section Name"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                    />
                    <Button onClick={handleAddSection}>Add Section</Button>
                  </div>
                  <ul>
                    {questionPaper.sections.map((section) => (
                      <li key={section.id} className="flex items-center justify-between py-2 border-b">
                        <span>{section.name}</span>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSection(section.id)}>
                          Delete
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="questions">
                {questionPaper.sections.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Please add sections first to create questions.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {questionPaper.sections.map((section) => (
                      <div key={section.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">{section.name}</h3>
                          <Button onClick={() => handleCreateQuestion(section.id)}>Add Question</Button>
                        </div>
                        {renderQuestions(section.id, questionPaper.questions)}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <QuestionDialog
        isOpen={isQuestionDialogOpen}
        onClose={handleQuestionDialogClose}
        onSave={handleSaveQuestion}
        question={selectedQuestion}
      />
    </DashboardLayout>
  );
};

interface QuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  question: Question | null;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({ isOpen, onClose, onSave, question }) => {
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [questionType, setQuestionType] = useState(question?.type || 'multiple_choice');
  const [options, setOptions] = useState(question?.options || [{ id: crypto.randomUUID(), text: '', isCorrect: false }]);
  const [answer, setAnswer] = useState(question?.answer || false);
  const [childQuestions, setChildQuestions] = useState(question?.childQuestions || []);

  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setQuestionType(question.type);
      setOptions(question.options || [{ id: crypto.randomUUID(), text: '', isCorrect: false }]);
      setAnswer(question.answer || false);
      setChildQuestions(question.childQuestions || []);
    } else {
      setQuestionText('');
      setQuestionType('multiple_choice');
      setOptions([{ id: crypto.randomUUID(), text: '', isCorrect: false }]);
      setAnswer(false);
      setChildQuestions([]);
    }
  }, [question]);

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...options];
    if (field === 'text') {
      newOptions[index] = { ...newOptions[index], text: value as string };
    } else if (field === 'isCorrect') {
      newOptions[index] = { ...newOptions[index], isCorrect: value as boolean };
    }
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), text: '', isCorrect: false }]);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (!question) return;

    const finalQuestion: Question = {
      ...question,
      text: questionText,
      type: questionType,
      options: options,
      answer: answer,
      childQuestions: childQuestions,
    };
    onSave(finalQuestion);
  };

  const renderOptionInputs = () => {
    return options.map((option, index) => (
      <div key={option.id} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option.text}
          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
        />
        <Checkbox
          checked={option.isCorrect}
          onCheckedChange={(checked) => handleOptionChange(index, 'isCorrect', !!checked)}
        />
        <Button variant="ghost" size="sm" onClick={() => handleDeleteOption(index)}>
          <Trash2 size={16} />
        </Button>
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{question ? 'Edit Question' : 'Create Question'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="question">Question Text</Label>
            <Textarea
              id="question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Question Type</Label>
            <RadioGroup value={questionType} onValueChange={setQuestionType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple_choice" id="multiple_choice" />
                <Label htmlFor="multiple_choice">Multiple Choice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true_false" id="true_false" />
                <Label htmlFor="true_false">True/False</Label>
              </div>
            </RadioGroup>
          </div>
          {questionType === 'multiple_choice' && (
            <div className="grid gap-2">
              <Label>Options</Label>
              {renderOptionInputs()}
              <Button variant="secondary" onClick={handleAddOption}>Add Option</Button>
            </div>
          )}
          {questionType === 'true_false' && (
            <div className="grid gap-2">
              <Label>Answer</Label>
              <Select value={String(answer)} onValueChange={(value) => setAnswer(value === 'true')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionPaper;
