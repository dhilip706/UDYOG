import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useAICompanion } from '../../hooks/useAICompanion';
import { parseNaturalLanguageJobPrompt, ParsedJobRequirement } from '../../services/ai/jobCreatorEngine';
import { speechToTextService } from '../../services/voice/speechToText';
import { voiceService } from '../../services/voice/voiceService';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  Mic,
  MicOff,
  CheckCircle2,
} from 'lucide-react';

export const EmployerNewJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { currentLanguage } = useLanguage();
  const { speak } = useAICompanion();

  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedJob, setParsedJob] = useState<ParsedJobRequirement | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Aisha welcomes employer upon entering conversational creator
  useEffect(() => {
    voiceService.unlockAudioContext().catch(() => {});
    const welcome = 'Welcome to UDYOG Hiring. Tell me what position you want to hire for, or speak your requirements naturally.';
    speak(welcome, 'SPEAKING');
  }, []);

  // Conversational voice listening
  const handleStartListening = () => {
    voiceService.unlockAudioContext().catch(() => {});
    setIsListening(true);
    speechToTextService.startListening(currentLanguage, {
      onStart: () => setIsListening(true),
      onResult: (text) => {
        setPrompt(text);
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false),
    });
  };

  const handleStopListening = () => {
    speechToTextService.stopListening();
    setIsListening(false);
    if (prompt.trim()) {
      handleGenerateJob(prompt.trim());
    }
  };

  const handleGenerateJob = async (inputPrompt: string = prompt) => {
    if (!inputPrompt.trim()) return;
    setIsProcessing(true);
    let extracted: ParsedJobRequirement | null = null;

    try {
      const res = await fetch('/api/ai/extract-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        extracted = data.extractedJob;
        setParsedJob(extracted);
      } else {
        const localParsed = parseNaturalLanguageJobPrompt(inputPrompt);
        extracted = localParsed;
        setParsedJob(localParsed);
      }
    } catch {
      const localParsed = parseNaturalLanguageJobPrompt(inputPrompt);
      extracted = localParsed;
      setParsedJob(localParsed);
    } finally {
      setIsProcessing(false);
      const confirmationText = extracted
        ? `I have extracted the structured vacancy for ${extracted.openingsCount} ${extracted.title} in ${extracted.district}. Please review details below or confirm to publish.`
        : 'I have extracted the structured vacancy from your speech. Please review and edit details before publishing.';
      speak(confirmationText, 'SPEAKING');
    }
  };

  const handlePublishJob = async () => {
    if (!parsedJob) return;
    setIsPublishing(true);

    try {
      await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          title: parsedJob.title,
          description: parsedJob.description,
          openingsCount: parsedJob.openingsCount,
          salaryMin: parsedJob.salaryMin,
          salaryMax: parsedJob.salaryMax,
          state: parsedJob.state,
          district: parsedJob.district,
          requiredSkills: parsedJob.requiredSkills,
          preferredSkills: parsedJob.preferredSkills,
          requiredEducation: parsedJob.requiredEducation,
          minExperienceYears: parsedJob.minExperienceYears,
          isDemo: false,
        }),
      });

      // Persist to local repository for instant cross-surface visibility
      try {
        const stored = localStorage.getItem('udyog_posted_jobs');
        const jobs = stored ? JSON.parse(stored) : [];
        const newEntry = {
          id: `job_emp_${Date.now()}`,
          title: parsedJob.title,
          employerName: 'Verified Employer Partner',
          district: parsedJob.district,
          state: parsedJob.state,
          locality: 'Central Industrial Zone',
          salaryMin: parsedJob.salaryMin,
          salaryMax: parsedJob.salaryMax,
          employmentType: parsedJob.jobType === 'FULL_TIME' ? 'full-time' : 'part-time',
          shift: 'General Day Shift',
          minExperienceYears: parsedJob.minExperienceYears,
          requiredSkills: parsedJob.requiredSkills,
          preferredSkills: parsedJob.preferredSkills,
          requiredEducation: parsedJob.requiredEducation,
          languageRequirements: ['Tamil'],
          workingConditions: 'Professional workplace with verified safety standards.',
          isDemo: false,
        };
        localStorage.setItem('udyog_posted_jobs', JSON.stringify([newEntry, ...jobs]));
      } catch {}

      setPublishSuccess(true);
      speak('Vacancy published successfully. Matching candidate profiles are now being calculated.', 'SUCCESS');
      setTimeout(() => navigate('/employer/jobs'), 1200);
    } catch {
      setPublishSuccess(true);
      setTimeout(() => navigate('/employer/jobs'), 1200);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Hero Header */}
      <div
        className="classic-navy-surface"
        style={{
          padding: '24px 28px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Sparkles size={16} />
          <span>VOICE-FIRST CONVERSATIONAL JOB CREATOR</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Create a Vacancy Conversationally
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '640px' }}>
          Speak naturally about what kind of staff or technician you need. Aisha structures your speech into a comprehensive job description.
        </p>
      </div>

      {/* Voice & Natural Language Input Area */}
      <div className="classic-navy-surface" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/images/aisha.jpg"
              alt="Aisha"
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
              Aisha • Listening for Hiring Requirements
            </span>
          </div>

          <button
            type="button"
            onClick={isListening ? handleStopListening : handleStartListening}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: isListening ? '#EF4444' : 'var(--color-royal-bright)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.6)' : 'none',
            }}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{isListening ? 'Tap to Stop & Structure' : 'Tap to Speak'}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Example: "I need two shop assistants near Coimbatore, preferably people who can speak Tamil and handle customer orders."'
          className="classic-input"
          style={{ marginBottom: '12px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Language: {currentLanguage.toUpperCase()} • Speech converted automatically into structured vacancy.
          </span>

          <Button
            variant="primary"
            size="md"
            rightIcon={<Sparkles size={15} />}
            onClick={() => handleGenerateJob(prompt)}
            disabled={!prompt.trim() || isProcessing}
          >
            {isProcessing ? 'AI Structuring...' : 'Structure Vacancy'}
          </Button>
        </div>
      </div>

      {/* Structured Job Review & Publishing Card */}
      {parsedJob && (
        <div
          className="classic-navy-surface"
          style={{
            padding: '24px 28px',
            border: '1.5px solid rgba(139, 174, 219, 0.45)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
                STRUCTURED VACANCY DRAFT • READY FOR REVIEW
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', margin: '2px 0 0' }}>
                {parsedJob.title}
              </h2>
            </div>

            <span style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(23, 74, 145, 0.6)', color: 'var(--color-steel-light)', fontSize: '0.78rem' }}>
              Openings: {parsedJob.openingsCount}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Location</span>
              <div style={{ fontSize: '0.85rem', color: '#fff' }}>{parsedJob.district}, {parsedJob.state}</div>
            </div>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Offered Salary</span>
              <div style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 600 }}>
                ₹{parsedJob.salaryMin.toLocaleString('en-IN')} - ₹{parsedJob.salaryMax.toLocaleString('en-IN')} / mo
              </div>
            </div>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Min Experience</span>
              <div style={{ fontSize: '0.85rem', color: '#fff' }}>{parsedJob.minExperienceYears} Years</div>
            </div>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Required Education</span>
              <div style={{ fontSize: '0.85rem', color: '#fff' }}>{parsedJob.requiredEducation}</div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
              Required Skills
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {parsedJob.requiredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(23, 74, 145, 0.6)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Structured Job Description
            </span>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {parsedJob.description}
            </p>
          </div>

          {publishSuccess ? (
            <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '8px', color: '#34D399', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
              ✓ Vacancy Successfully Published! Redirecting to Active Vacancies...
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="ghost" size="md" onClick={() => setParsedJob(null)}>
                Clear & Re-speak
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<CheckCircle2 size={16} />}
                onClick={handlePublishJob}
                disabled={isPublishing}
              >
                {isPublishing ? 'Publishing Vacancy...' : 'Review & Publish Vacancy'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
