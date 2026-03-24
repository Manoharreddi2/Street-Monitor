import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons based on severity
const getIconForIssue = (issue) => {
  const color = issue.status === 'RESOLVED' ? 'green' 
             : issue.status === 'IN_PROGRESS' ? 'orange' 
             : 'red';
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const LocationSelector = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const MapFlyTo = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ issues = [], interactive = false, selectedLocation, onLocationSelect }) => {
  // Default center (Hyderabad, India)
  const defaultCenter = [17.3850, 78.4867];
  
  // Set center to first issue or selected location if provided
  const center = selectedLocation ? [selectedLocation.lat, selectedLocation.lng] 
               : issues.length > 0 ? [issues[0].latitude, issues[0].longitude] 
               : defaultCenter;

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <MapFlyTo center={center} />
        
        {/* Render interactive marker and event listener if in select mode */}
        {interactive && onLocationSelect && (
          <LocationSelector setLocation={onLocationSelect} />
        )}
        
        {interactive && selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}

        {/* Render existing issues */}
        {issues.map(issue => (
          <Marker 
            key={issue.id} 
            position={[issue.latitude, issue.longitude]}
            icon={getIconForIssue(issue)}
          >
            <Popup>
              <div style={{ padding: '0.25rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>{issue.title}</h3>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.75rem', 
                  background: 'var(--bg-dark)',
                  color: 'var(--primary-color)',
                  marginBottom: '0.5rem'
                }}>
                  {issue.type.replace('_', ' ')}
                </div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {issue.description?.substring(0, 60)}...
                </p>
                <Link to={`/issue/${issue.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: '100%' }}>
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
