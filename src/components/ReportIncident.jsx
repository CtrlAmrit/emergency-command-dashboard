import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useIncidents } from '../IncidentContext';
import './ReportIncident.css';

export function ReportIncident() {
  const navigate = useNavigate();
  const { addIncident } = useIncidents();
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    description: '',
    contact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const incidentTypeMap = {
      medical: 'Medical Emergency',
      fire: 'Fire Alert',
      flood: 'Flood Emergency',
      structural: 'Structural Damage',
      other: 'Other Crisis'
    };

    addIncident({
      type: incidentTypeMap[formData.type] || 'Emergency',
      location: formData.location,
      summary: formData.description,
      severity: 'High' // Default for citizen reports
    });

    alert('Report submitted successfully to Command Center.');
    navigate('/');
  };

  return (
    <div className="report-page">
      <div className="report-container">
        <header className="report-header">
          <button className="back-btn" onClick={() => navigate('/')}>← BACK</button>
          <h1>REPORT EMERGENCY</h1>
          <p>Submit critical incident data to Command Center</p>
        </header>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>INCIDENT TYPE</label>
            <select 
              required 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="">Select type...</option>
              <option value="medical">Medical Emergency</option>
              <option value="fire">Fire / Smoke</option>
              <option value="flood">Flash Flood</option>
              <option value="structural">Structural Damage</option>
              <option value="other">Other Crisis</option>
            </select>
          </div>

          <div className="form-group">
            <label>LOCATION</label>
            <input 
              type="text" 
              placeholder="Enter address or landmark..." 
              required 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>DESCRIPTION</label>
            <textarea 
              placeholder="Describe the situation and immediate needs..." 
              rows="4" 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="form-group">
            <label>CONTACT NUMBER (OPTIONAL)</label>
            <input 
              type="tel" 
              placeholder="+1 (555) 000-0000" 
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
            />
          </div>

          <button type="submit" className="submit-report-btn">SUBMIT REPORT</button>
        </form>

        <div className="emergency-notice">
          <p>FOR IMMEDIATE LIFE THREATS, ALWAYS CALL LOCAL EMERGENCY SERVICES FIRST.</p>
        </div>
      </div>
    </div>
  );
}
