
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, XCircle, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

const UploadResults = () => {
  const navigate = useNavigate();
  const [selectedPaper, setSelectedPaper] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const availablePapers = [
    { id: "1", title: "Mid-term Physics Exam" },
    { id: "2", title: "Mathematics Final" },
    { id: "3", title: "Chemistry Quiz 3" },
    { id: "4", title: "Biology Unit Test" },
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedPaper) {
      toast.error("Please select a question paper");
      return;
    }
    
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    
    setUploading(true);
    
    // Mock upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setProcessing(true);
        
        // Mock processing time
        setTimeout(() => {
          setProcessing(false);
          toast.success("Answer sheets processed successfully!");
          navigate("/dashboard/results");
        }, 3000);
      }
    }, 150);
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Upload Answer Sheets</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Question Paper</CardTitle>
            <CardDescription>
              Choose the question paper for which you're uploading answer sheets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPaper} onValueChange={setSelectedPaper}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a question paper" />
              </SelectTrigger>
              <SelectContent>
                {availablePapers.map((paper) => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload student answer sheets in PDF or image format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    const fileArray = Array.from(e.dataTransfer.files);
                    setFiles([...files, ...fileArray]);
                  }
                }}
              >
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">
                  Drag and drop your files here, or{" "}
                  <label className="text-indigo-600 cursor-pointer hover:text-indigo-500">
                    browse
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, JPG, PNG
                </p>
              </div>
              
              {files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li 
                        key={index} 
                        className="bg-gray-50 p-2 rounded flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm truncate max-w-xs">{file.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                        <button 
                          onClick={() => removeFile(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={uploading || processing || !selectedPaper || files.length === 0}
            >
              {uploading 
                ? "Uploading..." 
                : processing 
                ? "Processing..."
                : "Upload and Process"}
            </Button>
          </CardFooter>
        </Card>
        
        {(uploading || processing) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {uploading ? "Uploading" : "Processing"}
              </CardTitle>
              <CardDescription>
                {uploading 
                  ? "Uploading your files. Please wait..." 
                  : "Analyzing and evaluating answer sheets..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {uploading && (
                  <>
                    <Progress value={uploadProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Uploading {files.length} files</span>
                      <span>{uploadProgress}%</span>
                    </div>
                  </>
                )}
                
                {processing && (
                  <div className="flex flex-col items-center py-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-sm text-gray-600">
                      Analyzing and grading answer sheets. This may take a few minutes...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadResults;
