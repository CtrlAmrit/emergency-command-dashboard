import { useNavigate } from 'react-router-dom';
import './ReportIncident.css';

export function ReportIncident() {
  const navigate = useNavigate();

  return (
    <div className="report-page">
      <div className="report-container">
        <header className="report-header">
          <button className="back-btn" onClick={() => navigate('/')}>← BACK</button>
          <h1>REPORT EMERGENCY</h1>
          <p>Submit critical incident data to Command Center</p>
        </header>

        <form className="report-form" onSubmit={(e) => {
          e.preventDefault();
          alert('Report submitted successfully to Command Center.');
          navigate('/');
        }}>
          <div className="form-group">
            <label>INCIDENT TYPE</label>
            <select required>
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
            <input type="text" placeholder="Enter address or landmark..." required />
          </div>

          <div className="form-group">
            <label>DESCRIPTION</label>
            <textarea placeholder="Describe the situation and immediate needs..." rows="4" required></textarea>
          </div>

          <div className="form-group">
            <label>CONTACT NUMBER (OPTIONAL)</label>
            <input type="tel" placeholder="+1 (555) 000-0000" />
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
