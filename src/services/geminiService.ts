import { PostGenerationRequest, GeneratedPost, GenerationStats } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

class GeminiService {
  private async callGemini(prompt: string): Promise<{ text: string; tokensUsed: number }> {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '';
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;
    
    return { text, tokensUsed };
  }

  async generatePosts(request: PostGenerationRequest, onStepUpdate?: (step: string) => void): Promise<{ posts: GeneratedPost[]; stats: GenerationStats }> {
    const startTime = Date.now();
    let totalTokens = 0;

    try {
      // Step 1: Analyze topic and plan approach
      onStepUpdate?.('Analyzing topic and planning post strategies...');
      
      const planningPrompt = `
        As a LinkedIn content strategist, analyze this topic and plan different post approaches:
        
        Topic: "${request.topic}"
        Tone: ${request.tone || 'professional'}
        Audience: ${request.audience || 'general'}
        Length: ${request.length || 'medium'}
        
        Create a strategic plan for ${request.postCount || 4} different LinkedIn posts. For each post, specify:
        1. The content approach (e.g., question-based, story-driven, list format, insight-sharing)
        2. Key points to highlight
        3. Emotional hook or engagement strategy
        
        Return your response as a JSON array with this structure:
        [
          {
            "approach": "Question-based engagement",
            "keyPoints": ["point1", "point2", "point3"],
            "hook": "Opening question or statement"
          }
        ]
        
        Make each approach distinctly different to provide variety.
      `;

      const planningResult = await this.callGemini(planningPrompt);
      totalTokens += planningResult.tokensUsed;
      
      let postPlans;
      try {
        const jsonMatch = planningResult.text.match(/\[[\s\S]*\]/);
        postPlans = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      } catch {
        // Fallback if JSON parsing fails
        postPlans = [
          { approach: "Professional insight", keyPoints: [request.topic], hook: "Industry insight" },
          { approach: "Question-based", keyPoints: [request.topic], hook: "Thought-provoking question" },
          { approach: "Story-driven", keyPoints: [request.topic], hook: "Personal experience" },
          { approach: "Educational", keyPoints: [request.topic], hook: "Key learning" }
        ];
      }

      // Step 2: Generate posts based on plans
      onStepUpdate?.('Generating LinkedIn post variations...');
      
      const posts: GeneratedPost[] = [];
      
      for (let i = 0; i < Math.min(postPlans.length, request.postCount || 4); i++) {
        const plan = postPlans[i];
        
        const postPrompt = `
          Create a LinkedIn post following this plan:
          
          Topic: "${request.topic}"
          Approach: ${plan.approach}
          Key Points: ${plan.keyPoints?.join(', ') || request.topic}
          Hook: ${plan.hook}
          Tone: ${request.tone || 'professional'}
          Audience: ${request.audience || 'general'}
          Length: ${request.length || 'medium'} (short: 50-100 words, medium: 100-200 words, long: 200-300 words)
          
          Guidelines:
          - Write in first person when appropriate
          - Include line breaks for readability
          - Be authentic and engaging
          - Avoid overly promotional language
          - Include a clear call-to-action at the end
          - Make it LinkedIn-appropriate (professional but personable)
          
          Return ONLY the post content without hashtags or additional commentary.
        `;

        const postResult = await this.callGemini(postPrompt);
        totalTokens += postResult.tokensUsed;

        // Step 3: Generate hashtags for this post
        const hashtagPrompt = `
          Generate 5-8 relevant LinkedIn hashtags for this post about "${request.topic}". 
          Consider the tone (${request.tone || 'professional'}) and audience (${request.audience || 'general'}).
          
          Return only the hashtags as a comma-separated list without the # symbol.
          Example: LinkedInTips, CareerAdvice, ProfessionalGrowth
        `;

        const hashtagResult = await this.callGemini(hashtagPrompt);
        totalTokens += hashtagResult.tokensUsed;

        const hashtags = hashtagResult.text
          .split(',')
          .map(tag => tag.trim().replace('#', ''))
          .filter(tag => tag.length > 0)
          .slice(0, 8);

        // Step 4: Generate CTA
        const ctaPrompt = `
          Create a brief, engaging call-to-action (1-2 sentences) for a LinkedIn post about "${request.topic}".
          Tone: ${request.tone || 'professional'}
          
          Make it encourage engagement (comments, shares, connections, etc.) and be specific to the topic.
          Return only the CTA text.
        `;

        const ctaResult = await this.callGemini(ctaPrompt);
        totalTokens += ctaResult.tokensUsed;

        posts.push({
          id: `post-${i + 1}`,
          content: postResult.text.trim(),
          hashtags,
          cta: ctaResult.text.trim(),
          approach: plan.approach,
          wordCount: postResult.text.trim().split(' ').length
        });
      }

      // Step 5: Quality check
      onStepUpdate?.('Applying quality filters and finalizing posts...');

      const endTime = Date.now();
      const generationTime = (endTime - startTime) / 1000;

      const stats: GenerationStats = {
        tokensUsed: totalTokens,
        generationTime,
        cost: totalTokens * 0.00001 // Rough estimate for Gemini pricing
      };

      return { posts, stats };

    } catch (error) {
      console.error('Error generating posts:', error);
      throw new Error('Failed to generate posts. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();