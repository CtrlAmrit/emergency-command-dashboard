import { useNavigate } from 'react-router-dom';
import './EntryPage.css';

export function EntryPage() {
  const navigate = useNavigate();

  return (
    <div className="entry-page">
      <div className="entry-container">
        <header className="entry-header">
          <h1 className="brand-logo">CONFLUENCE</h1>
          <p className="brand-subtitle">Emergency Coordination & Response Platform</p>
        </header>

        <div className="role-selection">
          <button 
            className="role-card citizen"
            onClick={() => navigate('/report')}
          >
            <div className="role-icon">📢</div>
            <div className="role-content">
              <h3>Citizen</h3>
              <p>Report an incident or request emergency assistance</p>
            </div>
            <div className="role-action">REPORT INCIDENT →</div>
          </button>

          <button 
            className="role-card volunteer"
            onClick={() => navigate('/volunteer')}
          >
            <div className="role-icon">✦</div>
            <div className="role-content">
              <h3>Volunteer</h3>
              <p>Access volunteer dashboard and coordination tools</p>
            </div>
            <div className="role-action">GO TO DASHBOARD →</div>
          </button>

          <button 
            className="role-card command"
            onClick={() => navigate('/admin')}
          >
            <div className="role-icon">◈</div>
            <div className="role-content">
              <h3>Command Center</h3>
              <p>Professional incident management and unit dispatch</p>
            </div>
            <div className="role-action">ADMIN LOGIN →</div>
          </button>
        </div>

        <footer className="entry-footer">
          <p>© 2025 CONFLUENCE. Operational Status: <span className="status-online">● ONLINE</span></p>
        </footer>
      </div>
    </div>
  );
}
