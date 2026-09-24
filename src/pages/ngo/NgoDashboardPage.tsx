import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import {
  Users,
  UserCheck,
  GraduationCap,
  Briefcase,
  GitCompare,
  TrendingUp,
  Award,
  ArrowRight,
  UserPlus,
  BarChart3,
  Activity,
  Cpu,
  FileCheck,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const NgoDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await ngoService.getOverview();
      setData(res);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const metrics = data?.metrics || {
    communityMembers: 188,
    activeProfiles: 4,
    skillGapsIdentified: 18,
    learningJourneys: 123,
    trainingPrograms: 4,
    jobOpportunities: 4,
    applicationsSupported: 1,
    employmentOutcomes: 1,
  };

  // 8 top-level operational overview cards (Requirement 9)
  const overviewCards = [
    { title: 'Community Members', value: metrics.communityMembers, label: 'Grassroots reach in blocks', icon: Users, route: '/ngo/community' },
    { title: 'Active Beneficiaries', value: metrics.activeProfiles, label: 'Verified capability profiles', icon: UserCheck, route: '/ngo/beneficiaries' },
    { title: 'People in Training', value: metrics.learningJourneys, label: 'Active community trainees', icon: GraduationCap, route: '/ngo/training' },
    { title: 'Skill Gaps', value: metrics.skillGapsIdentified, label: 'Priority training areas', icon: TrendingUp, route: '/ngo/skill-gaps' },
    { title: 'Training Programs', value: metrics.trainingPrograms, label: 'Organization-managed batches', icon: Award, route: '/ngo/training-programs' },
    { title: 'Active Opportunities', value: metrics.jobOpportunities, label: 'Verified employer openings', icon: Briefcase, route: '/ngo/opportunities' },
    { title: 'Applications Supported', value: metrics.applicationsSupported, label: 'In pipeline with assistance', icon: GitCompare, route: '/ngo/applications' },
    { title: 'Employment Outcomes', value: metrics.employmentOutcomes, label: 'Confirmed placements', icon: BarChart3, route: '/ngo/outcomes' },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-steel-light)', fontSize: '0.9rem' }}>
        <Activity size={24} style={{ margin: '0 auto 12px auto' }} />
        <div>Loading Community Operations Center...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Top Banner with Header, Subtitle & DEMO DATA Notice (Requirements 8 & 9) */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.92)',
          border: '1px solid rgba(23, 74, 145, 0.7)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-royal)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Activity size={16} />
            <span>NGO’s Team</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#FFFFFF', margin: '6px 0 8px 0', letterSpacing: '-0.015em' }}>
            Community Operations Center
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '750px', lineHeight: 1.5 }}>
            Understand your community. Discover capability. Build skills. Connect opportunity.
          </p>
        </div>

        <div
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            fontSize: '0.75rem',
            color: '#FDE047',
            fontWeight: 600,
            maxWidth: '320px',
            lineHeight: 1.4,
          }}
        >
          DEMO DATA — Operating in regional demonstration mode (Tamil Nadu: Salem & Coimbatore). Never present simulated numbers as official government statistics.
        </div>
      </div>

      {/* Top-Level Operational Overview Cards (Requirement 9) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        {overviewCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              style={{
                background: 'rgba(11, 36, 82, 0.85)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                borderRadius: '14px',
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 174, 219, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(23, 74, 145, 0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-steel-light)', fontWeight: 500 }}>
                  {card.title}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(23, 74, 145, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-steel-light)',
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Field Operations Quick Launch */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
          Core Field Operations
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <button
            type="button"
            onClick={() => navigate('/ngo/onboarding')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(23, 74, 145, 0.6) 0%, rgba(30, 93, 183, 0.6) 100%)',
              border: '1px solid rgba(139, 174, 219, 0.45)',
              color: '#FFFFFF',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <UserPlus size={22} color="#8BAEDB" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Start Assisted Onboarding</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>Voice & manual profile creation with consent</div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--color-steel-light)" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/ngo/matching')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(23, 74, 145, 0.45) 0%, rgba(18, 54, 111, 0.65) 100%)',
              border: '1px solid rgba(139, 174, 219, 0.35)',
              color: '#FFFFFF',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <GitCompare size={22} color="#8BAEDB" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Run Explainable AI Matching</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>Connect verified skills to employer jobs</div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--color-steel-light)" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/ngo/training')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(23, 74, 145, 0.45) 0%, rgba(18, 54, 111, 0.65) 100%)',
              border: '1px solid rgba(139, 174, 219, 0.35)',
              color: '#FFFFFF',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <GraduationCap size={22} color="#8BAEDB" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Manage Training Programs</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>Plan capacity vs community demand</div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--color-steel-light)" />
          </button>
        </div>
      </div>

      {/* 8 DASHBOARD SECTIONS (Requirement 8) */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '18px' }}>
          Operations & Intelligence Hubs
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Section 1: Community */}
          <div
            onClick={() => navigate('/ngo/community')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Community</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Demographic distribution across Salem & Coimbatore. Track registrations, employment-seekers, and training-readiness.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              {metrics.communityMembers} Registered Members • 2 Operating Hubs
            </div>
          </div>

          {/* Section 2: Beneficiaries */}
          <div
            onClick={() => navigate('/ngo/beneficiaries')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserCheck size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Beneficiaries</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Verified profile registry. Review work experience, practical capabilities, and record field worker observational notes.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              {metrics.activeProfiles} Verified Active Profiles
            </div>
          </div>

          {/* Section 3: Skills */}
          <div
            onClick={() => navigate('/ngo/skills')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Skills</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              9-category community inventory: Technical, Digital, Practical, Traditional Craft, and Tools competency across blocks.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              9 Categories • NCO-2015 Benchmark Mappings
            </div>
          </div>

          {/* Section 4: Skill Gaps */}
          <div
            onClick={() => navigate('/ngo/skill-gaps')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Skill Gaps</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Distinguish AI-derived observations from verified benchmarks. Flag priority training cohorts for immediate intervention.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#FDE047', fontWeight: 600 }}>
              {metrics.skillGapsIdentified} Identified Gaps • Diagnostics & Safety Focus
            </div>
          </div>

          {/* Section 5: Training */}
          <div
            onClick={() => navigate('/ngo/training')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Training</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Community demand vs training capacity. Track attendance, module progress, and NSQF Level 4 aligned curriculums.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              {metrics.trainingPrograms} Active Programs • 127 Candidate Backlog
            </div>
          </div>

          {/* Section 6: Opportunities */}
          <div
            onClick={() => navigate('/ngo/opportunities')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Opportunities</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Verified employer positions and local community openings with transparent salary expectations and mandatory skills.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              {metrics.jobOpportunities} Live Verified Openings • Nexus Mobility & Surya
            </div>
          </div>

          {/* Section 7: Applications */}
          <div
            onClick={() => navigate('/ngo/applications')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileCheck size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Applications</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Assisted application pipeline. Support beneficiaries through document preparation, interviews, and status updates.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              {metrics.applicationsSupported} Candidate in Active Pipeline (Shortlisted)
            </div>
          </div>

          {/* Section 8: Employment Outcomes */}
          <div
            onClick={() => navigate('/ngo/outcomes')}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={20} color="#8BAEDB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Employment Outcomes</h3>
              </div>
              <ChevronRight size={16} color="var(--color-steel-light)" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Sustained employment impact registry. Monitor 30-day and 90-day retention checkpoints, fair wages, and job continuity.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              {metrics.employmentOutcomes} Placed Candidate • 100% 90-Day Retention
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Activities & Demand Alert */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {/* Recent Community Activity */}
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>Recent Field Actions</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>Audit Trail Logged</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.recentActivities?.map((act: any) => (
              <div
                key={act.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.6)',
                  border: '1px solid rgba(23, 74, 145, 0.35)',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ color: '#FFFFFF', marginBottom: '2px' }}>{act.text}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-steel-light)' }}>
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Training Demand Notice Card */}
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={18} color="#FDE047" />
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
                High Demand Opportunity: Commercial Diagnostics
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              <strong>127 interested beneficiaries</strong> registered in Salem district for Commercial OBD-II Vehicle Diagnostics vs <strong>40 available training seats</strong>. Nexus Mobility has 5 open positions awaiting certified completers.
            </p>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(23, 74, 145, 0.4)',
                border: '1px solid rgba(139, 174, 219, 0.3)',
                fontSize: '0.75rem',
                color: 'var(--color-steel-light)',
              }}
            >
              Recommended Action: Schedule a secondary weekend cohort to bridge candidate backlog.
            </div>
          </div>

          <div style={{ marginTop: '18px' }}>
            <button
              type="button"
              onClick={() => navigate('/ngo/training')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                border: '1px solid rgba(139, 174, 219, 0.4)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Review Demand Intelligence & Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboardPage;
