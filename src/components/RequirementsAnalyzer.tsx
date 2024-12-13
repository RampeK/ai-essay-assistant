import React, { useState } from 'react';
import { EssayRequirements } from '../types/types';
import { analyzeRequirements } from '../services/ai';
import { EssayType } from './EssayTypeSelector';

interface Props {
  onRequirementsAnalyzed: (requirements: EssayRequirements) => void;
  essayType: EssayType;
}

const RequirementsAnalyzer: React.FC<Props> = ({ onRequirementsAnalyzed, essayType }) => {
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEssayRequirements = async () => {
    if (!instructions.trim()) {
      setError('Please enter essay instructions');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const requirements = await analyzeRequirements(instructions, essayType);
      onRequirementsAnalyzed(requirements);
    } catch (error) {
      setError('Error analyzing requirements. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="gradient-text text-2xl font-bold mb-6">
        Essay Requirements Analysis
      </h2>
      <div className="space-y-4">
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Paste your essay instructions here..."
          className="textarea h-32"
        />
        <button
          onClick={analyzeEssayRequirements}
          disabled={loading || !instructions.trim()}
          className="button"
        >
          {loading ? 'Analyzing...' : 'Analyze Requirements'}
        </button>

        {error && (
          <div className="text-red-400">{error}</div>
        )}
      </div>
    </div>
  );
};

export default RequirementsAnalyzer;