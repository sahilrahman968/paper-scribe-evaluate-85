
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "./FormContext";

export const TrueFalseInput = () => {
  const { 
    formData,
    options,
    isView,
  } = useFormContext();

  if (formData.questionType !== "true-false") return null;

  // For true-false questions, we need to set options in the parent component
  // Since that's where the state is managed

  return (
    <div className="space-y-2">
      <Label>Correct Answer *</Label>
      <RadioGroup 
        defaultValue={options.findIndex(opt => opt.isCorrect) === 0 ? "true" : "false"}
        onValueChange={(value) => {
          // This would be handled in the parent component
          // Since that's where the state for options is managed
        }}
        disabled={isView}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="true" disabled={isView} />
          <Label htmlFor="true">True</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="false" disabled={isView} />
          <Label htmlFor="false">False</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
