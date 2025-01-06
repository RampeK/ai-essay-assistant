import React, { useState } from 'react';
import { EssayRequirements, EssayStructure } from '../types/types';
import RequirementsAnalyzer from './RequirementsAnalyzer';
import StructurePlanner from './StructurePlanner';
import TextAnalyzer from './TextAnalyzer';
import EssayTypeSelector, { EssayType } from './EssayTypeSelector';
import { planStructure } from '../services/ai';

const EssayAssistant: React.FC = () => {
  const [requirements, setRequirements] = useState<EssayRequirements | null>(null);
  const [structure, setStructure] = useState<EssayStructure | null>(null);
  const [essayType, setEssayType] = useState<EssayType | null>(null);

  const handleRequirementsAnalyzed = async (analyzedRequirements: EssayRequirements) => {
    setRequirements(analyzedRequirements);
    try {
      const plannedStructure = await planStructure(analyzedRequirements);
      setStructure(plannedStructure);
    } catch (error) {
      console.error('Error generating structure:', error);
    }
  };

  return (
    <div className="app-background">
      <div className="header-banner">
        <div className="container-wrapper">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center">
            Essay Assistant
          </h1>
        </div>
      </div>

      <div className="container-wrapper mt-12">
        <div>
          <div className="section-spacing">
            <EssayTypeSelector 
              onSelect={setEssayType} 
              selectedType={essayType} 
            />
          </div>
        </div>
        
        {essayType && (
          <div className="space-y-12">
            <RequirementsAnalyzer 
              onRequirementsAnalyzed={handleRequirementsAnalyzed}
              essayType={essayType}
            />

            {requirements && structure && (
              <div className="space-y-12">
                <StructurePlanner 
                  requirements={requirements} 
                  structure={structure} 
                />
                <TextAnalyzer requirements={requirements} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayAssistant; 