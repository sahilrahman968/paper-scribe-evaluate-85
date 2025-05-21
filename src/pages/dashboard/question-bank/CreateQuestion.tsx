
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuestionForm from "@/components/forms/QuestionForm";

const CreateQuestion = () => {
  const [activeTab, setActiveTab] = useState("manual");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create Question</h1>
        
        <div>
          <Tabs defaultValue="manual" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="manual">Create Manually</TabsTrigger>
              <TabsTrigger value="ai">Generate with AI</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="manual">
                <div className="bg-white p-6 rounded-lg shadow">
                  <QuestionForm type="manual" />
                </div>
              </TabsContent>
              <TabsContent value="ai">
                <div className="bg-white p-6 rounded-lg shadow">
                  <QuestionForm type="ai" />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestion;
