import React, { useState } from 'react';
import { EssayRequirements, EssayStructure } from '../types/types';
import { planStructure } from '../services/ai';

interface Props {
  requirements: EssayRequirements;
}

const StructurePlanner: React.FC<Props> = ({ requirements }) => {
  const [structure, setStructure] = useState<EssayStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateStructure = async () => {
    if (!requirements) {
      setError('No requirements found. Please analyze requirements first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const plannedStructure = await planStructure(requirements);
      if (!plannedStructure) {
        throw new Error('Failed to generate structure');
      }
      setStructure(plannedStructure);
      setHasGenerated(true);
    } catch (error) {
      setError('Error planning structure. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset generation state when requirements change
  React.useEffect(() => {
    setHasGenerated(false);
    setStructure(null);
    setError(null);
  }, [requirements]);

  return (
    <div className="card">
      <h2 className="gradient-text text-2xl font-bold mb-6">
        Essay Structure Planning
      </h2>
      <button 
        onClick={generateStructure}
        disabled={loading || hasGenerated}
        className={`button mb-6 ${hasGenerated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Generating...' : hasGenerated ? 'Structure Generated' : 'Generate Structure'}
      </button>

      {error && (
        <div className="text-red-400 mb-4">{error}</div>
      )}
      
      {hasGenerated && structure && (
        <div className="space-y-6">
          <div className="structure-section">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Introduction</h3>
            <p className="text-text-secondary opacity-90">{structure.introduction}</p>
          </div>

          <div className="structure-section">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Main Arguments</h3>
            <ol className="list-decimal pl-5 space-y-6">
              {structure.mainArguments?.map((arg, i) => (
                <li key={i} className="text-text-secondary">
                  <h4 className="font-semibold text-lg mb-2 text-text-primary">{arg.section}</h4>
                  <div className="pl-2 border-l-2 border-text-primary">
                    <p className="opacity-90 leading-relaxed whitespace-pre-wrap">{arg.content}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="structure-section">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Conclusion</h3>
            <p className="text-text-secondary opacity-90">{structure.conclusion}</p>
          </div>

          <div className="structure-section">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Suggested Structure</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li className="text-text-secondary opacity-90">Introduction</li>
              {structure.mainArguments?.map((arg, i) => (
                <li key={i} className="text-text-secondary opacity-90">
                  {arg.section}
                </li>
              ))}
              <li className="text-text-secondary opacity-90">Conclusion</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructurePlanner;