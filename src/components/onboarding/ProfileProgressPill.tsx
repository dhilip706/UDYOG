import React from 'react';
import { StructuredUserProfile } from '../../types/onboarding';
import { useLanguage } from '../../hooks/useLanguage';
import { Check } from 'lucide-react';

interface ProfileProgressPillProps {
  profile: StructuredUserProfile;
  currentStage: string;
}

export const ProfileProgressPill: React.FC<ProfileProgressPillProps> = ({
  profile,
  currentStage,
}) => {
  const { t } = useLanguage();

  const stages = [
    { key: 'PERSONAL', label: t.onboarding.stagePersonal, isDone: Boolean(profile.personal.name && profile.personal.age) },
    { key: 'EDUCATION', label: t.onboarding.stageEducation, isDone: Boolean(profile.education.level || profile.education.qualification) },
    { key: 'LIVELIHOOD', label: t.onboarding.stageLivelihood, isDone: Boolean(profile.livelihood.currentOccupation) },
    { key: 'SKILLS', label: t.onboarding.stageSkills, isDone: profile.skills.length > 0 },
    { key: 'INTERESTS', label: t.onboarding.stageInterests, isDone: profile.interests.length > 0 },
    { key: 'PREFERENCES', label: t.onboarding.stagePreferences, isDone: Boolean(profile.workPreferences.employmentType) },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '20px',
        background: 'rgba(11, 36, 82, 0.75)',
        border: '1px solid rgba(23, 74, 145, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontSize: '0.75rem',
        maxWidth: '100%',
        overflowX: 'auto',
      }}
      className="profile-progress-scroll"
    >
      <span
        style={{
          color: 'var(--color-steel-light)',
          fontWeight: 600,
          marginRight: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontSize: '0.6875rem',
          flexShrink: 0,
        }}
      >
        Profile:
      </span>

      {stages.map((st, index) => {
        const isActive = currentStage === st.key;
        return (
          <React.Fragment key={st.key}>
            {index > 0 && (
              <span style={{ color: 'rgba(139, 174, 219, 0.3)', margin: '0 2px' }}>
                •
              </span>
            )}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                color: st.isDone
                  ? '#FFFFFF'
                  : isActive
                  ? 'var(--color-steel-light)'
                  : 'var(--color-text-subtle)',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              <span>{st.label}</span>
              {st.isDone && <Check size={11} color="var(--color-steel-light)" />}
              {isActive && !st.isDone && (
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'var(--color-royal-highlight)',
                    display: 'inline-block',
                  }}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}

      <style>{`
        .profile-progress-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
