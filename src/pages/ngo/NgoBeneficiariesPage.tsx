import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import { BeneficiaryProfile } from '../../types/ngo';
import {
  UserCheck,
  Search,
  UserPlus,
  Eye,
  X,
} from 'lucide-react';

export const NgoBeneficiariesPage: React.FC = () => {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryProfile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedProfile, setSelectedProfile] = useState<BeneficiaryProfile | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBeneficiaries();
  }, [selectedDistrict]);

  const loadBeneficiaries = async () => {
    setIsLoading(true);
    const list = await ngoService.getBeneficiaries({
      district: selectedDistrict !== 'ALL' ? selectedDistrict : undefined,
      search: search || undefined,
    });
    setBeneficiaries(list);
    setIsLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBeneficiaries();
  };

  const handleAddNote = async () => {
    if (!selectedProfile || !newNote.trim()) return;
    const res = await ngoService.addBeneficiaryNote(selectedProfile.id, newNote);
    if (res.success && res.note) {
      const updatedNotes = [res.note, ...(selectedProfile.communityNotes || [])];
      setSelectedProfile({ ...selectedProfile, communityNotes: updatedNotes });
      setBeneficiaries((prev) =>
        prev.map((b) => (b.id === selectedProfile.id ? { ...b, communityNotes: updatedNotes } : b))
      );
      setNewNote('');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <UserCheck size={16} />
            <span>COMMUNITY MEMBER PROFILES</span>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
            Beneficiary Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Search, inspect capabilities, add field notes, and support livelihood placements for verified community members.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/ngo/onboarding')}
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
          <UserPlus size={16} />
          <span>Assisted Onboard</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} color="var(--color-steel-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, occupation, or skill..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                background: '#071A3A',
                border: '1px solid rgba(139, 174, 219, 0.35)',
                color: '#FFFFFF',
                fontSize: '0.825rem',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(23, 74, 145, 0.6)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#071A3A',
              border: '1px solid rgba(139, 174, 219, 0.35)',
              color: '#FFFFFF',
              fontSize: '0.825rem',
            }}
          >
            <option value="ALL">All Authorized Districts</option>
            <option value="Salem">Salem</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table / Cards */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.9)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-royal)',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(23, 74, 145, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
            Authorized Beneficiaries ({beneficiaries.length})
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>
            Strict Regional Data Authorization Active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {isLoading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-steel-light)', fontSize: '0.85rem' }}>
              Loading authorized beneficiaries...
            </div>
          ) : beneficiaries.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-steel-light)', fontSize: '0.85rem' }}>
              No beneficiaries found matching your filter criteria.
            </div>
          ) : (
            beneficiaries.map((b) => (
            <div
              key={b.id}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(23, 74, 145, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(23, 74, 145, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
                    border: '1.5px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {b.fullName.charAt(0)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>{b.fullName}</span>
                    <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', borderRadius: '4px' }}>
                      VERIFIED
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                    {b.currentOccupation || 'Awaiting profile completion'} • {b.yearsExperience} yrs exp
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {b.locality ? `${b.locality}, ` : ''}{b.district}, {b.state}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '380px' }}>
                {b.skills.slice(0, 3).map((s) => (
                  <span
                    key={s.id}
                    style={{
                      padding: '3px 8px',
                      background: 'rgba(23, 74, 145, 0.45)',
                      border: '1px solid rgba(139, 174, 219, 0.3)',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      color: '#FFFFFF',
                    }}
                  >
                    {s.name}
                  </span>
                ))}
                {b.skills.length > 3 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-steel-light)', alignSelf: 'center' }}>
                    +{b.skills.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(b)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(23, 74, 145, 0.5)',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Eye size={14} />
                  <span>Inspect Profile</span>
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Profile Detail Drawer Modal */}
      {selectedProfile && (
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
            justifyContent: 'flex-end',
            animation: 'classic-fade-in 0.2s ease-out',
          }}
          onClick={() => setSelectedProfile(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '100%',
              background: '#0B2452',
              borderLeft: '1px solid rgba(23, 74, 145, 0.7)',
              padding: '28px 24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  {selectedProfile.fullName}
                </h2>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                  {selectedProfile.currentOccupation} • {selectedProfile.locality}, {selectedProfile.district}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(139, 174, 219, 0.2)',
                  color: '#FFFFFF',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Skills Inventory */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                Skills & Practical Evidence
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedProfile.skills.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(7, 26, 58, 0.7)',
                      border: '1px solid rgba(23, 74, 145, 0.4)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.825rem', color: '#FFFFFF', fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{s.category}</div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background:
                          s.evidenceStatus === 'CONFIRMED'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : s.evidenceStatus === 'SUPPORTED'
                            ? 'rgba(23, 74, 145, 0.5)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color:
                          s.evidenceStatus === 'CONFIRMED'
                            ? '#34D399'
                            : s.evidenceStatus === 'SUPPORTED'
                            ? '#8BAEDB'
                            : '#FBBF24',
                        fontWeight: 600,
                      }}
                    >
                      {s.evidenceStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience & Education */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                Practical Experience & Background
              </div>
              {selectedProfile.experiences.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.6)',
                    border: '1px solid rgba(23, 74, 145, 0.35)',
                    marginBottom: '8px',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{exp.roleTitle}</div>
                  <div style={{ color: 'var(--color-steel-light)', fontSize: '0.72rem' }}>
                    {exp.organization} • {exp.years} years
                  </div>
                  {exp.responsibilities && (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                      {exp.responsibilities}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Field Notes Section (Requirement 7) */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                Community Worker Field Notes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {selectedProfile.communityNotes && selectedProfile.communityNotes.length > 0 ? (
                  selectedProfile.communityNotes.map((cn) => (
                    <div
                      key={cn.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: 'rgba(23, 74, 145, 0.3)',
                        border: '1px solid rgba(139, 174, 219, 0.3)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div style={{ color: '#FFFFFF' }}>{cn.text}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-steel-light)', marginTop: '4px' }}>
                        By {cn.author} • {new Date(cn.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>No field notes recorded yet.</div>
                )}
              </div>

              {/* Add Note Input */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add authorized community note..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                    border: '1px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Post Note
                </button>
              </div>
            </div>

            {/* Quick Action: Match Opportunity */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(23, 74, 145, 0.4)' }}>
              <button
                type="button"
                onClick={() => navigate('/ngo/matching')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid rgba(139, 174, 219, 0.5)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Run AI Opportunity Matching for this Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
