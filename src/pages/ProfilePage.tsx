import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MapPin, Briefcase, Award, GraduationCap, Clock, CheckCircle2, Edit3 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { session } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editOccupation, setEditOccupation] = useState('');
  const [editYearsExp, setEditYearsExp] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
            setEditName(data.profile.fullName || '');
            setEditDistrict(data.profile.district || '');
            setEditOccupation(data.profile.currentOccupation || '');
            setEditYearsExp(data.profile.yearsExperience || 0);
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [session]);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          fullName: editName,
          district: editDistrict,
          currentOccupation: editOccupation,
          yearsExperience: Number(editYearsExp),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setIsEditing(false);
      }
    } catch {
      setProfile((prev: any) => ({
        ...prev,
        fullName: editName,
        district: editDistrict,
        currentOccupation: editOccupation,
        yearsExperience: Number(editYearsExp),
      }));
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ color: 'var(--color-steel-light)', padding: '40px', textAlign: 'center' }}>
        Loading verified profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center', padding: '48px 24px' }} className="classic-navy-surface">
        <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '8px' }}>No Profile Created Yet</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Complete your assisted onboarding or skill assessment to build your verified trade identity.
        </p>
        <a
          href="/onboarding"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
            border: '1px solid rgba(139, 174, 219, 0.5)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          Begin Onboarding
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Top Banner Profile Summary */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.9)',
          border: '1px solid rgba(23, 74, 145, 0.6)',
          borderRadius: '16px',
          padding: '24px 28px',
          backdropFilter: 'blur(16px)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #174A91 0%, #0B2452 100%)',
              border: '2px solid rgba(139, 174, 219, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {profile?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                {profile?.fullName || 'Job Seeker'}
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  fontSize: '0.72rem',
                  color: '#6EE7B7',
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={12} />
                Verified Profile
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-steel-light)', marginTop: '4px' }}>
              {profile?.currentOccupation || 'Skilled Livelihood Professional'}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                marginTop: '6px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="var(--color-steel-light)" />
                {profile?.district || 'Salem'}, {profile?.state || 'Tamil Nadu'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} color="var(--color-steel-light)" />
                {profile?.yearsExperience || 0} Years Experience
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'rgba(23, 74, 145, 0.5)',
            border: '1px solid rgba(139, 174, 219, 0.4)',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <Edit3 size={14} />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Edit Drawer */}
      {isEditing && (
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.95)',
            border: '1px solid rgba(23, 74, 145, 0.7)',
            borderRadius: '14px',
            padding: '20px 24px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--color-steel-light)', fontSize: '0.95rem' }}>
            Update Profile Information
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="classic-input"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                District
              </label>
              <input
                type="text"
                value={editDistrict}
                onChange={(e) => setEditDistrict(e.target.value)}
                className="classic-input"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Current Role / Occupation
              </label>
              <input
                type="text"
                value={editOccupation}
                onChange={(e) => setEditOccupation(e.target.value)}
                className="classic-input"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Years Experience
              </label>
              <input
                type="number"
                step="0.5"
                value={editYearsExp}
                onChange={(e) => setEditYearsExp(parseFloat(e.target.value) || 0)}
                className="classic-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveProfile}
            style={{
              alignSelf: 'flex-start',
              padding: '8px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginTop: '6px',
            }}
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Grid of Profile Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Education & Qualifications */}
        <section
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <GraduationCap size={18} color="var(--color-steel-light)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Education & Qualifications
            </h2>
          </div>
          {profile?.educations?.map((edu: any, idx: number) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(7, 26, 58, 0.6)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                marginBottom: '10px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>{edu.level}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                {edu.institution || 'Recognized Technical Institute'}
              </div>
              {edu.yearOfPassing && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Year of Completion: {edu.yearOfPassing}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Certifications */}
        <section
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={18} color="var(--color-steel-light)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Certifications & Standards
            </h2>
          </div>
          {profile?.certifications?.map((cert: any, idx: number) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(7, 26, 58, 0.6)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                marginBottom: '10px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>{cert.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                {cert.issuingBody}
              </div>
            </div>
          ))}
        </section>

        {/* Experience & Tools */}
        <section
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
            gridColumn: '1 / -1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Briefcase size={18} color="var(--color-steel-light)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Practical Work History & Tools
            </h2>
          </div>
          {profile?.experiences?.map((exp: any, idx: number) => (
            <div
              key={idx}
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: 'rgba(7, 26, 58, 0.6)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>{exp.roleTitle}</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>{exp.years} Years</span>
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {exp.organization || 'Independent Practice'}
              </div>
              {exp.toolsUsed && exp.toolsUsed.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {exp.toolsUsed.map((tool: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(23, 74, 145, 0.4)',
                        border: '1px solid rgba(139, 174, 219, 0.3)',
                        fontSize: '0.72rem',
                        color: 'var(--color-steel-light)',
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
