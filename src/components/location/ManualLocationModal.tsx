import React, { useState } from 'react';
import { INDIAN_STATES } from '../../services/locationService';
import { Button } from '../ui/Button';
import { X, MapPin } from 'lucide-react';

interface ManualLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (stateName: string, districtName: string) => void;
  title?: string;
}

export const ManualLocationModal: React.FC<ManualLocationModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Your Region',
}) => {
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(0);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    INDIAN_STATES[0].districts[0]
  );

  if (!isOpen) return null;

  const currentState = INDIAN_STATES[selectedStateIndex];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedStateIndex(idx);
    setSelectedDistrict(INDIAN_STATES[idx].districts[0] || '');
  };

  const handleConfirm = () => {
    onSelect(currentState.name, selectedDistrict);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'classic-fade-in 0.25s ease-out',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="classic-navy-surface"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '28px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--color-navy-elevated)',
                border: '1px solid var(--color-navy-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={18} color="var(--color-accent-steel)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* State selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                marginBottom: '6px',
                textAlign: 'left',
              }}
            >
              State / Union Territory
            </label>
            <select
              value={selectedStateIndex}
              onChange={handleStateChange}
              style={{
                width: '100%',
                height: '46px',
                background: 'rgba(7, 17, 31, 0.9)',
                border: '1px solid var(--color-navy-border)',
                borderRadius: '8px',
                padding: '0 14px',
                color: 'var(--color-text-primary)',
                fontSize: '0.9375rem',
              }}
            >
              {INDIAN_STATES.map((st, i) => (
                <option key={st.code} value={i} style={{ background: '#0B1628', color: '#F5F7FA' }}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* District selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                marginBottom: '6px',
                textAlign: 'left',
              }}
            >
              District / City
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                width: '100%',
                height: '46px',
                background: 'rgba(7, 17, 31, 0.9)',
                border: '1px solid var(--color-navy-border)',
                borderRadius: '8px',
                padding: '0 14px',
                color: 'var(--color-text-primary)',
                fontSize: '0.9375rem',
              }}
            >
              {currentState.districts.map((dist) => (
                <option key={dist} value={dist} style={{ background: '#0B1628', color: '#F5F7FA' }}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Set Location
          </Button>
        </div>
      </div>
    </div>
  );
};
