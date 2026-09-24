import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { SupportCase, BeneficiaryProfile } from '../../types/ngo';
import {
  FolderKanban,
  Plus,
  Clock,
  Search,
} from 'lucide-react';

const STATUSES = ['ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'];

export const NgoCasesPage: React.FC = () => {
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryProfile[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeCase, setActiveCase] = useState<SupportCase | null>(null);
  const [newNote, setNewNote] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    profileId: '',
    category: 'DOCUMENTATION',
    priority: 'MEDIUM',
    subject: '',
    description: '',
    assignedTo: 'Lakshmi Narayanan',
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      const [caseList, benList] = await Promise.all([
        ngoService.getCases(),
        ngoService.getBeneficiaries(),
      ]);
      setCases(caseList);
      setBeneficiaries(benList);
      if (benList.length > 0) {
        setCreateForm((prev) => ({ ...prev, profileId: benList[0].id }));
      }
    }
    loadData();
  }, []);

  const filtered = cases.filter((c) => {
    const matchesStatus =
      selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesSearch =
      !search ||
      c.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (caseId: string, status: string) => {
    await ngoService.updateCase(caseId, { status, note: newNote || `Status updated to ${status}` });
    const updated = await ngoService.getCases();
    setCases(updated);
    if (activeCase && activeCase.id === caseId) {
      const ref = updated.find((c) => c.id === caseId);
      if (ref) setActiveCase(ref);
    }
    setNewNote('');
    setSuccessMsg('Case record updated successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleAddNote = async (caseId: string) => {
    if (!newNote.trim()) return;
    await ngoService.updateCase(caseId, { note: newNote });
    const updated = await ngoService.getCases();
    setCases(updated);
    if (activeCase && activeCase.id === caseId) {
      const ref = updated.find((c) => c.id === caseId);
      if (ref) setActiveCase(ref);
    }
    setNewNote('');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selBen = beneficiaries.find((b) => b.id === createForm.profileId);
    const res = await ngoService.createCase({
      ...createForm,
      beneficiaryName: selBen?.fullName || 'Beneficiary',
    });

    if (res.success) {
      const updated = await ngoService.getCases();
      setCases(updated);
      setShowCreateModal(false);
      setCreateForm({
        profileId: beneficiaries[0]?.id || '',
        category: 'DOCUMENTATION',
        priority: 'MEDIUM',
        subject: '',
        description: '',
        assignedTo: 'Lakshmi Narayanan',
      });
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT':
        return { bg: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: 'rgba(239, 68, 68, 0.4)' };
      case 'HIGH':
        return { bg: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: 'rgba(245, 158, 11, 0.4)' };
      default:
        return { bg: 'rgba(23, 74, 145, 0.4)', color: '#8BAEDB', border: 'rgba(23, 74, 145, 0.6)' };
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <FolderKanban size={16} />
            <span>BENEFICIARY CASE MANAGEMENT</span>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
            Support Cases & Case Tracking
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Track specialized intervention cases including documentation attestation, employer dispute resolution, transportation barriers, and training stipends.
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
          <span>Open New Case</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.88)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flex: '1 1 300px', position: 'relative' }}>
          <Search size={16} color="var(--color-steel-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases by subject, beneficiary name, or category..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.75)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: selectedStatus === st ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)' : 'rgba(7, 26, 58, 0.6)',
                border: selectedStatus === st ? '1px solid #8BAEDB' : '1px solid rgba(23, 74, 145, 0.45)',
                color: selectedStatus === st ? '#FFFFFF' : 'var(--color-steel-light)',
                fontSize: '0.75rem',
                fontWeight: selectedStatus === st ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((item) => {
          const pStyle = getPriorityBadge(item.priority);

          return (
            <div
              key={item.id}
              style={{
                background: 'rgba(11, 36, 82, 0.88)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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
                        background: pStyle.bg,
                        color: pStyle.color,
                        border: `1px solid ${pStyle.border}`,
                      }}
                    >
                      {item.priority}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(23, 74, 145, 0.5)',
                        color: '#8BAEDB',
                      }}
                    >
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>
                      Status: <strong>{item.status}</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                    {item.subject}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: '#8BAEDB' }}>
                    Beneficiary: <strong>{item.beneficiaryName}</strong> • Assigned To: <strong>{item.assignedTo}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCase(item)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: 'rgba(23, 74, 145, 0.45)',
                    border: '1px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Manage Case & Audit Notes
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {item.description}
              </p>

              {item.notes.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', background: 'rgba(7, 26, 58, 0.6)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(23, 74, 145, 0.3)' }}>
                  <strong>Latest Audit Note:</strong> {item.notes[item.notes.length - 1].text} ({new Date(item.notes[item.notes.length - 1].timestamp).toLocaleDateString()})
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Case Management Modal */}
      {activeCase && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0 0 4px 0' }}>
                  {activeCase.subject}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#8BAEDB' }}>
                  Beneficiary: {activeCase.beneficiaryName} • Case ID: {activeCase.id}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-steel-light)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Status Buttons */}
            <div style={{ background: 'rgba(7, 26, 58, 0.75)', borderRadius: '10px', padding: '14px', marginBottom: '18px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '8px', fontWeight: 600 }}>
                Update Case Status
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(activeCase.id, st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: activeCase.status === st ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(23, 74, 145, 0.5)',
                      border: '1px solid rgba(139, 174, 219, 0.4)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Set {st}
                  </button>
                ))}
              </div>
              {successMsg && (
                <div style={{ fontSize: '0.78rem', color: '#34D399', marginTop: '8px' }}>
                  ✓ {successMsg}
                </div>
              )}
            </div>

            {/* Audit Trail Notes */}
            <h4 style={{ fontSize: '0.88rem', color: '#FFFFFF', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#8BAEDB" />
              <span>Case Audit Log</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', maxHeight: '180px', overflowY: 'auto' }}>
              {activeCase.notes.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.65)',
                    border: '1px solid rgba(23, 74, 145, 0.35)',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8BAEDB', fontSize: '0.72rem', marginBottom: '2px' }}>
                    <strong>{n.author}</strong>
                    <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{n.text}</div>
                </div>
              ))}
            </div>

            {/* Add Note Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter action note / follow-up record..."
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.9)',
                  border: '1px solid rgba(23, 74, 145, 0.6)',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => handleAddNote(activeCase.id)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid #8BAEDB',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Add Note
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'rgba(23, 74, 145, 0.4)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Case Modal */}
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
              padding: '24px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: '0 0 4px 0' }}>
              Open Beneficiary Support Case
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', margin: '0 0 16px 0' }}>
              Initiate an authorized intervention case for beneficiary support.
            </p>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  Target Beneficiary *
                </label>
                <select
                  value={createForm.profileId}
                  onChange={(e) => setCreateForm({ ...createForm, profileId: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.fullName} ({b.currentOccupation} • {b.district})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                  >
                    <option value="DOCUMENTATION">Documentation</option>
                    <option value="TRAINING">Training Support</option>
                    <option value="EMPLOYER">Employer Communication</option>
                    <option value="APPLICATION">Application Assistance</option>
                    <option value="ACCESSIBILITY">Accessibility</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Priority Level
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  Case Subject *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.subject}
                  onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                  placeholder="e.g. Workshop Tool Stipend Application"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  Case Description & Required Actions
                </label>
                <textarea
                  rows={3}
                  required
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Detail the beneficiary's need and intended support pathway..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
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
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
