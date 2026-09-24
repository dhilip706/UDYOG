import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { NGOTrainingProgram, DemandIntelligenceItem } from '../../types/ngo';
import {
  GraduationCap,
  PlusCircle,
  TrendingUp,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const NgoTrainingPage: React.FC<{ defaultTab?: 'demand' | 'programs' }> = ({ defaultTab = 'demand' }) => {
  const [activeTab, setActiveTab] = useState<'demand' | 'programs'>(defaultTab);
  const [programs, setPrograms] = useState<NGOTrainingProgram[]>([]);
  const [demandIntel, setDemandIntel] = useState<DemandIntelligenceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);
  const [newTitle, setNewTitle] = useState('');
  const [newSector, setNewSector] = useState('Automotive & Clean Mobility');
  const [newDuration, setNewDuration] = useState(60);
  const [newCapacity, setNewCapacity] = useState(30);
  const [newSkills, setNewSkills] = useState('Engine Diagnostics, Sensor Calibration');
  const [isNsqf, setIsNsqf] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await ngoService.getTrainingManagement();
    setPrograms(res.programs);
    setDemandIntel(res.demandIntelligence);
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await ngoService.createTrainingProgram({
      title: newTitle.trim(),
      sector: newSector,
      durationHours: Number(newDuration),
      capacity: Number(newCapacity),
      skillsCovered: newSkills.split(',').map((s) => s.trim()),
      isNSQFAligned: isNsqf,
      nsqfPathwayNote: isNsqf ? 'Verified NSQF Level 4 Standard' : 'Preliminary AI pathway — verification required',
    });

    setIsModalOpen(false);
    setNewTitle('');
    loadData();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <GraduationCap size={16} />
            <span>LEARNING & CAPACITY BUILDING</span>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
            Training Management & Demand Intelligence
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Align community learning pathways with verified NCO/NSQF standards, track attendance, and balance capacity against local demand.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
            border: '1px solid rgba(139, 174, 219, 0.4)',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <PlusCircle size={16} />
          <span>New Training Program</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(23, 74, 145, 0.45)', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('demand')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            background: activeTab === 'demand' ? 'linear-gradient(135deg, rgba(23, 74, 145, 0.8) 0%, rgba(18, 54, 111, 0.9) 100%)' : 'rgba(11, 36, 82, 0.5)',
            border: activeTab === 'demand' ? '1px solid rgba(139, 174, 219, 0.5)' : '1px solid rgba(23, 74, 145, 0.4)',
            color: activeTab === 'demand' ? '#FFFFFF' : 'var(--color-steel-light)',
            fontWeight: activeTab === 'demand' ? 600 : 400,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Demand Intelligence
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('programs')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            background: activeTab === 'programs' ? 'linear-gradient(135deg, rgba(23, 74, 145, 0.8) 0%, rgba(18, 54, 111, 0.9) 100%)' : 'rgba(11, 36, 82, 0.5)',
            border: activeTab === 'programs' ? '1px solid rgba(139, 174, 219, 0.5)' : '1px solid rgba(23, 74, 145, 0.4)',
            color: activeTab === 'programs' ? '#FFFFFF' : 'var(--color-steel-light)',
            fontWeight: activeTab === 'programs' ? 600 : 400,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Training Programs ({programs.length})
        </button>
      </div>

      {activeTab === 'demand' && (
        <React.Fragment>
          {/* TRAINING DEMAND INTELLIGENCE (Requirement 14) */}
          <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <TrendingUp size={18} color="var(--color-steel-light)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            Training Demand Intelligence (Community Demand vs Available Training)
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {demandIntel.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(11, 36, 82, 0.88)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.15)', color: '#FDE047', fontWeight: 700, border: '1px solid rgba(234, 179, 8, 0.35)' }}>
                    HIGH COMMUNITY DEMAND
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>
                    {item.availableProgramsCount} active program
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 12px 0' }}>
                  {item.skillName}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(23, 74, 145, 0.4)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Interested Beneficiaries</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>{item.interestedBeneficiaries}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Total Seat Capacity</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-steel-light)' }}>{item.totalCapacitySeats}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRAINING CONTINUUM STRUCTURE (Requirement 13) */}
      <div
        style={{
          background: 'rgba(7, 26, 58, 0.8)',
          border: '1px solid rgba(23, 74, 145, 0.4)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', flexShrink: 0 }}>
          TRAINING CONTINUUM:
        </span>
        {['Training', 'Learning', 'Practice', 'Assessment', 'Reassessment', 'Completion'].map((st, i) => (
          <React.Fragment key={i}>
            <span style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 500, flexShrink: 0 }}>
              {st}
            </span>
            {i < 5 && <ChevronRight size={14} color="var(--color-steel-light)" style={{ flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>
        </React.Fragment>
      )}

      {/* Active Organization Training Programs List */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
          {activeTab === 'programs' ? 'Organization-Managed Training Programs' : 'Active Training Cohorts'} ({programs.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {programs.map((prog) => (
            <div
              key={prog.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>{prog.sector}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', borderRadius: '4px' }}>
                      {prog.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
                    {prog.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {prog.district}, {prog.state} • Duration: {prog.durationHours} hours
                  </div>
                </div>

                {/* Capacity Gauge */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {prog.enrolledCount} / {prog.capacity} Seats
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-steel-light)' }}>
                    {prog.completedCount} Certified Completers
                  </div>
                </div>
              </div>

              {/* Skills Covered */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {prog.skillsCovered.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '3px 8px',
                      background: 'rgba(23, 74, 145, 0.45)',
                      borderRadius: '4px',
                      border: '1px solid rgba(139, 174, 219, 0.25)',
                      fontSize: '0.72rem',
                      color: '#FFFFFF',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* NSQF Pathway Note (Requirement 13) */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(7, 26, 58, 0.65)',
                  border: '1px solid rgba(23, 74, 145, 0.35)',
                  fontSize: '0.75rem',
                  color: prog.isNSQFAligned ? '#34D399' : 'var(--color-steel-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={14} color={prog.isNSQFAligned ? '#10B981' : '#8BAEDB'} />
                <span>{prog.nsqfPathwayNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Program Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#0B2452',
              border: '1px solid rgba(23, 74, 145, 0.7)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: 'var(--shadow-royal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Create Organization Training Program
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Program Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Commercial Electrician Panel Wiring"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                    Sector
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#071A3A',
                      border: '1px solid rgba(139, 174, 219, 0.35)',
                      color: '#FFFFFF',
                      fontSize: '0.825rem',
                    }}
                  >
                    <option value="Automotive & Clean Mobility">Automotive & Clean Mobility</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="IT & Business Services">IT & Business Services</option>
                    <option value="Textile & Apparel">Textile & Apparel</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#071A3A',
                      border: '1px solid rgba(139, 174, 219, 0.35)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Seat Capacity
                </label>
                <input
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Skills Covered (Comma separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#FFFFFF' }}>
                  <input
                    type="checkbox"
                    checked={isNsqf}
                    onChange={(e) => setIsNsqf(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>NSQF-Aligned Framework Curriculum</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                    border: '1px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
