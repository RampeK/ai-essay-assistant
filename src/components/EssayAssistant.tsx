import React, { useState } from 'react';
import { EssayRequirements } from '../types/types';
import RequirementsAnalyzer from './RequirementsAnalyzer';
import StructurePlanner from './StructurePlanner';
import TextAnalyzer from './TextAnalyzer';
import EssayTypeSelector, { EssayType } from './EssayTypeSelector';

const EssayAssistant: React.FC = () => {
  const [requirements, setRequirements] = useState<EssayRequirements | null>(null);
  const [showStructure, setShowStructure] = useState(false);
  const [essayType, setEssayType] = useState<EssayType | null>(null);

  const handleRequirementsAnalyzed = (analyzedRequirements: EssayRequirements) => {
    setRequirements(analyzedRequirements);
    setShowStructure(true);
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
        <div className="fade-in">
          <div className="section-spacing">
            <EssayTypeSelector 
              onSelect={setEssayType} 
              selectedType={essayType} 
            />
          </div>
        </div>
        
        {essayType && (
          <div className="space-y-12 slide-up">
            <RequirementsAnalyzer 
              onRequirementsAnalyzed={handleRequirementsAnalyzed}
              essayType={essayType}
            />

            {requirements && showStructure && (
              <div className="space-y-12 scale-in">
                <StructurePlanner requirements={requirements} />
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