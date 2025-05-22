
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Image, Plus, X } from "lucide-react";
import { useFormContext } from "./FormContext";

export const OptionsInput = () => {
  const { 
    formData,
    options,
    isView,
    handleOptionChange,
    handleOptionImageUpload,
    addOption,
    removeOption
  } = useFormContext();

  const isSingleCorrect = formData.questionType === "single-correct";
  const isMultipleCorrect = formData.questionType === "multiple-correct";

  if (!isSingleCorrect && !isMultipleCorrect) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Options *</Label>
        {!isView && (
          <Button type="button" size="sm" variant="outline" onClick={addOption}>
            <Plus className="h-4 w-4 mr-1" /> Add Option
          </Button>
        )}
      </div>
      
      {options.map((option, index) => (
        <div key={index} className="space-y-2 border p-3 rounded-md">
          <div className="flex items-center gap-3">
            {isSingleCorrect ? (
              <RadioGroup value={option.isCorrect ? index.toString() : ""} onValueChange={(value) => {
                if (!isView) {
                  const newOptions = options.map((opt, idx) => ({
                    ...opt,
                    isCorrect: idx.toString() === value
                  }));
                  // We need to update each option individually
                  newOptions.forEach((opt, idx) => {
                    handleOptionChange(idx, "isCorrect", opt.isCorrect);
                  });
                }
              }}>
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isView} />
              </RadioGroup>
            ) : (
              <Checkbox 
                checked={option.isCorrect}
                onCheckedChange={(checked) => {
                  if (!isView) {
                    handleOptionChange(index, "isCorrect", checked === true);
                  }
                }}
                id={`option-${index}`}
                disabled={isView}
              />
            )}
            <Input
              placeholder={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => handleOptionChange(index, "text", e.target.value)}
              className="flex-1"
              disabled={isView}
            />
            {!isView && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleOptionImageUpload(index)}
              >
                <Image className="h-4 w-4" />
              </Button>
            )}
            {!isView && options.length > 2 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {option.image && (
            <div className="relative h-24 w-full rounded-md overflow-hidden">
              <img 
                src={option.image} 
                alt={`Option ${index + 1}`} 
                className="h-full w-full object-cover" 
              />
              {!isView && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    const optionWithoutImage = { ...option, image: undefined };
                    handleOptionChange(index, "text", optionWithoutImage.text);
                    handleOptionChange(index, "isCorrect", optionWithoutImage.isCorrect);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
