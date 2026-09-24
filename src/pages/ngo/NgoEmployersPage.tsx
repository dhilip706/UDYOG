import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { EmployerNetworkItem } from '../../types/ngo';
import {
  Building2,
  Phone,
  Mail,
  Briefcase,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Handshake,
} from 'lucide-react';

export const NgoEmployersPage: React.FC = () => {
  const [employers, setEmployers] = useState<EmployerNetworkItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerNetworkItem | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await ngoService.getEmployers();
      setEmployers(data);
    }
    loadData();
  }, []);

  const filtered = employers.filter(
    (emp) =>
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.industry.toLowerCase().includes(search.toLowerCase()) ||
      emp.district.toLowerCase().includes(search.toLowerCase()) ||
      emp.activeDemandSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Handshake size={16} />
          <span>REGIONAL HIRING & PARTNERSHIP NETWORK</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Employer Network & Demand Channels
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Direct collaboration with verified regional enterprises. Bridge community skill supply directly to employer demand pipelines through structured training and placement MoUs.
        </p>
      </div>

      {/* Demand Pipeline Continuum Banner */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.9)',
          border: '1px solid rgba(23, 74, 145, 0.55)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(23, 74, 145, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>1</span>
            <span style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 600 }}>Employer Demand</span>
          </div>
          <ArrowRight size={14} color="var(--color-steel-light)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(23, 74, 145, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>2</span>
            <span style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 600 }}>Required Skills</span>
          </div>
          <ArrowRight size={14} color="var(--color-steel-light)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(23, 74, 145, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>3</span>
            <span style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 600 }}>Community Supply</span>
          </div>
          <ArrowRight size={14} color="var(--color-steel-light)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
            <span style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 600 }}>Direct Placement</span>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)' }}>
          Verified MoUs: <strong>2 Regional Employers</strong>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '420px' }}>
        <Search size={16} color="var(--color-steel-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter employers by name, industry, skill..."
          style={{
            width: '100%',
            padding: '9px 12px 9px 36px',
            borderRadius: '8px',
            background: 'rgba(11, 36, 82, 0.88)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            color: '#FFFFFF',
            fontSize: '0.82rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Employer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filtered.map((emp) => (
          <div
            key={emp.id}
            style={{
              background: 'rgba(11, 36, 82, 0.88)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={18} color="#8BAEDB" />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34D399',
                    }}
                  >
                    {emp.partnershipStatus}
                  </span>
                </div>
                {emp.isVerified && (
                  <span style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> Verified Partner
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                {emp.name}
              </h3>

              <div style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', marginBottom: '12px' }}>
                {emp.industry} • {emp.district}, {emp.state}
              </div>

              {/* Open Roles Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(23, 74, 145, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                <Briefcase size={13} color="#8BAEDB" />
                <span>{emp.openJobsCount} Active Requisitions Listed</span>
              </div>

              {/* Required Demand Skills */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Immediate Hiring Demand:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {emp.activeDemandSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(7, 26, 58, 0.8)',
                        border: '1px solid rgba(23, 74, 145, 0.45)',
                        color: 'var(--color-steel-light)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ borderTop: '1px solid rgba(23, 74, 145, 0.35)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={13} color="var(--color-steel-light)" />
                  <span>{emp.contactPerson}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="var(--color-steel-light)" />
                  <span>{emp.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="var(--color-steel-light)" />
                  <span>{emp.email}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEmployer(emp)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                border: '1px solid #8BAEDB',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>Connect with Partner</span>
              <ExternalLink size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Connect Modal */}
      {selectedEmployer && (
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
              padding: '24px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Direct Employer Channel
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', margin: '0 0 16px 0' }}>
              Authorized NGO Representative Communication for {selectedEmployer.name}
            </p>

            <div style={{ background: 'rgba(7, 26, 58, 0.75)', borderRadius: '10px', padding: '16px', marginBottom: '18px', fontSize: '0.82rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Hiring Coordinator:</strong> {selectedEmployer.contactPerson}</div>
              <div><strong>Phone:</strong> {selectedEmployer.phone}</div>
              <div><strong>Email:</strong> {selectedEmployer.email}</div>
              <div><strong>Active Hiring Needs:</strong> {selectedEmployer.activeDemandSkills.join(', ')}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedEmployer(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid #8BAEDB',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
