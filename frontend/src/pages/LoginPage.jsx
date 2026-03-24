import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { login, googleLogin } from '../services/apiService';
import { FaEnvelope, FaLock, FaMapMarkedAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('USER'); // 'USER' or 'ADMIN'
  
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(credentials);
      
      if (loginType === 'ADMIN' && data.email !== 'purukutapuajayreddy@gmail.com') {
        setError('Unauthorized: Admin access is restricted to authorized personnel only.');
        setLoading(false);
        return;
      }

      loginUser(data);
      navigate(loginType === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const data = await googleLogin(credentialResponse.credential);
      
      if (loginType === 'ADMIN' && data.email !== 'purukutapuajayreddy@gmail.com') {
        setError('Unauthorized: Admin access is restricted to authorized personnel only.');
        setLoading(false);
        return;
      }

      loginUser(data);
      navigate(loginType === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: 'calc(100vh - 150px)' 
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '150px', height: '150px', borderRadius: '50%',
          background: 'var(--primary-color)', filter: 'blur(50px)', opacity: 0.3, zIndex: -1
        }} />
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="Street Monitor" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue to Street Monitor</p>
        </div>

        {/* Login Type Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '4px', marginBottom: '1.5rem' }}>
          <button 
            type="button"
            onClick={() => { setLoginType('USER'); setCredentials({ email: '', password: '' }); setError(''); }}
            style={{ 
              flex: 1, padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600,
              background: loginType === 'USER' ? 'var(--primary-color)' : 'transparent',
              color: loginType === 'USER' ? '#000000' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            User Login
          </button>
          <button 
            type="button"
            onClick={() => { setLoginType('ADMIN'); setCredentials({ email: 'purukutapuajayreddy@gmail.com', password: '' }); setError(''); }}
            style={{ 
              flex: 1, padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600,
              background: loginType === 'ADMIN' ? 'var(--primary-color)' : 'transparent',
              color: loginType === 'ADMIN' ? '#000000' : 'var(--text-muted)',
              transition: 'all 0.2s',
              border: loginType === 'ADMIN' ? '1px solid rgba(255,255,255,0.1)' : 'none'
            }}
          >
            Admin Login
          </button>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', 
            color: 'var(--error)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem',
            textAlign: 'center', fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-muted)' }}>
                <FaEnvelope />
              </div>
              <input 
                type="email" name="email" className="form-input" 
                placeholder="you@example.com" style={{ paddingLeft: '2.5rem' }}
                value={credentials.email} onChange={handleChange} required 
                readOnly={loginType === 'ADMIN'}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-muted)' }}>
                <FaLock />
              </div>
              <input 
                type="password" name="password" className="form-input" 
                placeholder="••••••••" style={{ paddingLeft: '2.5rem' }}
                value={credentials.password} onChange={handleChange} required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '0 1rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
            theme="filled_black"
            shape="rectangular"
            text="signin_with"
            size="large"
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {loginType === 'USER' ? (
            <>Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Create one</Link></>
          ) : (
            <span style={{ color: 'var(--error)' }}>Admin access is restricted to authorized personnel only.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
