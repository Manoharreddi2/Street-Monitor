import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../services/apiService';
import MapComponent from '../components/MapComponent';
import { FaMapPin, FaCamera, FaInfoCircle, FaCheck } from 'react-icons/fa';

const ReportIssuePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'POTHOLE',
    severity: 1,
    imageData: ''
  });
  
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file is too large. Please select an image under 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageData: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, imageData: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Please select a location on the map');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createIssue({
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
        severity: parseInt(formData.severity)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Report an Issue</h1>
      
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', 
          color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Map Selection */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaMapPin color="var(--primary-color)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>1. Location</h2>
            </div>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                      setError('');
                    },
                    (err) => {
                      setError("Could not access your location. Please check browser permissions.");
                    }
                  );
                } else {
                  setError("Geolocation is not supported by this browser.");
                }
              }}
            >
              📍 Locate Me
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Click on the map to drop a pin exactly where the issue is.
          </p>
          
          <div style={{ 
            flex: 1, minHeight: '400px', borderRadius: '12px', overflow: 'hidden', 
            border: location ? '2px solid var(--success)' : '1px solid var(--glass-border)' 
          }}>
            <MapComponent 
              interactive={true} 
              onLocationSelect={setLocation} 
              selectedLocation={location}
            />
          </div>
          
          {location && (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.875rem', fontWeight: 500 }}>
              <FaCheck /> Location Selected ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
            </div>
          )}
        </div>

        {/* Right Side: Issue Form */}
        <form className="glass-panel" style={{ padding: '1.5rem' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FaInfoCircle color="var(--secondary-color)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>2. Details</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Issue Type</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleInputChange} required>
              <option value="POTHOLE">Pothole</option>
              <option value="ACCIDENT">Accident</option>
              <option value="TRAFFIC">Traffic</option>
              <option value="ROAD_DAMAGE">Road Damage</option>
              <option value="STREETLIGHT">Broken Streetlight</option>
              <option value="FLOODING">Flooding</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" name="title" className="form-input" 
              placeholder="E.g., Large pothole in right lane"
              value={formData.title} onChange={handleInputChange} required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea name="description" className="form-textarea" rows="3"
              placeholder="Provide more details about the issue..."
              value={formData.description} onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Severity Level ({formData.severity}/5)</label>
            <input type="range" name="severity" min="1" max="5" 
              style={{ width: '100%', accentColor: 'var(--primary-color)' }}
              value={formData.severity} onChange={handleInputChange}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <span>Minor</span>
              <span>Extreme</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Photo Evidence (Optional)</label>
            {!formData.imageData ? (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '2rem', border: '2px dashed var(--glass-border)', borderRadius: '8px',
                cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.3s'
              }} className="hover:border-[var(--primary-color)]">
                <FaCamera size={32} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem' }}>Click to upload image</span>
                <input type="file" accept="image/*" onChange={handleImageCapture} style={{ display: 'none' }} />
              </label>
            ) : (
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={formData.imageData} alt="Issue evidence" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <button type="button" onClick={clearImage} style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)',
                  color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer'
                }}>×</button>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
      
      {/* Mobile responsiveness handling */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .glass-panel { padding: 1rem !important; }
          div[style*="gridTemplateColumns"] { gridTemplateColumns: '1fr' !important; }
        }
      `}} />
    </div>
  );
};

export default ReportIssuePage;
