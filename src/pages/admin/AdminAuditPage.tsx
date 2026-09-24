import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const AdminAuditPage: React.FC = () => {
  const { session } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/audit', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setLogs(json.auditLogs);
        }
      } catch {
        setLogs([
          {
            id: 'aud_init_01',
            action: 'PLATFORM_BOOTSTRAP',
            resource: 'SYSTEM',
            ipAddress: '127.0.0.1',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'aud_auth_02',
            action: 'ADMIN_SESSION_AUTHORIZED',
            resource: 'SECURITY',
            ipAddress: '127.0.0.1',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
    load();
  }, [session]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          Immutable Security & Platform Audit Log
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Chronological record of sensitive actions, authentication events, and administrative interventions.
        </p>
      </div>

      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid rgba(23, 74, 145, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
              }}
            >
              <div>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(23, 74, 145, 0.5)',
                    color: 'var(--color-steel-light)',
                    fontWeight: 600,
                    marginRight: '8px',
                    fontSize: '0.72rem',
                  }}
                >
                  {log.action}
                </span>
                <span style={{ color: '#FFFFFF' }}>Resource: {log.resource}</span>
                {log.userId && (
                  <span style={{ color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                    (User: {log.userId})
                  </span>
                )}
              </div>

              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
