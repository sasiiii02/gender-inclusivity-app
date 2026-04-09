import { Check } from "lucide-react";

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((stepLabel, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <div key={stepNum} className="flex flex-col items-center flex-1 relative">
              {/* Connector line behind the circle */}
              {index !== steps.length - 1 && (
                <div 
                  className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 transition-colors duration-300 ${
                    isCompleted ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}

              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                  isActive ? 'bg-purple-600 text-white shadow-md shadow-purple-200 ring-4 ring-purple-50' : 
                  isCompleted ? 'bg-purple-600 text-white' : 
                  'bg-gray-100 text-gray-500 border border-gray-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              
              <span className={`mt-2 text-xs font-medium transition-colors ${
                isActive ? 'text-purple-700' : 
                isCompleted ? 'text-gray-700' : 
                'text-gray-400'
              }`}>
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
