import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import AdminDashboard from './components/AdminDashboard'
import VolunteerDashboard from './components/VolunteerDashboard'
import { EntryPage } from './components/EntryPage'
import { ReportIncident } from './components/ReportIncident'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/command" element={<AdminDashboard />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App



