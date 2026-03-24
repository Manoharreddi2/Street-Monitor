import { useState, useEffect } from 'react';
import { getIssues, updateIssueStatus } from '../services/apiService';
import { FaEdit, FaCheck, FaSortNumericDown, FaSortAlphaDown, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const AdminDashboardPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await getIssues({});
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const sortData = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...issues].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setIssues(sorted);
  };

  const handleStatusUpdate = async (id) => {
    try {
      const updated = await updateIssueStatus(id, { status: newStatus });
      setIssues(issues.map(issue => issue.id === id ? updated : issue));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const startEditing = (issue) => {
    setEditingId(issue.id);
    setNewStatus(issue.status);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'REPORTED': return 'badge-reported';
      case 'IN_PROGRESS': return 'badge-progress';
      case 'RESOLVED': return 'badge-resolved';
      default: return 'badge-reported';
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Admin Dashboard</h1>
        <div style={{ color: 'var(--text-muted)' }}>{issues.length} total issues</div>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => sortData('id')}>
                  ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => sortData('title')}>Title</th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => sortData('type')}>Type</th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => sortData('severity')}>Severity</th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => sortData('voteCount')}>
                  Votes {sortConfig.key === 'voteCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => sortData('createdAt')}>Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>Loading issues...</td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No issues found.</td>
                </tr>
              ) : (
                issues.map(issue => (
                  <tr key={issue.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-[rgba(255,255,255,0.02)]">
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{issue.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 500, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {issue.title}
                    </td>
                    <td style={{ padding: '1rem' }}>{issue.type.replace('_', ' ')}</td>
                    <td style={{ padding: '1rem' }}>{issue.severity}/5</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-color)' }}>{issue.voteCount}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(issue.createdAt).toLocaleDateString()}</td>
                    
                    <td style={{ padding: '1rem' }}>
                      {editingId === issue.id ? (
                        <select className="form-select" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                          <option value="REPORTED">Reported</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      ) : (
                        <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {editingId === issue.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button onClick={() => handleStatusUpdate(issue.id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Save</button>
                          <button onClick={() => setEditingId(null)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <Link to={`/issue/${issue.id}`} className="btn" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                            <FaEye />
                          </Link>
                          <button onClick={() => startEditing(issue)} className="btn" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', padding: '0.4rem', borderRadius: '4px' }}>
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
