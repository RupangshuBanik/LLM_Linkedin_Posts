import React from 'react';
import { AgentStep } from '../types';
import { CheckCircle, Clock } from 'lucide-react';

interface LoadingProgressProps {
  currentStep: string;
  steps: AgentStep[];
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Posts</h2>
          <p className="text-gray-600">Our AI agent is working through multiple steps to create the best content</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg border transition-all duration-300 ${
                step.completed
                  ? 'bg-green-50 border-green-200'
                  : step.step === currentStep
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="mr-4">
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : step.step === currentStep ? (
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Clock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <div className={`font-medium ${
                  step.completed ? 'text-green-800' : step.step === currentStep ? 'text-blue-800' : 'text-gray-600'
                }`}>
                  {step.step}
                </div>
                <div className="text-sm text-gray-600">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            AI agent is processing your request...
          </div>
        </div>
      </div>
    </div>
  );
};