import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import {
  Users,
  Filter,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const NgoCommunityPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedOccupation, setSelectedOccupation] = useState<string>('ALL');
  const [selectedEducation, setSelectedEducation] = useState<string>('ALL');
  const [selectedTrainingStatus, setSelectedTrainingStatus] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      const res = await ngoService.getCommunityOverview();
      setData(res);
    }
    loadData();
  }, []);

  const stats = data?.stats || {
    totalPeopleOnboarded: 4,
    newRegistrationsThisMonth: 14,
    peopleSeekingEmployment: 4,
    peopleSeekingTraining: 2,
    peopleAlreadySkilled: 2,
    peopleNeedingAssessment: 1,
    peopleCurrentlyLearning: 1,
    peopleMatchedWithOpportunities: 1,
    peopleEmployed: 1,
  };

  const statItems = [
    { title: 'Total Onboarded', value: stats.totalPeopleOnboarded, sub: 'Field verified' },
    { title: 'New Registrations', value: stats.newRegistrationsThisMonth, sub: 'Last 30 days' },
    { title: 'Seeking Employment', value: stats.peopleSeekingEmployment, sub: 'Ready for placement' },
    { title: 'Seeking Training', value: stats.peopleSeekingTraining, sub: 'Upskilling queue' },
    { title: 'Already Skilled', value: stats.peopleAlreadySkilled, sub: 'Confirmed competency' },
    { title: 'Needing Assessment', value: stats.peopleNeedingAssessment, sub: 'Pending verification' },
    { title: 'Currently Learning', value: stats.peopleCurrentlyLearning, sub: 'In training batches' },
    { title: 'Matched with Jobs', value: stats.peopleMatchedWithOpportunities, sub: 'Requisitions linked' },
    { title: 'Confirmed Employed', value: stats.peopleEmployed, sub: 'Sustainable placement' },
  ];

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Users size={16} />
          <span>COMMUNITY-LEVEL INTELLIGENCE</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Community Overview & Demographics
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Granular intelligence on community capabilities, livelihood readiness, education distributions, and learning status.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Filter size={15} />
          <span>Filters:</span>
        </div>

        {/* District Filter */}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: '#071A3A',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
          }}
        >
          <option value="ALL">All Districts</option>
          <option value="Salem">Salem</option>
          <option value="Coimbatore">Coimbatore</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: '#071A3A',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
          }}
        >
          <option value="ALL">All Skill Categories</option>
          <option value="Technical">Technical Skills</option>
          <option value="Practical">Practical & Tools</option>
          <option value="Digital">Digital & Office</option>
          <option value="Craft">Traditional & Craft</option>
        </select>

        {/* Occupation Filter */}
        <select
          value={selectedOccupation}
          onChange={(e) => setSelectedOccupation(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: '#071A3A',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
          }}
        >
          <option value="ALL">All Occupations</option>
          <option value="Automotive">Automotive</option>
          <option value="Solar">Solar PV</option>
          <option value="Textiles">Apparel & Textiles</option>
          <option value="Accounts">GST & Accounts</option>
        </select>

        {/* Education Filter */}
        <select
          value={selectedEducation}
          onChange={(e) => setSelectedEducation(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: '#071A3A',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
          }}
        >
          <option value="ALL">All Education Levels</option>
          <option value="ITI">ITI / Polytechnic</option>
          <option value="Graduate">Graduate</option>
          <option value="School">Secondary School</option>
        </select>

        {/* Training Status Filter */}
        <select
          value={selectedTrainingStatus}
          onChange={(e) => setSelectedTrainingStatus(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: '#071A3A',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
          }}
        >
          <option value="ALL">All Training Statuses</option>
          <option value="SEEKING_TRAINING">Seeking Training</option>
          <option value="CURRENTLY_LEARNING">Currently Learning</option>
          <option value="ALREADY_SKILLED">Already Skilled</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSelectedDistrict('ALL');
            setSelectedCategory('ALL');
            setSelectedOccupation('ALL');
            setSelectedEducation('ALL');
            setSelectedTrainingStatus('ALL');
          }}
          style={{
            marginLeft: 'auto',
            padding: '5px 12px',
            background: 'rgba(23, 74, 145, 0.4)',
            border: '1px solid rgba(139, 174, 219, 0.3)',
            borderRadius: '6px',
            color: 'var(--color-steel-light)',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Grid of Key Numbers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        {statItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(11, 36, 82, 0.8)',
              border: '1px solid rgba(23, 74, 145, 0.45)',
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#FFFFFF' }}>{item.value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Structured Demographic Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {/* Occupation Breakdown */}
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Briefcase size={16} color="var(--color-steel-light)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Occupational Distribution
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data?.breakdownByOccupation?.map((occ: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{occ.occupation}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{occ.count} ({occ.percentage}%)</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(7, 26, 58, 0.8)', overflow: 'hidden' }}>
                  <div style={{ width: `${occ.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #174A91, #1E5DB7)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Breakdown */}
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <GraduationCap size={16} color="var(--color-steel-light)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Formal Education Levels
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data?.breakdownByEducation?.map((edu: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{edu.level}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{edu.count} ({edu.percentage}%)</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(7, 26, 58, 0.8)', overflow: 'hidden' }}>
                  <div style={{ width: `${edu.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #1E5DB7, #8BAEDB)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
