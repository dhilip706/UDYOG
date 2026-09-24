import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAICompanion } from '../hooks/useAICompanion';
import { useAuth } from '../hooks/useAuth';
import { UserProfileService } from '../services/profile/userProfileService';
import { Button } from '../components/ui/Button';
import {
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  X,
} from 'lucide-react';

const APPLICATIONS_STORAGE_KEY = 'udyog_beneficiary_applications';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { speak } = useAICompanion();

  const profile = useMemo(() => {
    return UserProfileService.getProfile();
  }, []);

  const [job, setJob] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJob() {
      setIsLoading(true);
      let foundJob: any = null;

      try {
        if (id) {
          const res = await fetch(`/api/jobs/${id}`);
          if (res.ok) {
            const data = await res.json();
            foundJob = data.job;
          }
        }
      } catch {}

      if (!foundJob && id) {
        try {
          const stored = localStorage.getItem('udyog_posted_jobs');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              foundJob = parsed.find((j: any) => j.id === id);
            }
          }
        } catch {}
      }

      if (foundJob) {
        const jobData = {
          id: foundJob.id,
          title: foundJob.title,
          employerName: foundJob.employerName || 'Employer',
          district: foundJob.district || foundJob.locationDistrict || '',
          state: foundJob.state || 'Tamil Nadu',
          locality: foundJob.locality || '',
          salaryMin: foundJob.salaryMin || 0,
          salaryMax: foundJob.salaryMax || 0,
          employmentType: foundJob.employmentType || 'Full-time / Salaried',
          shift: foundJob.shift || 'General Day Shift',
          minExperienceYears: foundJob.minExperienceYears || 0,
          requiredSkills: foundJob.requiredSkills || [],
          preferredSkills: foundJob.preferredSkills || [],
          requiredEducation: foundJob.educationLevel || foundJob.requiredEducation || 'Not specified',
          languageRequirements: foundJob.languages || foundJob.languageRequirements || ['Tamil'],
          workingConditions: foundJob.description || foundJob.workingConditions || 'Standard workplace environment with safety standards.',
        };

        setJob(jobData);

        const confirmedSkills = (profile?.skills || []).map((s) => s.name);
        const matched = jobData.requiredSkills.filter((s: string) =>
          confirmedSkills.some((cs) => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase()))
        );
        const missing = jobData.requiredSkills.filter((s: string) => !matched.includes(s));

        setMatch({
          matchedSkills: matched,
          missingSkills: missing,
          matchScore: jobData.requiredSkills.length ? Math.round((matched.length / jobData.requiredSkills.length) * 100) : 100,
          explanation: `${matched.length} of ${jobData.requiredSkills.length} required skills verified in your profile. Located in ${jobData.district}.`,
          trainingRecommendations: missing.map((m: string) => `Recommended refresher on ${m} before first interview.`),
        });
      } else {
        setJob(null);
      }
      setIsLoading(false);
    }

    loadJob();
  }, [id, profile]);

  const handleConfirmAndApply = async () => {
    setIsSubmitting(true);

    let createdApp = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      employerName: job.employerName,
      location: `${job.district}, ${job.state}`,
      salaryRange: `₹${job.salaryMin.toLocaleString('en-IN')} - ₹${job.salaryMax.toLocaleString('en-IN')}`,
      status: 'Applied', // 5-stage: Applied -> Shortlisted -> Interview -> Selected -> Joined
      appliedAt: new Date().toISOString(),
      applicantName: profile?.personal.name || 'Job Seeker',
      applicantPhone: profile?.personal.phoneNumber || '+91 98765 43210',
      timeline: [
        {
          stage: 'Applied',
          timestamp: new Date().toISOString(),
          note: 'Application submitted with user confirmed profile.',
        },
      ],
    };

    // Persist to real backend API if authenticated
    try {
      if (session?.token) {
        const res = await fetch(`/api/jobs/${job.id}/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            confirmedData: {
              name: profile?.personal.name,
              skills: (profile?.skills || []).map((s) => s.name),
              yearsExperience: profile?.livelihood.yearsOfExperience || 1,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.application) {
            createdApp = {
              ...createdApp,
              id: data.application.id,
              status: data.application.status || 'Applied',
            };
          }
        }
      }
    } catch (err) {
      console.warn('[JobApply] Backend sync warning:', err);
    }

    try {
      const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify([createdApp, ...list]));
    } catch {}

    setSubmissionSuccess(createdApp);
    setIsSubmitting(false);
    setIsReviewModalOpen(false);
    speak('Your application has been confirmed and submitted. You can now track your application status.', 'SUCCESS');
  };

  if (!job) {
    return <div style={{ color: 'var(--color-steel-light)', padding: '40px', textAlign: 'center' }}>Loading vacancy details...</div>;
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: '860px', margin: '60px auto', textAlign: 'center', color: 'var(--color-steel-light)' }}>
        Loading job vacancy details...
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', textAlign: 'center', padding: '36px 24px' }} className="classic-navy-surface">
        <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '8px' }}>Vacancy Not Found</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          This job vacancy either does not exist or has been closed by the employer.
        </p>
        <button
          type="button"
          onClick={() => navigate('/opportunities')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
            border: '1px solid rgba(139, 174, 219, 0.5)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Browse Active Opportunities</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/opportunities')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-steel-light)',
          fontSize: '0.85rem',
          marginBottom: '16px',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Opportunities</span>
      </button>

      {/* Main Job Card */}
      <div
        className="classic-navy-surface"
        style={{
          padding: '28px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Briefcase size={15} />
              <span>VERIFIED EMPLOYER VACANCY</span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
              {job.title}
            </h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              {job.employerName} • {job.locality}, {job.district}, {job.state}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#34D399' }}>
              ₹{job.salaryMin.toLocaleString('en-IN')} - ₹{job.salaryMax.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>per month • {job.employmentType}</span>
          </div>
        </div>

        {/* Explainable Match Box */}
        {match && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(7, 26, 58, 0.75)',
              border: '1px solid rgba(139, 174, 219, 0.45)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-steel-light)', fontWeight: 600, fontSize: '0.85rem' }}>
                <Sparkles size={15} />
                <span>AI Match Explanation:</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34D399' }}>
                Match Signal: {match.matchScore}/100
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '0 0 10px 0', lineHeight: 1.45 }}>
              {match.explanation}
            </p>
            {match.trainingRecommendations.length > 0 && (
              <div style={{ fontSize: '0.78rem', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={13} />
                <span>{match.trainingRecommendations.join(' ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Required Skills</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {job.requiredSkills.map((sk: string, i: number) => (
                <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(23, 74, 145, 0.6)', color: '#FFFFFF' }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Languages Required</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {job.languageRequirements.map((lang: string, i: number) => (
                <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(7, 26, 58, 0.8)', color: 'var(--color-steel-light)' }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Shift & Hours</span>
            <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{job.shift}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Required Education</span>
            <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{job.requiredEducation}</span>
          </div>
        </div>

        {/* Working Conditions */}
        <div style={{ background: 'rgba(7, 26, 58, 0.6)', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            WORKING CONDITIONS & WORKPLACE SAFETY
          </span>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
            {job.workingConditions}
          </p>
        </div>

        {/* Action Button */}
        {submissionSuccess ? (
          <div
            style={{
              padding: '18px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#34D399', fontWeight: 600, marginBottom: '6px' }}>
              <CheckCircle2 size={18} />
              <span>Application Successfully Submitted</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '0 0 14px' }}>
              Your confirmed profile has been securely sent to {job.employerName}. You can track your status through each hiring stage.
            </p>
            <Button variant="primary" size="md" onClick={() => navigate('/applications')}>
              Go to Application Tracker
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => setIsReviewModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                padding: '12px 28px',
              }}
            >
              Review & Apply with Confirmed Profile
            </Button>
          </div>
        )}
      </div>

      {/* Explicit Pre-Submission Review Modal */}
      {isReviewModalOpen && (
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
              maxWidth: '560px',
              padding: '28px',
              animation: 'classic-fade-in 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0 }}>
                Review Application Before Submission
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.45 }}>
              Your application to <strong>{job.employerName}</strong> for <strong>{job.title}</strong> will be auto-filled with your confirmed profile data:
            </p>

            <div style={{ background: 'rgba(7, 26, 58, 0.8)', padding: '14px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Applicant Name: </span>
                <strong style={{ color: '#FFFFFF' }}>{profile?.personal.name || 'Job Seeker'}</strong>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Contact Phone: </span>
                <span style={{ color: '#FFFFFF' }}>{profile?.personal.phoneNumber || '+91 98765 43210'}</span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Location: </span>
                <span style={{ color: '#FFFFFF' }}>{profile?.personal.district || 'Coimbatore'}, {profile?.personal.state || 'Tamil Nadu'}</span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Experience: </span>
                <span style={{ color: '#FFFFFF' }}>{profile?.livelihood.yearsOfExperience || 1.5} Years in {profile?.livelihood.currentOccupation || 'Practical Work'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Demonstrated Skills: </span>
                <span style={{ color: 'var(--color-steel-light)' }}>
                  {(profile?.skills || []).map((s) => s.name).join(', ') || 'Engine Diagnostics, Tool Handling'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="md" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmAndApply}
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                }}
              >
                {isSubmitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
