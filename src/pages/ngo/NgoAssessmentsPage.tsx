import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { AssessmentRecord } from '../../types/ngo';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const NgoAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      const list = await ngoService.getAssessments();
      setAssessments(list);
    }
    loadData();
  }, []);

  const filtered = assessments.filter(
    (a) => filterStatus === 'ALL' || a.status === filterStatus
  );

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Award size={16} />
          <span>ROLE-SPECIFIC COMPETENCY EVALUATION</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Assessments & Skill Verification
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Role-specific vocational assessments mapping practical tool usage and diagnosis. We evaluate domain skills, never generic IQ tests.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'ALL', label: 'All Evaluations' },
          { id: 'COMPLETED', label: 'Completed' },
          { id: 'RECOMMENDED', label: 'Recommended Next' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterStatus(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: filterStatus === tab.id ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)' : 'rgba(11, 36, 82, 0.7)',
              border: filterStatus === tab.id ? '1px solid #8BAEDB' : '1px solid rgba(23, 74, 145, 0.45)',
              color: filterStatus === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: filterStatus === tab.id ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assessments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((ass) => {
          const isCompleted = ass.status === 'COMPLETED';

          return (
            <div
              key={ass.id}
              style={{
                background: 'rgba(11, 36, 82, 0.88)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                      {ass.beneficiaryName}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(23, 74, 145, 0.5)',
                        color: isCompleted ? '#34D399' : '#8BAEDB',
                      }}
                    >
                      {ass.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                    {ass.occupation} • Evaluation: {ass.assessmentType}
                  </div>
                </div>

                {ass.score && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF' }}>{ass.score}%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-steel-light)' }}>Practical Score</div>
                  </div>
                )}
              </div>

              {/* Two Column: Strong Areas vs Needs Development (Requirement 12) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {/* Strong Areas */}
                <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.65)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34D399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} />
                    <span>Strong Areas</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                    {ass.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Needs Development */}
                <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.65)', border: '1px solid rgba(224, 115, 99, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E07363', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={13} />
                    <span>Needs Development</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                    {ass.needsDevelopment.map((nd, idx) => (
                      <li key={idx}>{nd}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Next Step */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(23, 74, 145, 0.3)',
                  border: '1px solid rgba(139, 174, 219, 0.35)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: 'var(--color-steel-light)', fontWeight: 600 }}>Recommended Next Action:</span>
                <span style={{ color: '#FFFFFF' }}>{ass.recommendedNextStep}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
