import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAICompanion } from '../hooks/useAICompanion';
import { useLanguage } from '../hooks/useLanguage';
import { UserProfileService } from '../services/profile/userProfileService';
import { ComplaintService, SUPPORT_CHANNELS } from '../services/complaintService';
import { SupportComplaint, ComplaintCategory, SupportChannel, ComplaintStatus } from '../types/complaints';
import { Button } from '../components/ui/Button';
import {
  HelpCircle,
  Mic,
  MicOff,
  PhoneCall,
  Mail,
  MessageSquare,
  MessageCircle,
  Plus,
  Sparkles,
} from 'lucide-react';
import { speechToTextService } from '../services/voice/speechToText';

const CATEGORIES: { id: ComplaintCategory; label: string }[] = [
  { id: 'employer_issue', label: 'Employer Issue (Unfair conditions, dispute)' },
  { id: 'training_issue', label: 'Training Issue (Lab delay, certification)' },
  { id: 'application_issue', label: 'Application Issue (No update, process issue)' },
  { id: 'harassment_abuse', label: 'Harassment / Abuse (Strict priority review)' },
  { id: 'discrimination', label: 'Discrimination (Ethics & protection desk)' },
  { id: 'payment_issue', label: 'Payment / Stipend Issue' },
  { id: 'technical_issue', label: 'Technical Platform Issue' },
  { id: 'incorrect_profile', label: 'Incorrect Profile Information / Verification' },
  { id: 'other_complaint', label: 'Other General Complaint' },
];

const STATUS_STAGES: ComplaintStatus[] = [
  'Submitted',
  'Received',
  'Assigned',
  'Under Review',
  'Action Required',
  'Resolved',
  'Closed',
];

export const HelpGrievancePage: React.FC = () => {
  const { session } = useAuth();
  const { speak } = useAICompanion();
  const { currentLanguage } = useLanguage();

  const profile = useMemo(() => {
    return UserProfileService.getProfile();
  }, []);

  const [complaints, setComplaints] = useState<SupportComplaint[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<SupportChannel>('chat');
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory>('training_issue');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setComplaints(ComplaintService.getComplaints());
  }, []);

  const handleStartVoice = () => {
    setIsListening(true);
    speechToTextService.startListening(currentLanguage, {
      onStart: () => setIsListening(true),
      onResult: (text) => {
        setDescription((prev) => (prev ? `${prev} ${text}` : text));
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false),
    });
  };

  const handleStopVoice = () => {
    speechToTextService.stopListening();
    setIsListening(false);
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const created = ComplaintService.submitComplaint({
        category: selectedCategory,
        channel: selectedChannel,
        title: subject.trim(),
        description: description.trim(),
        userContact: {
          name: profile?.personal.name || session?.displayName || 'Job Seeker',
          phoneNumber: profile?.personal.phoneNumber || session?.phoneNumber,
          district: profile?.personal.district || 'Coimbatore',
        },
      });

      // Synchronize with backend API if authenticated
      if (session?.token) {
        fetch('/api/complaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            category: selectedCategory,
            subject: subject.trim(),
            description: description.trim(),
            priority: 'NORMAL',
          }),
        }).catch((err) => console.warn('[Grievance] Backend sync warning:', err));
      }

      setComplaints(ComplaintService.getComplaints());
      setSubject('');
      setDescription('');
      setIsFormOpen(false);
      speak(`Your grievance ticket ${created.id} has been registered. You can track official review steps here.`, 'SUCCESS');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = (id: string) => {
    const updated = ComplaintService.escalateComplaint(id);
    if (updated) {
      setComplaints(ComplaintService.getComplaints());
      speak(`Grievance ${id} escalated for expedited oversight.`, 'SUCCESS');
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Page Header */}
      <div
        className="classic-navy-surface"
        style={{
          padding: '24px 28px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <HelpCircle size={16} />
              <span>GRIEVANCE & CITIZEN SUPPORT DESK</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
              Help, Grievance & Transparent Redressal
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '640px' }}>
              Every complaint generates a unique traceable ID with an immutable audit log. Automated channels are clearly distinguished from human officer hours.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? 'Close Form' : 'Register New Grievance'}
          </Button>
        </div>
      </div>

      {/* 4 Transparent Support Channels */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
          Official Support Channels
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {SUPPORT_CHANNELS.map((ch) => {
            const isSelected = selectedChannel === ch.id;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch.id);
                  if (!isFormOpen) setIsFormOpen(true);
                }}
                className="classic-navy-surface"
                style={{
                  padding: '16px',
                  border: isSelected ? '1.5px solid var(--color-steel-light)' : '1px solid rgba(23, 74, 145, 0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  background: isSelected ? 'rgba(23, 74, 145, 0.5)' : 'rgba(7, 26, 58, 0.75)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ color: 'var(--color-steel-light)' }}>
                    {ch.id === 'callback' && <PhoneCall size={20} />}
                    {ch.id === 'email' && <Mail size={20} />}
                    {ch.id === 'whatsapp' && <MessageCircle size={20} />}
                    {ch.id === 'chat' && <MessageSquare size={20} />}
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: ch.isAiAssisted ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: ch.isAiAssisted ? '#93C5FD' : '#6EE7B7',
                      border: ch.isAiAssisted ? '1px solid rgba(147, 197, 253, 0.3)' : '1px solid rgba(110, 231, 183, 0.3)',
                    }}
                  >
                    {ch.badge}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                  {ch.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: 1.35 }}>
                  {ch.description}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {ch.availabilityLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Grievance Registration Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitGrievance}
          className="classic-navy-surface"
          style={{
            padding: '24px 28px',
            marginBottom: '32px',
            border: '1.5px solid rgba(139, 174, 219, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
            <Sparkles size={16} />
            <span>Filing Grievance via {SUPPORT_CHANNELS.find((c) => c.id === selectedChannel)?.title}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                Grievance Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ComplaintCategory)}
                className="classic-input"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} style={{ background: '#0B2452', color: '#fff' }}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                Summary Subject
              </label>
              <input
                type="text"
                placeholder="Brief subject of the complaint"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="classic-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Detailed Description (Type or Tap Mic to Speak)
              </label>
              <button
                type="button"
                onClick={isListening ? handleStopVoice : handleStartVoice}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  color: isListening ? '#EF4444' : 'var(--color-steel-light)',
                  cursor: 'pointer',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(23, 74, 145, 0.4)',
                }}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{isListening ? 'Stop Speaking' : 'Voice Dictate'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="Explain the specific issue, dates, location, or parties involved..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="classic-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Assigned automatically to relevant Oversight Bureau upon submission.
            </span>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="ghost" size="md" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Submit Grievance'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Submitted Complaints Tracking List */}
      <div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
          Your Tracked Grievance Tickets
        </h2>

        {complaints.length === 0 ? (
          <div className="classic-navy-surface" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No complaints registered.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {complaints.map((cmp) => {
              const currentStatusIndex = STATUS_STAGES.indexOf(cmp.status);

              return (
                <div
                  key={cmp.id}
                  className="classic-navy-surface"
                  style={{
                    padding: '22px 24px',
                    background: 'rgba(11, 36, 82, 0.9)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-steel-light)', fontFamily: 'monospace' }}>
                          {cmp.id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          • {new Date(cmp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                        {cmp.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Assigned Team: <strong style={{ color: 'var(--color-steel-light)' }}>{cmp.assignedTeam}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: cmp.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(23, 74, 145, 0.5)',
                          color: cmp.status === 'Resolved' ? '#34D399' : 'var(--color-steel-light)',
                          border: cmp.status === 'Resolved' ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(139, 174, 219, 0.3)',
                        }}
                      >
                        Status: {cmp.status}
                      </span>

                      {cmp.escalationAvailable && (
                        <button
                          type="button"
                          onClick={() => handleEscalate(cmp.id)}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#F87171',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            cursor: 'pointer',
                          }}
                        >
                          Escalate
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '0 0 16px', lineHeight: 1.45 }}>
                    {cmp.description}
                  </p>

                  {/* 7-Stage Status Stepper */}
                  <div style={{ margin: '14px 0', padding: '14px', background: 'rgba(7, 26, 58, 0.75)', borderRadius: '8px', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '480px', position: 'relative' }}>
                      {STATUS_STAGES.map((stg, idx) => {
                        const isDone = idx <= currentStatusIndex;
                        const isCur = idx === currentStatusIndex;

                        return (
                          <div key={stg} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: isDone ? 'var(--color-royal-bright)' : 'rgba(7, 26, 58, 0.9)',
                                border: isCur ? '2px solid #34D399' : isDone ? '1px solid var(--color-steel-light)' : '1px solid rgba(23, 74, 145, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '0.65rem',
                              }}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: isCur ? '#fff' : isDone ? 'var(--color-steel-light)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                              {stg}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Response History */}
                  {cmp.responseHistory && cmp.responseHistory.length > 0 && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', background: 'rgba(7, 26, 58, 0.5)', padding: '8px 12px', borderRadius: '6px' }}>
                      <strong>Latest Activity: </strong>
                      {cmp.responseHistory[cmp.responseHistory.length - 1].note} ({new Date(cmp.responseHistory[cmp.responseHistory.length - 1].timestamp).toLocaleDateString()})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
