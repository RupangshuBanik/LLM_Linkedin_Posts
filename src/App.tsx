import React, { useState } from 'react';
import { TopicForm } from './components/TopicForm';
import { PostResults } from './components/PostResults';
import { LoadingProgress } from './components/LoadingProgress';
import { ErrorMessage } from './components/ErrorMessage';
import { PostGenerationRequest, GeneratedPost, GenerationStats, AgentStep } from './types';
import { geminiService } from './services/geminiService';

type AppState = 'form' | 'loading' | 'results' | 'error';

function App() {
  const [state, setState] = useState<AppState>('form');
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [stats, setStats] = useState<GenerationStats | null>(null);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');

  const agentSteps: AgentStep[] = [
    {
      step: 'analyze',
      description: 'Analyzing topic and planning post strategies',
      completed: false
    },
    {
      step: 'generate',
      description: 'Generating LinkedIn post variations',
      completed: false
    },
    {
      step: 'hashtags',
      description: 'Extracting relevant hashtags',
      completed: false
    },
    {
      step: 'cta',
      description: 'Creating compelling calls-to-action',
      completed: false
    },
    {
      step: 'quality',
      description: 'Applying quality filters and finalizing',
      completed: false
    }
  ];

  const [stepProgress, setStepProgress] = useState<AgentStep[]>(agentSteps);

  const handleFormSubmit = async (request: PostGenerationRequest) => {
    setState('loading');
    setError('');
    setStepProgress(agentSteps.map(step => ({ ...step, completed: false })));
    
    try {
      const result = await geminiService.generatePosts(request, (step: string) => {
        setCurrentStep(step);
        // Update step progress based on the current step
        setStepProgress(prev => prev.map(s => ({
          ...s,
          completed: step.includes('Analyzing') ? s.step === 'analyze' :
                    step.includes('Generating') ? ['analyze', 'generate'].includes(s.step) :
                    step.includes('hashtags') ? ['analyze', 'generate', 'hashtags'].includes(s.step) :
                    step.includes('CTA') ? ['analyze', 'generate', 'hashtags', 'cta'].includes(s.step) :
                    step.includes('quality') ? true : s.completed
        })));
      });
      
      setPosts(result.posts);
      setStats(result.stats);
      setState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  };

  const handleGenerateNew = () => {
    setState('form');
    setPosts([]);
    setStats(null);
    setError('');
  };

  const handleRetry = () => {
    setState('form');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">LinkedIn Post Generator</h1>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Gemini AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {state === 'form' && (
          <TopicForm onSubmit={handleFormSubmit} isLoading={false} />
        )}
        
        {state === 'loading' && (
          <LoadingProgress currentStep={currentStep} steps={stepProgress} />
        )}
        
        {state === 'results' && posts.length > 0 && stats && (
          <PostResults posts={posts} stats={stats} onGenerateNew={handleGenerateNew} />
        )}
        
        {state === 'error' && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Transform your ideas into engaging LinkedIn content with AI-powered generation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;