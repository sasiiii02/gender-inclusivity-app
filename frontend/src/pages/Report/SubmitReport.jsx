import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import StepIndicator from "../../components/report/StepIndicator";
import FileUploadZone from "../../components/report/FileUploadZone";
import { submitReport, getReportCategories } from "../../services/reportService";

const SubmitReport = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incidentDate: "",
    incidentType: "",
    categoryId: "",
    location: "",
    isAnonymous: false,
    confirmed: false
  });
  
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getReportCategories();
        if (data.success) setCategories(data.categories);
      } catch (error) {
        toast.error("Failed to fetch report categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleNext = () => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) stepErrors.title = "Title is required";
      if (!formData.description.trim()) stepErrors.description = "Description is required";
      else if (formData.description.length < 50) stepErrors.description = "Minimum 50 characters required";
      if (!formData.incidentDate) stepErrors.incidentDate = "Date is required";
      if (!formData.location) stepErrors.location = "Location is required";
      if (!formData.categoryId) stepErrors.categoryId = "Category type is required";
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("incidentDate", formData.incidentDate);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("isAnonymous", formData.isAnonymous);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("priority", "Medium");

      // Append files if any
      if (files && files.length > 0) {
        files.forEach(file => {
          formDataToSend.append("evidence", file);
        });
      }

      const response = await submitReport(formDataToSend);
      
      navigate("/student/reports/success", { state: { reportId: response.report._id } });
      toast.success("Report submitted successfully!");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Generate Incident Report</h1>
        
        <StepIndicator 
          currentStep={currentStep} 
          steps={["Incident Details", "Upload Evidence", "Review & Submit"]} 
        />

        <div className="mt-8">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={`w-full p-2.5 rounded-lg border ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="E.g. Inappropriate comment in cafeteria"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Incident <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                  className={`w-full p-2.5 rounded-lg border ${errors.incidentDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.incidentDate && <p className="mt-1 text-xs text-red-500">{errors.incidentDate}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className={`w-full p-2.5 rounded-lg border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} focus:ring-purple-500 focus:outline-none focus:ring-2`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className={`w-full p-2.5 rounded-lg border ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} focus:outline-none focus:ring-2`}
                    placeholder="Where did this happen?"
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Detailed Description <span className="text-red-500">*</span></span>
                  <span className={`text-xs ${formData.description.length < 50 ? 'text-red-400' : 'text-green-500'}`}>
                    {formData.description.length} / 50 min
                  </span>
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="5"
                  className={`w-full p-3 rounded-lg border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} focus:outline-none focus:ring-2`}
                  placeholder="Please describe exactly what happened..."
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <input 
                  type="checkbox" 
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Submit this report anonymously
                </label>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 mb-4">
                Providing evidence (screenshots, documents, photos) helps authorities investigate the incident thoroughly. This step is completely optional.
              </div>
              <FileUploadZone files={files} setFiles={setFiles} />
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Review Your Submission</h3>
                
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-medium">{formData.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date & Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.incidentDate} at {formData.location}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 bg-white p-3 border border-gray-100 rounded-lg">{formData.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Privacy</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.isAnonymous ? "Anonymous Submission" : "Standard Submission"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Evidence Attached</dt>
                    <dd className="mt-1 text-sm text-gray-900">{files.length} file(s)</dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-start space-x-3 mt-8">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    id="confirm"
                    checked={formData.confirmed}
                    onChange={(e) => setFormData({...formData, confirmed: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                  />
                </div>
                <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer select-none">
                  I confirm that the information provided is accurate and true to the best of my knowledge. I understand that false reports may lead to disciplinary action.
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
            >
              Back
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 tracking-wide transition-all shadow-sm hover:shadow-md"
              >
                Proceed to {currentStep === 1 ? 'Evidence' : 'Review'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.confirmed || isSubmitting}
                className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                ) : 'Submit Report'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReport;
