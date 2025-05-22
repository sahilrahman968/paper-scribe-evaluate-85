
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Image, Plus, X } from "lucide-react";
import { useFormContext } from "./FormContext";

export const NestedQuestions = () => {
  const { 
    formData,
    childQuestions,
    isView,
    isGenerating,
    handleInputChange,
    handleImageUpload,
    handleChildQuestionChange,
    handleChildQuestionImageUpload,
    addChildQuestion,
    removeChildQuestion
  } = useFormContext();

  if (formData.questionType !== "nested") return null;

  const canGenerateWithAI = () => {
    return formData.board && formData.class && formData.subject && 
           formData.questionType && formData.difficulty && formData.marks;
  };

  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="parentQuestion">Parent Question *</Label>
          <Button 
            type="button" 
            size="sm"
            variant="outline"
            onClick={() => handleImageUpload("parentQuestionImage")}
            disabled={isView}
          >
            <Image className="h-4 w-4 mr-1" /> Add Image
          </Button>
        </div>
        <Button 
          type="button" 
          size="sm" 
          disabled={isGenerating || !canGenerateWithAI() || isView}
          onClick={() => {}} // This would be connected to generateQuestion in the parent
        >
          {isGenerating ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
      
      {formData.parentQuestionImage && (
        <div className="relative w-full h-60 rounded-md overflow-hidden mb-2">
          <img 
            src={formData.parentQuestionImage} 
            alt="Parent Question" 
            className="w-full h-full object-cover" 
          />
          {!isView && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleInputChange("parentQuestionImage", "")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <div className="min-h-[150px] border rounded-md">
        <RichTextEditor
          value={formData.parentQuestion}
          onChange={(value) => handleInputChange("parentQuestion", value)}
          placeholder="Enter parent question text here (e.g., 'Answer the following questions:')"
          readOnly={isView}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-lg font-medium">Child Questions</h3>
        {!isView && (
          <Button type="button" size="sm" variant="outline" onClick={addChildQuestion}>
            <Plus className="h-4 w-4 mr-1" /> Add Child Question
          </Button>
        )}
      </div>
      
      {childQuestions.map((childQuestion, index) => (
        <div key={index} className="border p-4 rounded-md bg-white">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Question {index + 1}</h4>
            {!isView && childQuestions.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeChildQuestion(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor={`childQuestion-${index}`}>Question Text *</Label>
              {!isView && (
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline"
                  onClick={() => handleChildQuestionImageUpload(index)}
                >
                  <Image className="h-4 w-4 mr-1" /> Add Image
                </Button>
              )}
            </div>
            
            {childQuestion.questionImage && (
              <div className="relative w-full h-40 rounded-md overflow-hidden mb-2">
                <img 
                  src={childQuestion.questionImage} 
                  alt={`Child Question ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                {!isView && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleChildQuestionChange(index, "questionImage", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            
            <div className="min-h-[100px] border rounded-md">
              <RichTextEditor
                value={childQuestion.question}
                onChange={(value) => handleChildQuestionChange(index, "question", value)}
                placeholder="Enter child question text here"
                readOnly={isView}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-1/4">
                <Label htmlFor={`childMarks-${index}`}>Marks *</Label>
                <Input
                  id={`childMarks-${index}`}
                  type="number"
                  min="1"
                  placeholder="Marks"
                  value={childQuestion.marks}
                  onChange={(e) => handleChildQuestionChange(index, "marks", parseInt(e.target.value) || 0)}
                  disabled={isView}
                  required
                />
              </div>
              
              <div className="flex-1">
                <Label htmlFor={`childAnswer-${index}`}>Model Answer</Label>
                <Textarea
                  id={`childAnswer-${index}`}
                  placeholder="Enter model answer (optional)"
                  value={childQuestion.answer || ""}
                  onChange={(e) => handleChildQuestionChange(index, "answer", e.target.value)}
                  rows={2}
                  disabled={isView}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
