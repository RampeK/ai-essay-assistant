import React from 'react';

export type EssayType = 'academic' | 'opinion' | 'creative' | 'research' | 'analytical';

interface Props {
  onSelect: (type: EssayType) => void;
  selectedType: EssayType | null;
}

const EssayTypeSelector: React.FC<Props> = ({ onSelect, selectedType }) => {
  const essayTypes = [
    { id: 'academic', label: 'Academic Essay', icon: '🎓', description: 'Formal academic writing with research and citations' },
    { id: 'opinion', label: 'Opinion Piece', icon: '💭', description: 'Personal viewpoint on a specific topic' },
    { id: 'creative', label: 'Creative Writing', icon: '✍️', description: 'Imaginative and expressive writing' },
    { id: 'research', label: 'Research Paper', icon: '🔍', description: 'In-depth research and analysis' },
    { id: 'analytical', label: 'Analytical Essay', icon: '📊', description: 'Critical analysis and evaluation' }
  ] as const;

  return (
    <div className="essay-type-grid">
      {essayTypes.map(type => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id as EssayType)}
          className={`essay-type-card ${selectedType === type.id ? 'selected' : ''}`}
        >
          <span className="essay-type-icon">{type.icon}</span>
          <h3 className="essay-type-title">{type.label}</h3>
          <p className="essay-type-description">{type.description}</p>
        </button>
      ))}
    </div>
  );
};

export default EssayTypeSelector; 