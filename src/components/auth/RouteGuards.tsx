import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RoleRouteProps {
  allowedRoles: Array<'BENEFICIARY' | 'EMPLOYER' | 'ADMIN' | 'NGO'>;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { session, isAuthenticated } = useAuth();

  if (!isAuthenticated || !session) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't selected a role yet, send to role-select
  if (!session.role) {
    return <Navigate to="/role-select" replace />;
  }

  if (!allowedRoles.includes(session.role)) {
    if (session.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (session.role === 'EMPLOYER') return <Navigate to="/employer" replace />;
    if (session.role === 'NGO') return <Navigate to="/ngo" replace />;
    return <Navigate to="/skills" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export const NgoRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <RoleRoute allowedRoles={['NGO', 'ADMIN']}>
      {children}
    </RoleRoute>
  );
};

/**
 * Strict AdminRoute with server verification
 */
export const AdminRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { session, isAuthenticated } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function verifyAdmin() {
      if (!session?.token) {
        if (isMounted) {
          setIsAllowed(false);
          setIsVerifying(false);
        }
        return;
      }

      try {
        const res = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (isMounted) {
          if (res.ok) {
            setIsAllowed(true);
          } else {
            setIsAllowed(false);
          }
          setIsVerifying(false);
        }
      } catch {
        if (isMounted) {
          setIsAllowed(false);
          setIsVerifying(false);
        }
      }
    }

    verifyAdmin();
    return () => {
      isMounted = false;
    };
  }, [session]);

  if (!isAuthenticated || !session) {
    return <Navigate to="/login" replace />;
  }

  if (isVerifying) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-base)',
          color: 'var(--color-steel-light)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px' }}>
            Verifying administrative credentials...
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Authorizing against server-side access control
          </div>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    const returnUrl = session?.role === 'EMPLOYER' ? '/employer' : session?.role === 'BENEFICIARY' ? '/skills' : '/login';

    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#071A3A',
          color: '#FFFFFF',
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            background: 'rgba(11, 36, 82, 0.95)',
            border: '1px solid #E53E3E',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#FC8181', marginBottom: '12px' }}>403 — Forbidden</h2>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E0', lineHeight: 1.5, marginBottom: '20px' }}>
            Access denied. Your identity is not in the server-side administrative allowlist.
          </p>
          <a
            href={returnUrl}
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#174A91',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
