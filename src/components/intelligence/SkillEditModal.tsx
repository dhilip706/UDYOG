import React, { useState } from 'react';
import { ExtractedSkill, SkillCategory } from '../../types/skillIntelligence';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { X, Check, Trash2, Edit3 } from 'lucide-react';

interface SkillEditModalProps {
  skill: ExtractedSkill;
  onSave: (skillId: string, updates: Partial<ExtractedSkill>) => void;
  onRemove: (skillId: string) => void;
  onClose: () => void;
}

const CATEGORIES: SkillCategory[] = [
  'TECHNICAL',
  'PRACTICAL',
  'DIGITAL',
  'COMMUNICATION',
  'PROBLEM_SOLVING',
  'TOOLS_EQUIPMENT',
  'DOMAIN_KNOWLEDGE',
  'BUSINESS',
  'TRADITIONAL',
  'EDUCATION_CERTIFICATION',
];

export const SkillEditModal: React.FC<SkillEditModalProps> = ({
  skill,
  onSave,
  onRemove,
  onClose,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState<string>(skill.name);
  const [category, setCategory] = useState<SkillCategory>(skill.category);
  const [experienceYears, setExperienceYears] = useState<number>(skill.experienceYears || 0);
  const [evidence, setEvidence] = useState<string>(skill.evidence);

  const handleSave = () => {
    if (name.trim()) {
      onSave(skill.id, {
        name: name.trim(),
        category,
        experienceYears: experienceYears > 0 ? experienceYears : undefined,
        evidence: evidence.trim() || skill.evidence,
        userStatus: 'edited',
      });
      onClose();
    }
  };

  const handleRemove = () => {
    onRemove(skill.id);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 11, 26, 0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="classic-navy-surface"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          animation: 'classic-fade-in 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(23, 74, 145, 0.3)',
            paddingBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit3 size={18} color="var(--color-steel-light)" />
            <h3 style={{ fontSize: '1.125rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
              {t.skillIntelligence.editSkill}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Skill Name */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                marginBottom: '6px',
                fontWeight: 500,
              }}
            >
              {t.skillIntelligence.skillNameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="classic-input"
              style={{ width: '100%', fontSize: '0.9375rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Category Dropdown */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                {t.skillIntelligence.skillCategoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="classic-input"
                style={{ width: '100%', fontSize: '0.875rem', cursor: 'pointer' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#0B2452', color: '#FFFFFF' }}>
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience in Years */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={experienceYears || 0}
                onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="classic-input"
                style={{ width: '100%', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {/* Supporting Evidence Editable */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                marginBottom: '6px',
                fontWeight: 500,
              }}
            >
              Supporting Evidence / Notes
            </label>
            <textarea
              rows={3}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="classic-input"
              style={{ width: '100%', fontSize: '0.8125rem', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            leftIcon={<Trash2 size={14} color="#FFFFFF" />}
          >
            {t.skillIntelligence.removeSkill}
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              {t.skillIntelligence.cancel}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<Check size={14} />}>
              {t.skillIntelligence.saveChanges}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
