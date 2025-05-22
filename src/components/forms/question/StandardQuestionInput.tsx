
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Image, X } from "lucide-react";
import { useFormContext } from "./FormContext";

export const StandardQuestionInput = () => {
  const { 
    formData, 
    isView, 
    isGenerating,
    handleInputChange,
    handleImageUpload
  } = useFormContext();

  const canGenerateWithAI = () => {
    return formData.board && formData.class && formData.subject && 
           formData.questionType && formData.difficulty && formData.marks;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="question">Question *</Label>
          <Button 
            type="button" 
            size="sm"
            variant="outline"
            onClick={() => handleImageUpload("questionImage")}
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
      
      {formData.questionImage && (
        <div className="relative w-full h-60 rounded-md overflow-hidden mb-2">
          <img 
            src={formData.questionImage} 
            alt="Question" 
            className="w-full h-full object-cover" 
          />
          {!isView && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleInputChange("questionImage", "")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <div className="min-h-[200px] border rounded-md">
        <RichTextEditor
          value={formData.question}
          onChange={(value) => handleInputChange("question", value)}
          placeholder="Enter question text here"
          readOnly={isView}
        />
      </div>
    </div>
  );
};
