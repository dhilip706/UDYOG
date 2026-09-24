import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { CommunityProgram } from '../../types/ngo';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export const NgoProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<CommunityProgram[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    programType: 'SKILL_CAMP',
    location: '',
    district: 'Salem',
    startDate: '',
    endDate: '',
    capacity: 60,
    eligibility: '',
    skillsCovered: '',
    description: '',
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await ngoService.getCommunityPrograms();
      setPrograms(data);
    }
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.skillsCovered
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      state: 'Tamil Nadu',
      skillsCovered: skillsArray,
    };

    const res = await ngoService.createCommunityProgram(payload);
    if (res.success) {
      setCreateSuccess(true);
      const updated = await ngoService.getCommunityPrograms();
      setPrograms(updated);
      setTimeout(() => {
        setCreateSuccess(false);
        setShowCreateModal(false);
        setFormData({
          title: '',
          programType: 'SKILL_CAMP',
          location: '',
          district: 'Salem',
          startDate: '',
          endDate: '',
          capacity: 60,
          eligibility: '',
          skillsCovered: '',
          description: '',
        });
      }, 1500);
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Calendar size={16} />
            <span>COMMUNITY INITIATIVES & CAMPS</span>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
            Community Programs & Skill Camps
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Mobilize local communities through localized skill camps, career guidance seminars, awareness drives, and employer meetups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
            border: '1px solid #8BAEDB',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>Launch New Program / Camp</span>
        </button>
      </div>

      {/* Program Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {programs.map((prog) => (
          <div
            key={prog.id}
            style={{
              background: 'rgba(11, 36, 82, 0.88)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(23, 74, 145, 0.6)',
                      color: '#8BAEDB',
                    }}
                  >
                    {prog.programType.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)' }}>
                    {prog.district}, {prog.state}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  {prog.title}
                </h3>
              </div>

              {/* Attendance Ratio Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(7, 26, 58, 0.8)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(23, 74, 145, 0.45)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {prog.attended} / {prog.registered}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-steel-light)' }}>
                    Attended / Registered (Cap: {prog.capacity})
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {prog.description}
            </p>

            {/* Logistics Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                background: 'rgba(7, 26, 58, 0.6)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#8BAEDB" />
                <span>{prog.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#8BAEDB" />
                <span>
                  {prog.startDate} {prog.endDate !== prog.startDate ? `to ${prog.endDate}` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="#8BAEDB" />
                <span><strong>Eligibility:</strong> {prog.eligibility}</span>
              </div>
            </div>

            {/* Skills Covered & Outcome */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '10px', borderTop: '1px solid rgba(23, 74, 145, 0.35)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>Skills Covered:</span>
                {prog.skillsCovered.map((s, sIdx) => (
                  <span
                    key={sIdx}
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(23, 74, 145, 0.35)',
                      color: '#8BAEDB',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {prog.outcome && (
                <div style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> {prog.outcome}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Program Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 10, 24, 0.78)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.98)',
              border: '1px solid rgba(139, 174, 219, 0.45)',
              borderRadius: '16px',
              padding: '26px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Launch New Community Initiative
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', margin: '0 0 20px 0' }}>
              Schedule a community camp, awareness drive, or skill orientation session in your operating region.
            </p>

            {createSuccess ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#34D399', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                Community initiative successfully scheduled!
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Program Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Omalur Agricultural Solar Pump Orientation"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      Program Type
                    </label>
                    <select
                      value={formData.programType}
                      onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                    >
                      <option value="SKILL_CAMP">Skill Camp</option>
                      <option value="AWARENESS">Awareness Drive</option>
                      <option value="CAREER_GUIDANCE">Career Guidance</option>
                      <option value="DIGITAL_LITERACY">Digital Literacy</option>
                      <option value="EMPLOYER_MEET">Employer Meet</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      District
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                    >
                      <option value="Salem">Salem</option>
                      <option value="Coimbatore">Coimbatore</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      Capacity (Seats)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 50 })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Specific Location / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Panchayat Bhavan, Omalur"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Skills Covered (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skillsCovered}
                    onChange={(e) => setFormData({ ...formData, skillsCovered: e.target.value })}
                    placeholder="e.g. Solar Pump Installation, Multimeter Testing"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Description & Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide overview of the program, practical workshops planned, and anticipated community outcomes..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(23, 74, 145, 0.5)', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)', border: '1px solid #8BAEDB', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Schedule Initiative
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
