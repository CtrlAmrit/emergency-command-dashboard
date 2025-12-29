import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AdminDashboard from './components/AdminDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import { EntryPage } from './components/EntryPage';
import { ReportIncident } from './components/ReportIncident';
import { IncidentProvider } from './IncidentContext';

export function App() {
  return (
    <IncidentProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/command" element={<AdminDashboard />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </IncidentProvider>
  );
}

export default App;
