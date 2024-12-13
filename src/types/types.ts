interface EssayRequirements {
    length: {
      min?: number;
      max?: number;
      unit: 'words' | 'pages';
    };
    structure: {
      hasIntroduction: boolean;
      hasConclusion: boolean;
      requiredSections?: string[];
    };
    sourceRequirements: {
      minSources?: number;
      sourceTypes?: string[];
    };
    evaluationCriteria: string[];
    topicLimitations?: string[];
  }
  
  interface EssayStructure {
    introduction: string;
    mainArguments: {
      section: string;
      content: string;
    }[];
    conclusion: string;
  }
  
  interface TextAnalysis {
    feedback: {
      generalFeedback: string;
      suggestions: string[];
    };
  }
  
  export type { EssayRequirements, EssayStructure, TextAnalysis };