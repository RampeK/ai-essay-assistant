import React, { useState } from 'react';
import { EssayRequirements, TextAnalysis } from '../types/types';
import { analyzeText } from '../services/ai';

interface Props {
  requirements: EssayRequirements;
}

const TextAnalyzer: React.FC<Props> = ({ requirements }) => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEssay = async () => {
    if (!text.trim()) {
      setError('Please enter essay text to analyze');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeText(text, requirements);
      setAnalysis(result);
    } catch (error) {
      setError('Error analyzing text. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">
        Essay Analysis
      </h2>
      <div className="space-y-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your essay here..."
          className="textarea h-48"
        />
        <button
          onClick={analyzeEssay}
          disabled={loading}
          className="button-static w-full"
        >
          {loading ? 'Analyzing...' : 'Analyze Essay'}
        </button>

        {error && (
          <div className="text-red-400 p-3 bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="analysis-section">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Analysis</h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {analysis.feedback.generalFeedback}
              </div>
            </div>

            {analysis.feedback.suggestions.length > 0 && (
              <div className="analysis-section">
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Suggestions for Improvement
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {analysis.feedback.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextAnalyzer; 