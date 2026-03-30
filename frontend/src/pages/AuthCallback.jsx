import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Member 2: AuthCallback component handles the OAuth callback after GitHub authentication, processing the token and redirecting accordingly.

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      login(token)
        .then(() => navigate('/dashboard', { replace: true }))
        .catch(() => navigate('/login', { replace: true }));
    } else {
      navigate('/login', { replace: true });
    }
  }, [login, navigate]);
  return (
    <div className="spinner-overlay">
      <div className="spinner"><div className="spinner-ring"></div></div>
      <p className="spinner-text">Authenticating...</p>
    </div>
  );
}
