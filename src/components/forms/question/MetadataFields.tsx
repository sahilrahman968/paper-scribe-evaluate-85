
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useFormContext } from "./FormContext";
import { boards, classes, subjects, chaptersBySubject, topicsByChapter, difficulties, questionTypes } from "./types";

export const MetadataFields = () => {
  const { 
    formData, 
    isView, 
    isEdit, 
    handleInputChange 
  } = useFormContext();

  const getAvailableChapters = () => {
    return formData.subject ? (chaptersBySubject[formData.subject] || []) : [];
  };

  const getAvailableTopics = () => {
    return formData.chapter ? (topicsByChapter[formData.chapter] || []) : [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="board">Examination Board *</Label>
        <Select 
          value={formData.board} 
          onValueChange={(value) => handleInputChange("board", value)}
          disabled={isView || isEdit}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select board" />
          </SelectTrigger>
          <SelectContent>
            {boards.map((board) => (
              <SelectItem key={board} value={board}>
                {board}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="class">Class *</Label>
        <Select 
          value={formData.class} 
          onValueChange={(value) => handleInputChange("class", value)}
          disabled={isView || isEdit}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Select 
          value={formData.subject} 
          onValueChange={(value) => {
            handleInputChange("subject", value);
            handleInputChange("chapter", "");
            handleInputChange("topics", []);
          }}
          disabled={isView || isEdit}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="chapter">Chapter *</Label>
        <Select
          value={formData.chapter}
          onValueChange={(value) => {
            handleInputChange("chapter", value);
            handleInputChange("topics", []);
          }}
          disabled={isView || (!formData.subject)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select chapter" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableChapters().map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="topic">Topics *</Label>
        <MultiSelect
          options={getAvailableTopics()}
          selected={formData.topics}
          onChange={(topics) => handleInputChange("topics", topics)}
          placeholder="Select topics"
          disabled={isView || (!formData.chapter)}
        />
      </div>
      
      <div>
        <Label htmlFor="marks">Marks *</Label>
        <Select 
          value={formData.marks} 
          onValueChange={(value) => handleInputChange("marks", value)}
          disabled={isView}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marks" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 8, 10].map((mark) => (
              <SelectItem key={mark} value={mark.toString()}>
                {mark}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="difficulty">Difficulty Level *</Label>
        <Select 
          value={formData.difficulty} 
          onValueChange={(value) => handleInputChange("difficulty", value)}
          disabled={isView}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="questionType">Question Type *</Label>
        <Select 
          value={formData.questionType} 
          onValueChange={(value) => handleInputChange("questionType", value)}
          disabled={isView}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            {questionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
