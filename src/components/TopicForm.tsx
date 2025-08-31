import React, { useState } from 'react';
import { PostGenerationRequest } from '../types';
import { Sparkles, Users, MessageCircle, Clock } from 'lucide-react';

interface TopicFormProps {
  onSubmit: (request: PostGenerationRequest) => void;
  isLoading: boolean;
}

export const TopicForm: React.FC<TopicFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PostGenerationRequest>({
    topic: '',
    tone: 'professional',
    audience: 'general',
    length: 'medium',
    postCount: 4
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.topic.trim()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof PostGenerationRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Post Generator</h1>
          <p className="text-gray-600">Transform your ideas into engaging LinkedIn content with AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Input */}
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
              Topic or Idea *
            </label>
            <textarea
              id="topic"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              placeholder="e.g., Cold-start strategies for marketplaces, Remote work productivity tips, Building startup culture..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              rows={3}
              required
            />
          </div>

          {/* Optional Settings Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <MessageCircle className="inline w-4 h-4 mr-1" />
                Tone & Style
              </label>
              <div className="space-y-2">
                {[
                  { value: 'professional', label: 'Professional', desc: 'Formal and business-focused' },
                  { value: 'casual', label: 'Casual', desc: 'Friendly and approachable' },
                  { value: 'thought-leadership', label: 'Thought Leadership', desc: 'Authoritative and insightful' },
                  { value: 'storytelling', label: 'Storytelling', desc: 'Narrative and personal' },
                  { value: 'educational', label: 'Educational', desc: 'Informative and helpful' }
                ].map((option) => (
                  <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      checked={formData.tone === option.value}
                      onChange={(e) => handleInputChange('tone', e.target.value)}
                      className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Audience & Settings */}
            <div className="space-y-6">
              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Target Audience
                </label>
                <select
                  value={formData.audience}
                  onChange={(e) => handleInputChange('audience', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General Professional</option>
                  <option value="entrepreneurs">Entrepreneurs</option>
                  <option value="developers">Developers</option>
                  <option value="executives">Executives</option>
                  <option value="marketers">Marketers</option>
                </select>
              </div>

              {/* Post Length */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Post Length
                </label>
                <select
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="short">Short (50-100 words)</option>
                  <option value="medium">Medium (100-200 words)</option>
                  <option value="long">Long (200-300 words)</option>
                </select>
              </div>

              {/* Number of Posts */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Variations
                </label>
                <select
                  value={formData.postCount}
                  onChange={(e) => handleInputChange('postCount', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={3}>3 Posts</option>
                  <option value={4}>4 Posts</option>
                  <option value={5}>5 Posts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={!formData.topic.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Generating Posts...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate LinkedIn Posts
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};