
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "./FormContext";

export const AnswerField = () => {
  const { 
    formData,
    isView,
    handleInputChange
  } = useFormContext();
  
  if (formData.questionType !== "fill-in-the-blank" && formData.questionType !== "subjective") return null;

  return (
    <div>
      <Label htmlFor="answer">Model Answer {formData.questionType === "fill-in-the-blank" ? "*" : ""}</Label>
      <Textarea
        id="answer"
        placeholder={
          formData.questionType === "fill-in-the-blank" 
            ? "Enter the correct answer" 
            : "Enter model answer (optional)"
        }
        value={formData.answer}
        onChange={(e) => handleInputChange("answer", e.target.value)}
        rows={formData.questionType === "fill-in-the-blank" ? 2 : 5}
        required={formData.questionType === "fill-in-the-blank"}
        disabled={isView}
        className="mt-1"
      />
    </div>
  );
};
