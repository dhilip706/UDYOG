import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import {
  UserPlus,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
} from 'lucide-react';

export const NgoAssistedOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Profile State
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    preferredLanguage: 'ta',
    age: 26,
    gender: 'Male',
    state: 'Tamil Nadu',
    district: 'Salem',
    locality: '',
    currentOccupation: '',
    yearsExperience: 2,
    educationLevel: 'ITI / Diploma',
    workPreference: 'FULL_TIME',
    isRelocationOpen: false,
    availability: 'Immediate',
    skills: [] as Array<{ name: string; category: string; evidenceStatus: 'CONFIRMED' | 'SUPPORTED' | 'NEEDS_VERIFICATION' | 'DEVELOPING' | 'MISSING'; yearsExperience?: number; notes?: string }>,
    interests: [] as string[],
    constraints: '',
    consentPhoto: false,
    consentAcknowledged: false,
    workerNotes: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState('TECHNICAL');

  // Simulated Voice Simulation Assistance
  const toggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setVoiceTranscript('Listening to beneficiary in Tamil/English...');
      setTimeout(() => {
        setVoiceTranscript('"I have worked for 3 years at the workshop doing car engine diagnostics and brake servicing. I also know OBD scanner tools."');
        // Auto extract suggestions into fields if empty
        if (!formData.currentOccupation) {
          setFormData((prev) => ({
            ...prev,
            currentOccupation: 'Automotive Diagnostic Technician',
            yearsExperience: 3,
            skills: [
              ...prev.skills,
              { name: 'Engine Diagnostics', category: 'TECHNICAL', evidenceStatus: 'SUPPORTED', yearsExperience: 3 },
              { name: 'OBD-II Scanning', category: 'TECHNICAL', evidenceStatus: 'SUPPORTED', yearsExperience: 3 },
              { name: 'Brake Systems', category: 'PRACTICAL', evidenceStatus: 'CONFIRMED', yearsExperience: 3 },
            ],
          }));
        }
        setIsVoiceActive(false);
      }, 2500);
    } else {
      setIsVoiceActive(false);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: skillInput.trim(),
          category: skillCategory,
          evidenceStatus: 'SUPPORTED',
          yearsExperience: prev.yearsExperience,
        },
      ],
    }));
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitProfile = async () => {
    setErrorMsg(null);
    if (!formData.consentAcknowledged) {
      setErrorMsg('Explicit beneficiary confirmation and consent must be acknowledged before submitting.');
      return;
    }

    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.currentOccupation.trim()) {
      setErrorMsg('Please complete all mandatory fields: Full Name, Phone, and Occupation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ngoService.submitAssistedOnboarding(formData);
      if (res.success && res.profile) {
        setSuccessResult(res.profile);
        setCurrentStep(5); // Move to Step 5: Profile Created
      } else {
        setErrorMsg(res.error || 'Failed to create profile. Please verify data.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsHeader = [
    { num: 1, title: 'AI Conversation' },
    { num: 2, title: 'Structured Profile' },
    { num: 3, title: 'NGO Verification' },
    { num: 4, title: 'Beneficiary Confirmation' },
    { num: 5, title: 'Profile Created' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <UserPlus size={16} />
          <span>FIELD WORKER ASSISTED ONBOARDING</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          NGO-Assisted Beneficiary Onboarding
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Assisting community members who cannot independently navigate digital portals. Audio conversation, structured extraction, worker verification, and signed consent.
        </p>
      </div>

      {/* 5-Step Process Pipeline Flow Indicator (Requirement 8) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          overflowX: 'auto',
          gap: '12px',
        }}
      >
        {stepsHeader.map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isDone
                    ? '#1E5DB7'
                    : isActive
                    ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)'
                    : 'rgba(23, 74, 145, 0.3)',
                  border: isActive ? '1px solid #8BAEDB' : '1px solid rgba(139, 174, 219, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDone ? <CheckCircle2 size={15} /> : s.num}
              </div>
              <span
                style={{
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                }}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Wizard Card */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.92)',
          border: '1px solid rgba(23, 74, 145, 0.6)',
          borderRadius: '16px',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-royal)',
        }}
      >
        {errorMsg && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              fontSize: '0.8125rem',
              color: '#FFFFFF',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={16} color="var(--color-error)" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: AI & Voice Conversation */}
        {currentStep === 1 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Step 1: AI Guided Voice & Dialogue
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Select the beneficiary language and initiate spoken interview or manual entry.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={15} color="var(--color-steel-light)" />
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                  }}
                >
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Voice Bar Trigger */}
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                background: 'rgba(7, 26, 58, 0.8)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <button
                type="button"
                onClick={toggleVoice}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: isVoiceActive
                    ? 'linear-gradient(135deg, #E07363 0%, #C53030 100%)'
                    : 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '2px solid rgba(139, 174, 219, 0.5)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isVoiceActive ? '0 0 20px rgba(224, 115, 99, 0.6)' : '0 4px 14px rgba(7, 26, 58, 0.7)',
                }}
              >
                {isVoiceActive ? <MicOff size={26} /> : <Mic size={26} />}
              </button>

              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                {isVoiceActive ? 'Live Audio Conversation Active' : 'Start Assisted Voice Conversation'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', maxWidth: '480px' }}>
                Speak directly with the beneficiary in their native dialect. The system transcribes and populates their practical background, tools used, and vocational interests.
              </div>

              {voiceTranscript && (
                <div
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(23, 74, 145, 0.35)',
                    border: '1px solid rgba(139, 174, 219, 0.3)',
                    fontSize: '0.825rem',
                    color: '#FFFFFF',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                    Transcript Stream:
                  </div>
                  {voiceTranscript}
                </div>
              )}
            </div>

            {/* Manual Quick Entry */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Beneficiary Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Senthil Nathan"
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
                  Mobile Number *
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+91..."
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
          </div>
        )}

        {/* STEP 2: Structured Profile Capture */}
        {currentStep === 2 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
              Step 2: Structured Profile Capture
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '18px' }}>
              Capture occupation, skills, experience, constraints, and work preferences.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Current Occupation / Trade *
                </label>
                <input
                  type="text"
                  value={formData.currentOccupation}
                  onChange={(e) => setFormData({ ...formData, currentOccupation: e.target.value })}
                  placeholder="e.g. Motor Vehicle Mechanic"
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
                  Years of Practical Experience
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: parseFloat(e.target.value) || 0 })}
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
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
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
                  Locality / Village / Block
                </label>
                <input
                  type="text"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="e.g. Attur Block"
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

            {/* Skills Entry */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                Add Verified Practical Skills
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. Engine Diagnostics, Brake Caliper Service..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.825rem',
                  }}
                />
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                  }}
                >
                  <option value="TECHNICAL">Technical Skill</option>
                  <option value="PRACTICAL">Practical & Tools</option>
                  <option value="DIGITAL">Digital Skill</option>
                  <option value="TRADITIONAL_CRAFT">Traditional Craft</option>
                </select>
                <button
                  type="button"
                  onClick={addSkill}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: 'rgba(23, 74, 145, 0.6)',
                    border: '1px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
              </div>

              {/* Tag List */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {formData.skills.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(23, 74, 145, 0.45)',
                      border: '1px solid rgba(139, 174, 219, 0.35)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{s.name} ({s.category})</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-steel-light)', cursor: 'pointer', padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Relocation & Preferences */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#FFFFFF', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isRelocationOpen}
                  onChange={(e) => setFormData({ ...formData, isRelocationOpen: e.target.checked })}
                />
                <span>Willing to relocate outside home district for employment</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: NGO Worker Verification */}
        {currentStep === 3 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
              Step 3: NGO Worker Verification & Observations
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '18px' }}>
              Record field worker observations, physical tooling review, and photo consent.
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                Worker Field Observation Notes *
              </label>
              <textarea
                rows={3}
                value={formData.workerNotes}
                onChange={(e) => setFormData({ ...formData, workerNotes: e.target.value })}
                placeholder="Observed candidate in local workshop. Demonstrated authentic tool handling with OBD scanners. Suitable for technical placement."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#071A3A',
                  border: '1px solid rgba(139, 174, 219, 0.35)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Photo Consent */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(7, 26, 58, 0.7)',
                border: '1px solid rgba(23, 74, 145, 0.45)',
                marginBottom: '16px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#FFFFFF', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.consentPhoto}
                  onChange={(e) => setFormData({ ...formData, consentPhoto: e.target.checked })}
                />
                <span>Beneficiary gave verbal consent for field worker photo capture (optional)</span>
              </label>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px', marginLeft: '24px' }}>
                If unchecked, no facial photo will be recorded or displayed.
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Beneficiary Confirmation & Consent */}
        {currentStep === 4 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
              Step 4: Beneficiary Confirmation & Informed Consent
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '18px' }}>
              Review the structured profile with the beneficiary. No profile is created without consent.
            </div>

            {/* Summary Review */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(7, 26, 58, 0.75)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.825rem' }}>
                <div>
                  <span style={{ color: 'var(--color-steel-light)' }}>Name:</span>{' '}
                  <strong style={{ color: '#FFFFFF' }}>{formData.fullName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-steel-light)' }}>Phone:</span>{' '}
                  <strong style={{ color: '#FFFFFF' }}>{formData.phoneNumber}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-steel-light)' }}>Occupation:</span>{' '}
                  <strong style={{ color: '#FFFFFF' }}>{formData.currentOccupation}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-steel-light)' }}>Experience:</span>{' '}
                  <strong style={{ color: '#FFFFFF' }}>{formData.yearsExperience} years</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-steel-light)' }}>Location:</span>{' '}
                  <strong style={{ color: '#FFFFFF' }}>{formData.locality ? `${formData.locality}, ` : ''}{formData.district}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-steel-light)' }}>Skills Count:</span>{' '}
                  <strong style={{ color: '#FFFFFF' }}>{formData.skills.length} skills recorded</strong>
                </div>
              </div>
            </div>

            {/* Mandatory Consent Checkbox (Requirement 8) */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                marginBottom: '20px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.consentAcknowledged}
                  onChange={(e) => setFormData({ ...formData, consentAcknowledged: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#34D399' }}>
                    Beneficiary Confirmation & Informed Consent Acknowledged *
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', marginTop: '4px', lineHeight: 1.45 }}>
                    I confirm that the details recorded above have been read out to the beneficiary in their primary language ({formData.preferredLanguage}), and the beneficiary has explicitly consented to profile creation, skill mapping, and employer referral under UDYOG NGO partnership.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Success / Profile Created */}
        {currentStep === 5 && successResult && (
          <div style={{ textAlign: 'center', padding: '24px 0', animation: 'classic-fade-in 0.3s ease-out' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10B981',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              Beneficiary Profile Created Successfully!
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-steel-light)', maxWidth: '500px', margin: '0 auto 24px' }}>
              <strong>{successResult.fullName}</strong> is now registered under your authorized community workspace. All skills have been added to the regional inventory.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => navigate('/ngo/beneficiaries')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View in Beneficiary Directory
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setSuccessResult(null);
                  setFormData({
                    fullName: '',
                    phoneNumber: '',
                    preferredLanguage: 'ta',
                    age: 26,
                    gender: 'Male',
                    state: 'Tamil Nadu',
                    district: 'Salem',
                    locality: '',
                    currentOccupation: '',
                    yearsExperience: 2,
                    educationLevel: 'ITI / Diploma',
                    workPreference: 'FULL_TIME',
                    isRelocationOpen: false,
                    availability: 'Immediate',
                    skills: [],
                    interests: [],
                    constraints: '',
                    consentPhoto: false,
                    consentAcknowledged: false,
                    workerNotes: '',
                  });
                }}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: 'rgba(23, 74, 145, 0.4)',
                  border: '1px solid rgba(139, 174, 219, 0.3)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Onboard Another Beneficiary
              </button>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        {currentStep < 5 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(23, 74, 145, 0.4)',
            }}
          >
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'rgba(23, 74, 145, 0.35)',
                  border: '1px solid rgba(139, 174, 219, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>Proceed to {stepsHeader[currentStep].title}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 26px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: '1px solid rgba(52, 211, 153, 0.5)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>{isSubmitting ? 'Creating Profile...' : 'Confirm & Commit Profile'}</span>
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
