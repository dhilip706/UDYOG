import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Globe,
  Shield,
  CheckCircle2,
  Save,
} from 'lucide-react';

export const NgoSettingsPage: React.FC = () => {
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [voiceConsentEnforced, setVoiceConsentEnforced] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState('ta');
  const [autoMaskPhone, setAutoMaskPhone] = useState(true);
  const [saveNotice, setSaveNotice] = useState('');

  const handleSave = () => {
    setSaveNotice('Workspace settings and compliance rules updated successfully.');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Settings size={16} />
          <span>WORKSPACE CONFIGURATION</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          NGO Workspace Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Configure regional communication defaults, mandatory beneficiary consent checks, and automated field dispatch notifications.
        </p>
      </div>

      {saveNotice && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          {saveNotice}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Compliance & Consent */}
        <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#8BAEDB" />
            <span>Beneficiary Consent & Data Protection</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', margin: '0 0 16px 0' }}>
            Strict standards governing assisted onboarding and employer data sharing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>Mandatory Voice Consent Confirmation</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Requires explicit beneficiary assent check before committing profile to registry</div>
              </div>
              <input
                type="checkbox"
                checked={voiceConsentEnforced}
                onChange={(e) => setVoiceConsentEnforced(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderTop: '1px solid rgba(23, 74, 145, 0.35)', paddingTop: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>Mask Phone Numbers in Public Reports</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Protects candidate contact details from unverified third parties</div>
              </div>
              <input
                type="checkbox"
                checked={autoMaskPhone}
                onChange={(e) => setAutoMaskPhone(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="#8BAEDB" />
            <span>Field Staff & Candidate Notifications</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', margin: '0 0 16px 0' }}>
            Automated alerts dispatched during interview shortlisting and assessment completions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>SMS Dispatch for Shortlisted Candidates</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Send instant local language SMS when an employer requests an interview</div>
              </div>
              <input
                type="checkbox"
                checked={notifySms}
                onChange={(e) => setNotifySms(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderTop: '1px solid rgba(23, 74, 145, 0.35)', paddingTop: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500 }}>Daily Operational Digest to NGO Lead</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Email summary of new assisted onboardings and grievance ticket resolutions</div>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        {/* Regional Default Language */}
        <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#8BAEDB" />
            <span>Default Field Communication Language</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', margin: '0 0 14px 0' }}>
            Primary spoken language during assisted onboarding speech interactions.
          </p>

          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.95)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="en">English</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="ml">Malayalam (മലയാളം)</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="bn">Bengali (বাংলা)</option>
            <option value="gu">Gujarati (ગુજરાતી)</option>
            <option value="or">Odia (ଓଡ଼ିଆ)</option>
            <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="ur">Urdu (اردو)</option>
          </select>
        </div>

        {/* Save CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
              border: '1px solid #8BAEDB',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
