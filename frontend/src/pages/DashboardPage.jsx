import { useState, useEffect } from 'react';
import { getIssues } from '../services/apiService';
import MapComponent from '../components/MapComponent';
import { FaFilter, FaList, FaMap } from 'react-icons/fa';

const DashboardPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    sort: 'date' // 'date' or 'votes'
  });

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await getIssues(filters);
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Control Bar */}
      <div className="glass-panel" style={{ 
        padding: '1rem', marginBottom: '1rem', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
      }}>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <FaFilter color="var(--primary-color)" />
          
          <select name="type" className="form-select" style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }} value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="POTHOLE">Pothole</option>
            <option value="ACCIDENT">Accident</option>
            <option value="TRAFFIC">Traffic</option>
            <option value="ROAD_DAMAGE">Road Damage</option>
            <option value="STREETLIGHT">Streetlight</option>
            <option value="FLOODING">Flooding</option>
            <option value="OTHER">Other</option>
          </select>
          
          <select name="status" className="form-select" style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }} value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select name="sort" className="form-select" style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }} value={filters.sort} onChange={handleFilterChange}>
            <option value="date">Newest First</option>
            <option value="votes">Most Voted</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setViewMode('map')}
            style={{ 
              padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
              background: viewMode === 'map' ? 'var(--primary-color)' : 'transparent',
              color: viewMode === 'map' ? 'white' : 'var(--text-muted)'
            }}
          >
            <FaMap /> Map
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
              background: viewMode === 'list' ? 'var(--primary-color)' : 'transparent',
              color: viewMode === 'list' ? 'white' : 'var(--text-muted)'
            }}
          >
            <FaList /> List
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              border: '3px solid rgba(255, 255, 255, 0.1)', borderTopColor: 'var(--primary-color)',
              animation: 'spin 1s linear infinite' 
            }} />
          </div>
        ) : viewMode === 'map' ? (
          <div style={{ height: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <MapComponent issues={issues} />
          </div>
        ) : (
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem', overflowY: 'auto', height: '100%', paddingBottom: '2rem' 
          }}>
            {issues.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No issues found matching your filters.
              </div>
            ) : (
              issues.map(issue => (
                <div key={issue.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      ▲ {issue.voteCount}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{issue.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
                    {issue.description?.substring(0, 100) || 'No description provided.'}
                    {issue.description?.length > 100 && '...'}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                    <a href={`/issue/${issue.id}`} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)' }}>
                      Details
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default DashboardPage;
