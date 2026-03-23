import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIssue, toggleVote, updateIssueStatus } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import MapComponent from '../components/MapComponent';
import { FaArrowUp, FaUser, FaCalendarDay, FaExclamationTriangle, FaMapPin, FaArrowLeft } from 'react-icons/fa';

const IssueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const data = await getIssue(id);
      setIssue(data);
    } catch (err) {
      setError('Failed to load issue details. It may have been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVote = async () => {
    if (voting) return;
    try {
      setVoting(true);
      const updatedIssue = await toggleVote(id);
      setIssue(updatedIssue);
    } catch (err) {
      console.error("Failed to vote", err);
    } finally {
      setVoting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const updatedIssue = await updateIssueStatus(id, { status: newStatus });
      setIssue(updatedIssue);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'REPORTED': return 'badge-reported';
      case 'IN_PROGRESS': return 'badge-progress';
      case 'RESOLVED': return 'badge-resolved';
      default: return 'badge-reported';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%', 
          border: '3px solid rgba(255, 255, 255, 0.1)', borderTopColor: 'var(--primary-color)',
          animation: 'spin 1s linear infinite' 
        }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error || 'Issue not found'}</h2>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button className="btn btn-outline" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.25fr)', gap: '2rem' }}>
        
        {/* Left Side: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.1)', 
                    color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600
                  }}>
                    {issue.type.replace('_', ' ')}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  
                  {user && user.role === 'ADMIN' && (
                    <select 
                      className="form-select" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto', marginLeft: '0.5rem' }} 
                      value={issue.status} 
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={updatingStatus}
                    >
                      <option value="REPORTED">Reported</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  )}
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{issue.title}</h1>
              </div>

              {/* Voting Button */}
              <button 
                onClick={handleToggleVote}
                disabled={voting}
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: issue.hasVoted ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.5)',
                  border: `1px solid ${issue.hasVoted ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                  color: issue.hasVoted ? 'var(--primary-color)' : 'var(--text-main)',
                  padding: '1rem', borderRadius: '12px', cursor: voting ? 'wait' : 'pointer',
                  minWidth: '80px', transition: 'all 0.2s ease'
                }}
              >
                <FaArrowUp size={24} style={{ marginBottom: '0.25rem' }} />
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{issue.voteCount}</span>
                <span style={{ fontSize: '0.75rem' }}>{issue.hasVoted ? 'Voted' : 'Upvote'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaUser color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reported By</div>
                  <div style={{ fontWeight: 500 }}>{issue.reporterName}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaCalendarDay color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date Reported</div>
                  <div style={{ fontWeight: 500 }}>{new Date(issue.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaExclamationTriangle color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Severity</div>
                  <div style={{ fontWeight: 500 }}>{issue.severity} / 5</div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Description</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {issue.description || 'No description provided for this issue.'}
              </p>
            </div>
          </div>

          {/* Image Evidence */}
          {issue.imageData && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Photo Evidence</h3>
              <img src={issue.imageData} alt="Issue" style={{ width: '100%', borderRadius: '8px', maxHeight: '500px', objectFit: 'contain', background: '#000' }} />
            </div>
          )}
        </div>

        {/* Right Side: Map location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <FaMapPin color="var(--secondary-color)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Location</h3>
            </div>
            
            <div style={{ 
              height: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' 
            }}>
              <MapComponent issues={[issue]} selectedLocation={{lat: issue.latitude, lng: issue.longitude}} />
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              Coordinates: {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1000px) {
          div[style*="gridTemplateColumns"] { gridTemplateColumns: '1fr' !important; }
        }
      `}} />
    </div>
  );
};

export default IssueDetailsPage;
