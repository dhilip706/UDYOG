import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { NGOComplaint, BeneficiaryProfile } from '../../types/ngo';
import {
  ShieldAlert,
  Plus,
  Clock,
  Search,
  Lock,
} from 'lucide-react';

const WORKFLOW_STEPS = ['NEW', 'ASSIGNED', 'INVESTIGATING', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED'];

export const NgoComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<NGOComplaint[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryProfile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeComplaint, setActiveComplaint] = useState<NGOComplaint | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    beneficiaryName: '',
    beneficiaryPhone: '',
    category: 'TRAINING',
    priority: 'MEDIUM',
    subject: '',
    description: '',
  });
  const [resolutionInput, setResolutionInput] = useState('');

  useEffect(() => {
    async function loadData() {
      const [list, bens] = await Promise.all([
        ngoService.getComplaints(),
        ngoService.getBeneficiaries(),
      ]);
      setComplaints(list);
      setBeneficiaries(bens);
      if (bens.length > 0) {
        setCreateForm((prev) => ({
          ...prev,
          beneficiaryName: bens[0].fullName,
          beneficiaryPhone: bens[0].phone || '+919876543210',
        }));
      }
    }
    loadData();
  }, []);

  const filtered = complaints.filter((c) => {
    const matchesStatus =
      selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesSearch =
      !search ||
      c.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      c.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await ngoService.createComplaint(createForm);
    if (res.success) {
      const updated = await ngoService.getComplaints();
      setComplaints(updated);
      setShowCreateModal(false);
      setCreateForm({
        beneficiaryName: beneficiaries[0]?.fullName || '',
        beneficiaryPhone: beneficiaries[0]?.phone || '+919876543210',
        category: 'TRAINING',
        priority: 'MEDIUM',
        subject: '',
        description: '',
      });
    }
  };

  const handleAdvanceStatus = async (complaintId: string, nextStatus: string) => {
    // Optimistic update
    const updated = complaints.map((c) =>
      c.id === complaintId
        ? {
            ...c,
            status: nextStatus as any,
            resolutionNote: resolutionInput || c.resolutionNote,
            events: [
              ...c.events,
              {
                id: `ev_${Date.now()}`,
                note: resolutionInput ? `Status changed to ${nextStatus}: ${resolutionInput}` : `Status updated to ${nextStatus}`,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : c
    );
    setComplaints(updated);
    if (activeComplaint && activeComplaint.id === complaintId) {
      setActiveComplaint(updated.find((c) => c.id === complaintId) || null);
    }
    setResolutionInput('');
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <ShieldAlert size={16} />
            <span>ETHICAL GOVERNANCE & GRIEVANCE REDRESSAL</span>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
            Help Desk & Grievance Tickets
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Authorized NGO grievance redressal console. Every issue is tracked via a unique ticket ID with mandatory investigative milestones and confidentiality boundaries.
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
          <span>Register Grievance Ticket</span>
        </button>
      </div>

      {/* Security Banner */}
      <div
        style={{
          background: 'rgba(23, 74, 145, 0.25)',
          border: '1px solid rgba(139, 174, 219, 0.3)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Lock size={16} color="#8BAEDB" style={{ flexShrink: 0 }} />
        <span>
          <strong>Confidentiality Notice:</strong> Complaints are isolated to your organization’s service jurisdiction. Private identity records are masked from public audit logs.
        </span>
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
            placeholder="Search by Ticket ID (e.g. CMP-NGO-2026), subject, beneficiary..."
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
          {['ALL', ...WORKFLOW_STEPS].map((st) => (
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

      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((item) => (
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
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(7, 26, 58, 0.9)',
                      color: '#8BAEDB',
                      border: '1px solid rgba(23, 74, 145, 0.6)',
                    }}
                  >
                    {item.ticketId}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(23, 74, 145, 0.5)',
                      color: '#FFFFFF',
                    }}
                  >
                    {item.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: item.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: item.status === 'RESOLVED' ? '#34D399' : '#FBBF24',
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                  {item.subject}
                </h3>

                <div style={{ fontSize: '0.82rem', color: '#8BAEDB' }}>
                  Beneficiary: <strong>{item.beneficiaryName}</strong> ({item.beneficiaryPhone}) • Assigned: <strong>{item.assignedTo}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveComplaint(item)}
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
                Workflow Details & Action
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {item.description}
            </p>

            {item.resolutionNote && (
              <div style={{ fontSize: '0.78rem', color: '#34D399', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <strong>Resolution Note:</strong> {item.resolutionNote}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workflow Modal */}
      {activeComplaint && (
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
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#8BAEDB' }}>{activeComplaint.ticketId}</span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '2px 0 4px 0' }}>
                  {activeComplaint.subject}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>
                  Beneficiary: {activeComplaint.beneficiaryName} ({activeComplaint.beneficiaryPhone})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveComplaint(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-steel-light)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Advance Workflow */}
            <div style={{ background: 'rgba(7, 26, 58, 0.75)', borderRadius: '10px', padding: '14px', marginBottom: '18px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '8px', fontWeight: 600 }}>
                Advance Grievance Workflow
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {WORKFLOW_STEPS.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleAdvanceStatus(activeComplaint.id, step)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: activeComplaint.status === step ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(23, 74, 145, 0.5)',
                      border: '1px solid rgba(139, 174, 219, 0.4)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {step}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="Enter action taken / resolution note..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'rgba(7, 26, 58, 0.9)', border: '1px solid rgba(23, 74, 145, 0.5)', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
              />
            </div>

            {/* Timeline */}
            <h4 style={{ fontSize: '0.88rem', color: '#FFFFFF', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#8BAEDB" />
              <span>Grievance Investigation Events</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {activeComplaint.events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.65)',
                    border: '1px solid rgba(23, 74, 145, 0.35)',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ color: 'var(--color-steel-light)', fontSize: '0.7rem', marginBottom: '2px' }}>
                    {new Date(ev.timestamp).toLocaleDateString()}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{ev.note}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveComplaint(null)}
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

      {/* Register Complaint Modal */}
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
              Register Grievance Ticket
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', margin: '0 0 16px 0' }}>
              A unique ticket ID will be generated automatically for this grievance record.
            </p>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.beneficiaryName}
                    onChange={(e) => setCreateForm({ ...createForm, beneficiaryName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={createForm.beneficiaryPhone}
                    onChange={(e) => setCreateForm({ ...createForm, beneficiaryPhone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
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
                    <option value="TRAINING">Training Provider</option>
                    <option value="EMPLOYER">Employer Conduct</option>
                    <option value="APPLICATION">Application Issue</option>
                    <option value="SERVICE">Service Accessibility</option>
                    <option value="ABUSE">Abuse / Mistreatment</option>
                    <option value="TECHNICAL">Technical Platform</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Priority
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
                  Grievance Subject *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.subject}
                  onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                  placeholder="e.g. Non-receipt of training completion certificate"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(7, 26, 58, 0.95)', border: '1px solid rgba(23, 74, 145, 0.6)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                  Description & Incident Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Detail the complaint incident with dates and involved parties..."
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
                  Register Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
