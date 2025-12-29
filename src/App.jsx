import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import VolunteerDashboard from './components/VolunteerDashboard.jsx';
import { EntryPage } from './components/EntryPage.jsx';
import { ReportIncident } from './components/ReportIncident.jsx';
import { IncidentProvider } from './IncidentContext.jsx';

export function App() {
  return (
    <IncidentProvider>
      <HashRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/command" element={<AdminDashboard />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </IncidentProvider>
  );
}

export default App;
