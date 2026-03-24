import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaMapMarkedAlt, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '1rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem', 
          textDecoration: 'none'
        }}>
          <img src="/logo.png" alt="Street Monitor" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>
                Map View
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
                  Admin Dashboard
                </Link>
              )}
              <Link to="/report" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <FaPlus /> Report Issue
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <FaUser /> {user.name}
                </span>
                <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--error)', padding: '0.5rem' }}>
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
