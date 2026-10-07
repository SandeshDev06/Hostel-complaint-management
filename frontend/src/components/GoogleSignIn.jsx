import React, { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Demo accounts shown when no Google Client ID is configured (works offline for presentations)
const DEMO_ACCOUNTS = [
  { name: 'Rahul Patil', email: 'rahul.patil@gmail.com', color: '#4f46e5' },
  { name: 'Sneha Deshmukh', email: 'sneha.deshmukh@gmail.com', color: '#db2777' },
  { name: 'Warden Ramesh', email: 'warden.ramesh@gmail.com', color: '#dc2626' }
];

const decodeJwt = (token) => {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(escape(atob(payload))));
};

/**
 * Google Sign-In.
 *  - With VITE_GOOGLE_CLIENT_ID: real Google Identity Services button.
 *  - Without it: glass "choose an account" dialog so the flow can be demoed.
 * onSuccess receives { name, email, picture, credential? }
 */
const GoogleSignIn = ({ onSuccess, onError, label = 'Continue with Google' }) => {
  const btnRef = useRef(null);
  const [showChooser, setShowChooser] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return undefined;

    const init = () => {
      if (!window.google?.accounts?.id || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp) => {
          try {
            const p = decodeJwt(resp.credential);
            onSuccess({ name: p.name, email: p.email, picture: p.picture, credential: resp.credential });
          } catch {
            onError?.('Could not read Google response.');
          }
        }
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with',
        width: Math.min(btnRef.current.offsetWidth || 320, 400)
      });
    };

    if (window.google?.accounts?.id) {
      init();
      return undefined;
    }
    const existing = document.getElementById('gsi-script');
    if (existing) {
      existing.addEventListener('load', init);
      return () => existing.removeEventListener('load', init);
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.id = 'gsi-script';
    s.onload = init;
    s.onerror = () => onError?.('Failed to load Google Sign-In. Check your internet connection.');
    document.head.appendChild(s);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (CLIENT_ID) {
    return <div ref={btnRef} className="d-flex justify-content-center w-100" style={{ minHeight: 44 }} />;
  }

  return (
    <>
      <button type="button" className="btn btn-google" onClick={() => setShowChooser(true)}>
        <img src="/images/google.svg" alt="" /> {label}
      </button>

      {showChooser && (
        <div className="gmodal-backdrop" onClick={() => setShowChooser(false)}>
          <div className="gmodal glass glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-3">
              <img src="/images/google.svg" alt="Google" width="30" height="30" />
              <h5 className="fw-bold mt-2 mb-0">Choose an account</h5>
              <div className="small text-muted">to continue to HostelCare</div>
            </div>
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                className="gaccount"
                onClick={() => {
                  setShowChooser(false);
                  onSuccess({ name: a.name, email: a.email, picture: null });
                }}
              >
                <span className="gavatar" style={{ background: a.color }}>{a.name[0]}</span>
                <span>
                  <span className="d-block fw-semibold text-dark">{a.name}</span>
                  <span className="d-block small text-muted">{a.email}</span>
                </span>
              </button>
            ))}
            <div className="small text-muted text-center mt-3" style={{ fontSize: '.72rem' }}>
              Demo mode – add <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code> to enable real Google accounts.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleSignIn;
