
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useFormContext } from "./FormContext";

export const RubricsInput = () => {
  const { 
    formData,
    rubrics,
    isView,
    handleRubricChange,
    addRubric,
    removeRubric
  } = useFormContext();

  if (formData.questionType !== "subjective") return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Evaluation Rubric *</Label>
        {!isView && (
          <Button type="button" size="sm" variant="outline" onClick={addRubric}>
            <Plus className="h-4 w-4 mr-1" /> Add Criteria
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">Total weight must sum to 100%</p>
      
      {rubrics.map((rubric, index) => (
        <div key={index} className="flex items-center gap-3 border p-3 rounded-md">
          <Input
            placeholder="Evaluation criteria"
            value={rubric.criteria}
            onChange={(e) => handleRubricChange(index, "criteria", e.target.value)}
            className="flex-1"
            disabled={isView}
          />
          <div className="flex items-center gap-2 min-w-[100px]">
            <Input
              type="number"
              min="1"
              max="100"
              value={rubric.weight}
              onChange={(e) => handleRubricChange(index, "weight", parseInt(e.target.value) || 0)}
              className="w-20"
              disabled={isView}
            />
            <span>%</span>
          </div>
          {!isView && rubrics.length > 1 && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => removeRubric(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      <div className="text-sm font-medium">
        Total: {rubrics.reduce((sum, rubric) => sum + rubric.weight, 0)}%
      </div>
    </div>
  );
};
