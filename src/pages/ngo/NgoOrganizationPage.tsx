import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { NGOProfile, NGOTeamMember } from '../../types/ngo';
import {
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export const NgoOrganizationPage: React.FC = () => {
  const [org, setOrg] = useState<NGOProfile | null>(null);
  const [members, setMembers] = useState<NGOTeamMember[]>([]);
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TEAM' | 'SERVICE_AREAS'>('PROFILE');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'COMMUNITY_WORKER' as any,
  });
  const [saveNotice, setSaveNotice] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await ngoService.getOrganization();
      setOrg(data.organization);
      setMembers(data.members);
      setServiceAreas(data.serviceAreas);
    }
    loadData();
  }, []);

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdMember: NGOTeamMember = {
      id: `mem_${Date.now()}`,
      ngoId: org?.id || 'ngo_gramaseva_01',
      userId: `usr_${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role,
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setMembers((prev) => [...prev, createdMember]);
    setShowAddMember(false);
    setNewMember({ name: '', email: '', phone: '', role: 'COMMUNITY_WORKER' });
    setSaveNotice('Team member added with appropriate RBAC credentials.');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'NGO_ADMIN':
        return { label: 'NGO Admin', color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.2)' };
      case 'PROGRAM_MANAGER':
        return { label: 'Program Manager', color: '#60A5FA', bg: 'rgba(59, 130, 246, 0.2)' };
      case 'TRAINING_COORDINATOR':
        return { label: 'Training Coordinator', color: '#34D399', bg: 'rgba(16, 185, 129, 0.2)' };
      case 'EMPLOYMENT_COORDINATOR':
        return { label: 'Employment Coordinator', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.2)' };
      case 'COMMUNITY_WORKER':
        return { label: 'Community Worker', color: '#8BAEDB', bg: 'rgba(23, 74, 145, 0.5)' };
      default:
        return { label: 'Viewer', color: 'var(--color-steel-light)', bg: 'rgba(23, 74, 145, 0.3)' };
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Building2 size={16} />
          <span>INSTITUTIONAL CREDENTIALS & RBAC</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Organization Profile & Governance
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Manage your organization profile, legal registration credentials, service jurisdiction boundaries, and role-based staff access controls.
        </p>
      </div>

      {saveNotice && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          {saveNotice}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'PROFILE', label: 'Organization Profile' },
          { id: 'TEAM', label: `Staff & Team Roles (${members.length})` },
          { id: 'SERVICE_AREAS', label: `Operating Jurisdictions (${serviceAreas.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)' : 'rgba(11, 36, 82, 0.7)',
              border: activeTab === tab.id ? '1px solid #8BAEDB' : '1px solid rgba(23, 74, 145, 0.45)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'PROFILE' && org && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.88)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    {org.name}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ShieldCheck size={12} /> {org.verificationStatus}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-steel-light)', marginTop: '4px' }}>
                  Registration No: <strong>{org.registrationNumber}</strong> • Type: <strong>{org.orgType}</strong>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {org.about}
            </p>

            {/* Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>HEADQUARTERS ADDRESS</div>
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', marginTop: '2px' }}>{org.address}, {org.district}, {org.state}</div>
              </div>

              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>PRIMARY CONTACT</div>
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', marginTop: '2px' }}>{org.contactPerson} ({org.contactPhone})</div>
              </div>

              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>OFFICIAL EMAIL & WEB</div>
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', marginTop: '2px' }}>{org.contactEmail} • {org.website}</div>
              </div>

              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>YEARS OF OPERATION</div>
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', marginTop: '2px' }}>{org.yearsOfOperation} Years Active</div>
              </div>
            </div>

            {/* Focus Areas & Languages */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(23, 74, 145, 0.35)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', marginBottom: '6px' }}>FOCUS DOMAINS:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {org.focusAreas.map((fa, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(23, 74, 145, 0.4)', color: '#FFFFFF' }}>
                      {fa}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', marginBottom: '6px' }}>LANGUAGES SUPPORTED:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {org.languagesSupported.map((lang, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.5)', color: '#8BAEDB' }}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEAM */}
      {activeTab === 'TEAM' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Staff Access & Role-Based Authorization
            </h3>
            <button
              type="button"
              onClick={() => setShowAddMember(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                border: '1px solid #8BAEDB',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {members.map((mem) => {
              const badge = getRoleBadge(mem.role);

              return (
                <div
                  key={mem.id}
                  style={{
                    background: 'rgba(11, 36, 82, 0.88)',
                    border: '1px solid rgba(23, 74, 145, 0.5)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                        {mem.name}
                      </h4>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>{mem.email}</div>
                      <div>{mem.phone}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'var(--color-steel-light)', borderTop: '1px solid rgba(23, 74, 145, 0.35)', paddingTop: '8px' }}>
                    Joined: {mem.joinedAt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICE AREAS */}
      {activeTab === 'SERVICE_AREAS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            Authorized Operational Boundaries
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {serviceAreas.map((sa) => (
              <div
                key={sa.id}
                style={{
                  background: 'rgba(11, 36, 82, 0.88)',
                  border: '1px solid rgba(23, 74, 145, 0.5)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={18} color="#8BAEDB" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    {sa.district}, {sa.state}
                  </h4>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '8px' }}>
                  OPERATING BLOCKS & CLUSTERS:
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {sa.blocks.map((b: string, bIdx: number) => (
                    <span
                      key={bIdx}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(7, 26, 58, 0.8)',
                        border: '1px solid rgba(23, 74, 145, 0.45)',
                        color: '#FFFFFF',
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddMember && (
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
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: '0 0 4px 0' }}>
              Add Team Member
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', margin: '0 0 16px 0' }}>
              Assign role-based access to your organization staff.
            </p>

            <form onSubmit={handleAddMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="+919443218765"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  RBAC Role *
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                >
                  <option value="COMMUNITY_WORKER">Community Worker</option>
                  <option value="PROGRAM_MANAGER">Program Manager</option>
                  <option value="TRAINING_COORDINATOR">Training Coordinator</option>
                  <option value="EMPLOYMENT_COORDINATOR">Employment Coordinator</option>
                  <option value="NGO_ADMIN">NGO Admin</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(23, 74, 145, 0.5)', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)', border: '1px solid #8BAEDB', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
