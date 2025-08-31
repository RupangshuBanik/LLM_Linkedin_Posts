export interface PostGenerationRequest {
  topic: string;
  tone?: 'professional' | 'casual' | 'thought-leadership' | 'storytelling' | 'educational';
  audience?: 'general' | 'entrepreneurs' | 'developers' | 'executives' | 'marketers';
  length?: 'short' | 'medium' | 'long';
  postCount?: number;
}

export interface GeneratedPost {
  id: string;
  content: string;
  hashtags: string[];
  cta: string;
  approach: string;
  wordCount: number;
}

export interface GenerationStats {
  tokensUsed: number;
  generationTime: number;
  cost: number;
}

export interface PostGenerationResponse {
  posts: GeneratedPost[];
  stats: GenerationStats;
}

export interface AgentStep {
  step: string;
  description: string;
  completed: boolean;
}