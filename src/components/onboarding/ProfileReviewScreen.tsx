import React, { useState, useRef } from 'react';
import { StructuredUserProfile, CertificateRecord } from '../../types/onboarding';
import { Button } from '../ui/Button';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Cpu,
  Compass,
  MapPin,
  AlertTriangle,
  Edit2,
  CheckCircle2,
  ArrowLeft,
  X,
  FileCheck,
  Camera,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ProfileReviewScreenProps {
  profile: StructuredUserProfile;
  onUpdateProfile: (updater: (prev: StructuredUserProfile) => StructuredUserProfile) => void;
  onConfirmAndSubmit: () => void;
  onBackToInterview: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export const ProfileReviewScreen: React.FC<ProfileReviewScreenProps> = ({
  profile,
  onUpdateProfile,
  onConfirmAndSubmit,
  onBackToInterview,
  isSubmitting = false,
  submitError = null,
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // File upload ref for photo
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Local draft states for modal editing
  const [draftPersonal, setDraftPersonal] = useState(profile.personal);
  const [draftEducation, setDraftEducation] = useState(profile.education);
  const [draftCertificates, setDraftCertificates] = useState<CertificateRecord[]>(profile.certificates || []);
  const [draftLivelihood, setDraftLivelihood] = useState(profile.livelihood);
  const [draftSkills, setDraftSkills] = useState(profile.skills.map((s) => s.name).join(', '));
  const [draftTools, setDraftTools] = useState(profile.tools.join(', '));
  const [draftInterests, setDraftInterests] = useState(profile.interests.join(', '));
  const [draftAspirations, setDraftAspirations] = useState((profile.aspirations || []).join(', '));
  const [draftPreferences, setDraftPreferences] = useState(profile.workPreferences);
  const [draftConstraints, setDraftConstraints] = useState(profile.constraints.join(', '));

  // New Certificate modal inputs
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');

  const openEditor = (section: string) => {
    setDraftPersonal(profile.personal);
    setDraftEducation(profile.education);
    setDraftCertificates(profile.certificates || []);
    setDraftLivelihood(profile.livelihood);
    setDraftSkills(profile.skills.map((s) => s.name).join(', '));
    setDraftTools(profile.tools.join(', '));
    setDraftInterests(profile.interests.join(', '));
    setDraftAspirations((profile.aspirations || []).join(', '));
    setDraftPreferences(profile.workPreferences);
    setDraftConstraints(profile.constraints.join(', '));
    setEditingSection(section);
  };

  const handleSaveSection = (section: string) => {
    onUpdateProfile((prev) => {
      const next = { ...prev };
      if (section === 'personal') {
        next.personal = { ...draftPersonal };
      } else if (section === 'education') {
        next.education = { ...draftEducation };
      } else if (section === 'certificates') {
        next.certificates = [...draftCertificates];
      } else if (section === 'experience') {
        next.livelihood = { ...draftLivelihood };
      } else if (section === 'skills') {
        const list = draftSkills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        next.skills = list.map((name) => ({ name, category: 'practical', confidence: 'reported' }));
      } else if (section === 'tools') {
        next.tools = draftTools
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      } else if (section === 'interests') {
        next.interests = draftInterests
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      } else if (section === 'aspirations') {
        next.aspirations = draftAspirations
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      } else if (section === 'preferences') {
        next.workPreferences = { ...draftPreferences };
      } else if (section === 'location') {
        next.workPreferences = {
          ...next.workPreferences,
          preferredLocation: draftPreferences.preferredLocation,
          willingToRelocate: draftPreferences.willingToRelocate,
        };
      } else if (section === 'availability') {
        next.workPreferences = {
          ...next.workPreferences,
          availability: draftPreferences.availability,
        };
      } else if (section === 'constraints') {
        next.constraints = draftConstraints
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      return next;
    });
    setEditingSection(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        onUpdateProfile((prev) => ({
          ...prev,
          personal: { ...prev.personal, profilePhoto: dataUrl },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCertificate = () => {
    if (!newCertName.trim() || !newCertIssuer.trim()) return;
    const newCert: CertificateRecord = {
      id: `cert_${Date.now()}`,
      name: newCertName.trim(),
      issuingOrg: newCertIssuer.trim(),
      issueDate: newCertYear.trim() || undefined,
      verificationStatus: 'unverified',
    };
    const updated = [...draftCertificates, newCert];
    setDraftCertificates(updated);
    setNewCertName('');
    setNewCertIssuer('');
    setNewCertYear('');
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        padding: '32px 20px 80px',
        background: 'linear-gradient(180deg, rgba(7, 26, 58, 0.82) 0%, rgba(11, 36, 82, 0.75) 45%, rgba(7, 26, 58, 0.88) 100%)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      <CinematicVideo />
      <AtmosphereOverlay />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '880px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(23, 74, 145, 0.4)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              fontSize: '0.78rem',
              color: 'var(--color-steel-light)',
              marginBottom: '10px',
              fontWeight: 500,
            }}
          >
            <Sparkles size={13} />
            <span>AI-Guided Profile Intake Complete</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
            }}
          >
            Review Your Verified Profile
          </h1>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-muted)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            Please review the details captured conversationally by Aisha. You can edit any section, upload certificates, or replace your photo before confirming.
          </p>
        </div>

        {/* 12 Structured Review Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
          {/* 1. Personal Information */}
          <SectionCard
            title="1. Personal Information"
            icon={<User size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('personal')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                {profile.personal.profilePhoto ? (
                  <img
                    src={profile.personal.profilePhoto}
                    alt={profile.personal.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--color-steel-light)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'rgba(23, 74, 145, 0.6)',
                      border: '2px solid rgba(139, 174, 219, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-steel-light)',
                    }}
                  >
                    <User size={32} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => photoFileInputRef.current?.click()}
                  title="Upload / Replace Photo"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    background: 'var(--color-royal-bright)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <Camera size={13} />
                </button>
                <input
                  type="file"
                  ref={photoFileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                  {profile.personal.name || 'Not provided'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-steel-light)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <span>Age: {profile.personal.age ?? 'Not specified'}</span>
                  <span>Gender: {profile.personal.gender || 'Not specified'}</span>
                  {profile.personal.bloodGroup && <span>Blood Group: {profile.personal.bloodGroup}</span>}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Primary Language</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.personal.preferredLanguage || profile.metadata.languageCode.toUpperCase()}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>District / Taluk</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.personal.district || 'Coimbatore'}, {profile.personal.taluk || 'Urban'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Contact Phone</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.personal.phoneNumber || '+91 98765 43210'}</span>
              </div>
            </div>
          </SectionCard>

          {/* 2. Education */}
          <SectionCard
            title="2. Education"
            icon={<GraduationCap size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('education')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Highest Level</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{profile.education.level || 'Secondary School / Practical Learner'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Course / Specialization</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.education.qualification || 'Foundational'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Institution</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.education.schoolOrCollege || 'Regional Institute / Self-taught'}</span>
              </div>
            </div>
          </SectionCard>

          {/* 3. Certificates & Proofs */}
          <SectionCard
            title="3. Certifications & Documents"
            icon={<FileCheck size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('certificates')}
          >
            {profile.certificates && profile.certificates.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {profile.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(7, 26, 58, 0.7)',
                      border: '1px solid rgba(23, 74, 145, 0.4)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, color: '#FFFFFF', fontSize: '0.9rem' }}>{cert.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {cert.issuingOrg} {cert.issueDate ? `• ${cert.issueDate}` : ''}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: cert.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: cert.verificationStatus === 'verified' ? '#34D399' : '#FBBF24',
                        border: cert.verificationStatus === 'verified' ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(251, 191, 36, 0.4)',
                      }}
                    >
                      {cert.verificationStatus === 'verified' ? <ShieldCheck size={12} /> : <Clock size={12} />}
                      <span>{cert.verificationStatus === 'verified' ? 'Verified Certificate' : 'Unverified • Review Pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                No uploaded certificates yet. Practical experience is fully respected. You may upload certificates at any time.
              </div>
            )}
          </SectionCard>

          {/* 4. Employment & Experience */}
          <SectionCard
            title="4. Employment & Experience (Formal, Informal & Traditional)"
            icon={<Briefcase size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('experience')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.875rem', marginBottom: '12px' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Primary Occupation</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{profile.livelihood.currentOccupation || 'Practical Operator'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Total Experience</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.livelihood.yearsOfExperience ?? 0} Years</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Current Status</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.livelihood.workSituation || 'Looking for suitable employment'}</span>
              </div>
            </div>
            {profile.livelihood.mainResponsibilities && profile.livelihood.mainResponsibilities.length > 0 && (
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', background: 'rgba(7, 26, 58, 0.6)', padding: '8px 12px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--color-steel-light)' }}>Tasks Handled: </strong>
                {profile.livelihood.mainResponsibilities.join('; ')}
              </div>
            )}
          </SectionCard>

          {/* 5. Skills */}
          <SectionCard
            title="5. Skills (Technical, Practical & Craft)"
            icon={<Cpu size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('skills')}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.skills.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8125rem',
                      background: 'rgba(23, 74, 145, 0.5)',
                      border: '1px solid rgba(139, 174, 219, 0.35)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <span>{skill.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-steel-light)' }}>
                      ({skill.confidence || 'reported'})
                    </span>
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No specific skills registered yet.</span>
              )}
            </div>
          </SectionCard>

          {/* 6. Tools & Equipment */}
          <SectionCard
            title="6. Tools, Machinery & Equipment Handled"
            icon={<Wrench size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('tools')}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.tools.length > 0 ? (
                profile.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      background: 'rgba(11, 36, 82, 0.8)',
                      border: '1px solid rgba(23, 74, 145, 0.5)',
                      color: 'var(--color-steel-light)',
                    }}
                  >
                    {tool}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Standard workshop and hand tools.</span>
              )}
            </div>
          </SectionCard>

          {/* 7. Interests */}
          <SectionCard
            title="7. Work Interests & Learning Goals"
            icon={<Sparkles size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('interests')}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
              {profile.interests.length > 0 ? profile.interests.join(', ') : 'Open to learning modern technology and practical diagnostics.'}
            </div>
          </SectionCard>

          {/* 8. Career Aspirations */}
          <SectionCard
            title="8. Target Occupation & Career Aspirations"
            icon={<Compass size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('aspirations')}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#FFFFFF' }}>
              {profile.aspirations && profile.aspirations.length > 0 ? profile.aspirations.join(', ') : `Certified ${profile.livelihood.currentOccupation || 'Technician'} Specialist`}
            </div>
          </SectionCard>

          {/* 9. Work Preferences */}
          <SectionCard
            title="9. Work Preferences & Employment Type"
            icon={<Briefcase size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('preferences')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Employment Type</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.workPreferences.employmentType || 'Salaried Wage / Full-time'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Environment</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.workPreferences.environmentPreference || 'Workshop / Field'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Expected Shift</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.workPreferences.shiftPreference || 'Standard Day Shift'}</span>
              </div>
            </div>
          </SectionCard>

          {/* 10. Location & Mobility */}
          <SectionCard
            title="10. Location & Travel Preferences"
            icon={<MapPin size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('location')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Preferred Hub</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.workPreferences.preferredLocation || 'Coimbatore / Hometown'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Willing to Relocate</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{profile.workPreferences.willingToRelocate ? 'Yes (Adjacent Districts)' : 'No (Local Only)'}</span>
              </div>
            </div>
          </SectionCard>

          {/* 11. Availability */}
          <SectionCard
            title="11. Availability & Joining Timeline"
            icon={<Clock size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('availability')}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
              {profile.workPreferences.availability || 'Immediate / Within 1-2 weeks'}
            </div>
          </SectionCard>

          {/* 12. Additional Information & Constraints */}
          <SectionCard
            title="12. Additional Information & Constraints"
            icon={<AlertTriangle size={16} color="var(--color-steel-light)" />}
            onEdit={() => openEditor('constraints')}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {profile.constraints.length > 0 ? profile.constraints.join(', ') : 'No specific physical or schedule constraints recorded.'}
            </div>
          </SectionCard>
        </div>

        {/* Explicit Confirmation Action Bar */}
        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(18, 54, 111, 0.85) 0%, rgba(11, 36, 82, 0.95) 100%)',
            border: '1.5px solid rgba(139, 174, 219, 0.45)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '580px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
              Confirm My Profile & Generate Livelihood Plan
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
              By confirming, your profile will be locked for intelligent livelihood matching and your personalized 30-dimension skill development plan will be immediately generated.
            </p>
          </div>

          {submitError && (
            <div
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#FCA5A5',
                fontSize: '0.85rem',
                maxWidth: '520px',
                textAlign: 'center',
              }}
            >
              {submitError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="ghost"
              size="lg"
              leftIcon={<ArrowLeft size={16} />}
              onClick={onBackToInterview}
              disabled={isSubmitting}
            >
              Back to Aisha
            </Button>

            <Button
              variant="primary"
              size="lg"
              leftIcon={<CheckCircle2 size={18} />}
              onClick={onConfirmAndSubmit}
              disabled={isSubmitting}
              style={{
                background: isSubmitting
                  ? 'rgba(23, 74, 145, 0.6)'
                  : 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                boxShadow: '0 4px 18px rgba(30, 93, 183, 0.4)',
                padding: '12px 28px',
                fontWeight: 600,
                opacity: isSubmitting ? 0.75 : 1,
              }}
            >
              {isSubmitting ? 'Finalizing Profile & Syncing...' : 'Confirm My Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* Granular Section Editor Modal */}
      {editingSection && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="classic-navy-surface"
            style={{
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0 }}>
                Edit {editingSection.toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body depending on section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {editingSection === 'personal' && (
                <>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      type="text"
                      value={draftPersonal.name}
                      onChange={(e) => setDraftPersonal({ ...draftPersonal, name: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={labelStyle}>Age</label>
                      <input
                        type="number"
                        value={draftPersonal.age ?? ''}
                        onChange={(e) => setDraftPersonal({ ...draftPersonal, age: parseInt(e.target.value) || null })}
                        style={modalInputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Gender</label>
                      <input
                        type="text"
                        value={draftPersonal.gender}
                        onChange={(e) => setDraftPersonal({ ...draftPersonal, gender: e.target.value })}
                        style={modalInputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Blood Group (Optional)</label>
                    <input
                      type="text"
                      value={draftPersonal.bloodGroup || ''}
                      onChange={(e) => setDraftPersonal({ ...draftPersonal, bloodGroup: e.target.value })}
                      placeholder="e.g. O+ (Optional)"
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>District / Locality</label>
                    <input
                      type="text"
                      value={draftPersonal.district || ''}
                      onChange={(e) => setDraftPersonal({ ...draftPersonal, district: e.target.value })}
                      placeholder="e.g. Coimbatore"
                      style={modalInputStyle}
                    />
                  </div>
                </>
              )}

              {editingSection === 'education' && (
                <>
                  <div>
                    <label style={labelStyle}>Highest Education Level</label>
                    <input
                      type="text"
                      value={draftEducation.level}
                      onChange={(e) => setDraftEducation({ ...draftEducation, level: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Course / Field / ITI Trade</label>
                    <input
                      type="text"
                      value={draftEducation.qualification}
                      onChange={(e) => setDraftEducation({ ...draftEducation, qualification: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>School / College Name</label>
                    <input
                      type="text"
                      value={draftEducation.schoolOrCollege || ''}
                      onChange={(e) => setDraftEducation({ ...draftEducation, schoolOrCollege: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                </>
              )}

              {editingSection === 'certificates' && (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>Add New Certificate</label>
                    <input
                      type="text"
                      placeholder="Certificate Name (e.g. EV Battery Safety)"
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      style={{ ...modalInputStyle, marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      placeholder="Issuing Organization (e.g. ASDC / NSDC)"
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      style={{ ...modalInputStyle, marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      placeholder="Year / Issue Date"
                      value={newCertYear}
                      onChange={(e) => setNewCertYear(e.target.value)}
                      style={{ ...modalInputStyle, marginBottom: '8px' }}
                    />
                    <Button variant="secondary" size="sm" onClick={handleAddCertificate}>
                      + Add Certificate Record
                    </Button>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Note: Newly added certificates remain labeled as <strong>Unverified</strong> until verified by administrative authority.
                  </div>
                </div>
              )}

              {editingSection === 'experience' && (
                <>
                  <div>
                    <label style={labelStyle}>Current / Primary Occupation</label>
                    <input
                      type="text"
                      value={draftLivelihood.currentOccupation}
                      onChange={(e) => setDraftLivelihood({ ...draftLivelihood, currentOccupation: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Years of Total Experience</label>
                    <input
                      type="number"
                      value={draftLivelihood.yearsOfExperience ?? ''}
                      onChange={(e) => setDraftLivelihood({ ...draftLivelihood, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                      style={modalInputStyle}
                    />
                  </div>
                </>
              )}

              {editingSection === 'skills' && (
                <div>
                  <label style={labelStyle}>Skills (Comma separated)</label>
                  <textarea
                    rows={4}
                    value={draftSkills}
                    onChange={(e) => setDraftSkills(e.target.value)}
                    style={modalInputStyle}
                  />
                </div>
              )}

              {editingSection === 'tools' && (
                <div>
                  <label style={labelStyle}>Tools & Machinery Handled (Comma separated)</label>
                  <textarea
                    rows={3}
                    value={draftTools}
                    onChange={(e) => setDraftTools(e.target.value)}
                    style={modalInputStyle}
                  />
                </div>
              )}

              {editingSection === 'interests' && (
                <div>
                  <label style={labelStyle}>What Work You Enjoy / Want to Learn</label>
                  <textarea
                    rows={3}
                    value={draftInterests}
                    onChange={(e) => setDraftInterests(e.target.value)}
                    style={modalInputStyle}
                  />
                </div>
              )}

              {editingSection === 'aspirations' && (
                <div>
                  <label style={labelStyle}>Target Roles / Long-Term Career Aspiration</label>
                  <input
                    type="text"
                    value={draftAspirations}
                    onChange={(e) => setDraftAspirations(e.target.value)}
                    style={modalInputStyle}
                  />
                </div>
              )}

              {editingSection === 'preferences' && (
                <>
                  <div>
                    <label style={labelStyle}>Employment Preference</label>
                    <input
                      type="text"
                      value={draftPreferences.employmentType}
                      onChange={(e) => setDraftPreferences({ ...draftPreferences, employmentType: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Preferred Environment (Indoor / Outdoor / Workshop)</label>
                    <input
                      type="text"
                      value={draftPreferences.environmentPreference || ''}
                      onChange={(e) => setDraftPreferences({ ...draftPreferences, environmentPreference: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                </>
              )}

              {editingSection === 'location' && (
                <>
                  <div>
                    <label style={labelStyle}>Preferred Work District / Location</label>
                    <input
                      type="text"
                      value={draftPreferences.preferredLocation}
                      onChange={(e) => setDraftPreferences({ ...draftPreferences, preferredLocation: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(draftPreferences.willingToRelocate)}
                      onChange={(e) => setDraftPreferences({ ...draftPreferences, willingToRelocate: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>Willing to relocate to nearby districts if good opportunities arise</span>
                  </label>
                </>
              )}

              {editingSection === 'availability' && (
                <div>
                  <label style={labelStyle}>Availability / Joining Notice</label>
                  <input
                    type="text"
                    value={draftPreferences.availability}
                    onChange={(e) => setDraftPreferences({ ...draftPreferences, availability: e.target.value })}
                    style={modalInputStyle}
                  />
                </div>
              )}

              {editingSection === 'constraints' && (
                <div>
                  <label style={labelStyle}>Work Constraints / Special Considerations</label>
                  <textarea
                    rows={3}
                    value={draftConstraints}
                    onChange={(e) => setDraftConstraints(e.target.value)}
                    style={modalInputStyle}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="md" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={() => handleSaveSection(editingSection)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, onEdit, children }) => (
  <div
    className="classic-navy-surface"
    style={{
      padding: '20px 24px',
      position: 'relative',
      transition: 'all 0.2s',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'rgba(23, 74, 145, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <h2 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{title}</h2>
      </div>

      <button
        type="button"
        onClick={onEdit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'rgba(23, 74, 145, 0.35)',
          border: '1px solid rgba(139, 174, 219, 0.3)',
          color: 'var(--color-steel-light)',
          fontSize: '0.78rem',
          cursor: 'pointer',
        }}
      >
        <Edit2 size={12} />
        <span>Edit</span>
      </button>
    </div>

    <div>{children}</div>
  </div>
);

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  color: 'var(--color-text-muted)',
  marginBottom: '6px',
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  background: 'rgba(11, 36, 82, 0.9)',
  border: '1px solid rgba(23, 74, 145, 0.6)',
  color: '#FFFFFF',
  fontSize: '0.875rem',
};
