
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuestionForm from "@/components/forms/QuestionForm";

const CreateQuestion = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create Question</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <QuestionForm type="manual" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuestion;
