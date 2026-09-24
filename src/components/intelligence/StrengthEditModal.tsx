import React, { useState } from 'react';
import { CoreStrength } from '../../types/skillIntelligence';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { X, Check, Trash2, Award } from 'lucide-react';

interface StrengthEditModalProps {
  strength: CoreStrength;
  onSave: (strengthId: string, updates: Partial<CoreStrength>) => void;
  onRemove: (strengthId: string) => void;
  onClose: () => void;
}

export const StrengthEditModal: React.FC<StrengthEditModalProps> = ({
  strength,
  onSave,
  onRemove,
  onClose,
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState<string>(strength.title);
  const [rationale, setRationale] = useState<string>(strength.rationale);

  const handleSave = () => {
    if (title.trim()) {
      onSave(strength.id, {
        title: title.trim(),
        rationale: rationale.trim(),
        userStatus: 'edited',
      });
      onClose();
    }
  };

  const handleRemove = () => {
    onRemove(strength.id);
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
            <Award size={18} color="var(--color-steel-light)" />
            <h3 style={{ fontSize: '1.125rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
              Edit Identified Strength
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
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
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
              Strength Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="classic-input"
              style={{ width: '100%', fontSize: '0.9375rem' }}
            />
          </div>

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
              Demonstrated Rationale / Explanation
            </label>
            <textarea
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="classic-input"
              style={{ width: '100%', fontSize: '0.875rem', resize: 'vertical' }}
            />
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              background: 'rgba(7, 26, 58, 0.6)',
              border: '1px solid rgba(23, 74, 145, 0.3)',
              fontSize: '0.75rem',
              color: 'var(--color-steel-light)',
            }}
          >
            <strong>Supporting Evidence: </strong>
            {strength.evidence}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderTop: '1px solid rgba(23, 74, 145, 0.3)',
            paddingTop: '16px',
          }}
        >
          <button
            onClick={handleRemove}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(120, 20, 20, 0.25)',
              border: '1px solid rgba(229, 115, 115, 0.4)',
              color: 'var(--color-error)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
            <span>Remove Strength</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Check size={14} />}
            >
              {t.common.confirm}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
