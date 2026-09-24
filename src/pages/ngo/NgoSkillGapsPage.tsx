import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { SkillGapItem } from '../../types/ngo';
import {
  TrendingUp,
  CheckCircle2,
  Tag,
} from 'lucide-react';

export const NgoSkillGapsPage: React.FC = () => {
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [priorityIds, setPriorityIds] = useState<string[]>(['gap_auto_01', 'gap_solar_02']);

  useEffect(() => {
    async function loadGaps() {
      const list = await ngoService.getSkillGaps();
      setSkillGaps(list);
    }
    loadGaps();
  }, []);

  const togglePriority = (id: string) => {
    setPriorityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <TrendingUp size={16} />
          <span>SKILL GAP INTELLIGENCE</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Community Skill Gap Intelligence & Priorities
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Transparent differentiation between verified official standards (NCO-2015 / NSQF) and AI-derived community observations to designate Priority Training Areas.
        </p>
      </div>

      {/* Distinction Guide Notice (Requirement 11) */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', fontSize: '0.72rem', fontWeight: 600 }}>
            VERIFIED STANDARD
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>
            Mapped to official qualification packs (NCVET / Sector Skill Councils)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(139, 174, 219, 0.2)', border: '1px solid rgba(139, 174, 219, 0.4)', color: '#8BAEDB', fontSize: '0.72rem', fontWeight: 600 }}>
            AI OBSERVATION
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>
            Derived from local field interviews and employer hiring specifications
          </span>
        </div>
      </div>

      {/* Skill Gaps Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {skillGaps.map((gap) => {
          const isPriority = priorityIds.includes(gap.id);
          const isVerified = gap.type === 'VERIFIED_STANDARD';

          return (
            <div
              key={gap.id}
              style={{
                background: 'rgba(11, 36, 82, 0.9)',
                border: isPriority ? '1.5px solid #1E5DB7' : '1px solid rgba(23, 74, 145, 0.5)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isPriority ? '0 8px 24px rgba(23, 74, 145, 0.35)' : 'none',
              }}
            >
              <div>
                {/* Sector & Benchmark Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
                    {gap.sector}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(23, 74, 145, 0.4)',
                      color: isVerified ? '#34D399' : '#8BAEDB',
                      border: isVerified ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(139, 174, 219, 0.3)',
                    }}
                  >
                    {isVerified ? 'VERIFIED BENCHMARK' : 'AI COMMUNITY OBSERVATION'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: '2px 0 6px 0' }}>
                  {gap.occupation}
                </h3>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  Benchmark Ref: {gap.verifiedBenchmark}
                </div>

                {/* Gaps List */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '6px' }}>
                    Common Observed Skill Gaps:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {gap.commonGaps.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '0.8rem',
                          color: '#FFFFFF',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: 'rgba(7, 26, 58, 0.65)',
                          border: '1px solid rgba(23, 74, 145, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: '#E07363', fontWeight: 700 }}>•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Demand Metric */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '16px', padding: '8px 12px', background: 'rgba(23, 74, 145, 0.25)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--color-steel-light)' }}>Interested Beneficiaries:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{gap.interestedBeneficiariesCount} Candidates</span>
                </div>
              </div>

              {/* Priority Toggle Button (Requirement 11) */}
              <button
                type="button"
                onClick={() => togglePriority(gap.id)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: isPriority
                    ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)'
                    : 'rgba(23, 74, 145, 0.35)',
                  border: isPriority ? '1px solid rgba(139, 174, 219, 0.5)' : '1px solid rgba(139, 174, 219, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                {isPriority ? <CheckCircle2 size={16} color="#8BAEDB" /> : <Tag size={15} />}
                <span>{isPriority ? 'Marked as Priority Training Area' : 'Designate as Priority Training'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
