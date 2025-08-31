import React, { useState } from 'react';
import { GeneratedPost, GenerationStats } from '../types';
import { Copy, CheckCircle, Hash, Target, Clock, Zap, DollarSign } from 'lucide-react';

interface PostResultsProps {
  posts: GeneratedPost[];
  stats: GenerationStats;
  onGenerateNew: () => void;
}

export const PostResults: React.FC<PostResultsProps> = ({ posts, stats, onGenerateNew }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (post: GeneratedPost) => {
    const fullPost = `${post.content}\n\n${post.cta}\n\n${post.hashtags.map(tag => `#${tag}`).join(' ')}`;
    
    try {
      await navigator.clipboard.writeText(fullPost);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Stats Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Generated Posts</h2>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center text-gray-600">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              {stats.tokensUsed.toLocaleString()} tokens
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              {stats.generationTime.toFixed(1)}s
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1 text-green-500" />
              ~${stats.cost.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 mb-8">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.approach}</h3>
                    <p className="text-sm text-gray-500">{post.wordCount} words</p>
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard(post)}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  {copiedId === post.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-green-600 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-gray-600">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Post Content */}
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
                  {post.content}
                </div>
                
                {post.cta && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start">
                      <Target className="w-4 h-4 mr-2 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 font-medium">{post.cta}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex items-start">
                  <Hash className="w-4 h-4 mr-2 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((hashtag, hashIndex) => (
                      <span
                        key={hashIndex}
                        className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Generate New Button */}
      <div className="text-center">
        <button
          onClick={onGenerateNew}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
        >
          Generate New Posts
        </button>
      </div>
    </div>
  );
};