import React from 'react';
import { ConversationTurn } from '../../types/onboarding';
import { useLanguage } from '../../hooks/useLanguage';
import { X, MessageSquare } from 'lucide-react';

interface TranscriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: ConversationTurn[];
  companionName: string;
}

export const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({
  isOpen,
  onClose,
  transcript,
  companionName,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(7, 26, 58, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'classic-fade-in 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'rgba(11, 36, 82, 0.95)',
          borderLeft: '1px solid rgba(23, 74, 145, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(23, 74, 145, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} color="var(--color-steel-light)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {t.onboarding.transcriptTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Turn List */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {transcript.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '40px' }}>
              No messages recorded yet.
            </div>
          ) : (
            transcript.map((turn) => {
              const isAi = turn.speaker === 'companion';
              return (
                <div
                  key={turn.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: isAi ? 'var(--color-steel-light)' : 'var(--color-text-muted)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isAi ? companionName : 'USER'}
                  </span>
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: isAi ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                      background: isAi ? 'rgba(18, 54, 111, 0.75)' : 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
                      border: `1px solid ${isAi ? 'rgba(23, 74, 145, 0.5)' : 'rgba(139, 174, 219, 0.35)'}`,
                      color: '#FFFFFF',
                      fontSize: '0.875rem',
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                    }}
                  >
                    {turn.text}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
