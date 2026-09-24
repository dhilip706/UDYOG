import React from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../locales';

export const AdminLanguagesPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Globe size={16} />
          <span>EIGHTH SCHEDULE CONSTITUTIONAL LOCALIZATION</span>
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          22 Scheduled Indian Languages Architecture
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Full script coverage, font fallback hierarchies, RTL rendering support, and localized audio telemetry.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>
                {lang.name} ({lang.nativeName})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Code: {lang.code} • {lang.scriptHint} {lang.direction === 'rtl' ? '• RTL Supported' : ''}
              </div>
            </div>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#6EE7B7',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={12} />
              Ready
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
