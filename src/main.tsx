import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Development Data Reset: ensure clean start for Job Seeker and Employer
const DEV_RESET_VERSION = 'udyog_dev_clean_reset_v3';
try {
  if (localStorage.getItem(DEV_RESET_VERSION) !== 'true') {
    const keysToClean = [
      'udyog_user_profile',
      'aura_user_profile',
      'beneficiary_profile',
      'employer_profile',
      'employer_jobs',
      'candidate_shortlists',
      'interview_records',
      'employer_hiring_outcomes',
      'udyog_beneficiary_applications',
      'udyog_learning_progress_state',
      'aura_skill_analysis',
      'aura_skill_evidence',
      'udyog_user_complaints',
      'udyog_posted_jobs',
      'udyog_saved_jobs',
      'saved_jobs',
      'bookmarked_jobs',
      'onboarding_data',
      'onboarding_draft',
      'completed_assessments',
      'assessment_results',
    ];
    keysToClean.forEach((k) => localStorage.removeItem(k));

    // Clear stale demo beneficiary or employer auth sessions so they start clean
    ['aura_auth_session', 'udyog_auth_session'].forEach((authKey) => {
      const raw = localStorage.getItem(authKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.user?.role === 'BENEFICIARY' || parsed?.user?.role === 'EMPLOYER') {
            localStorage.removeItem(authKey);
          }
        } catch {}
      }
    });

    localStorage.setItem(DEV_RESET_VERSION, 'true');
  }
} catch (e) {
  console.warn('Dev reset init error:', e);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
