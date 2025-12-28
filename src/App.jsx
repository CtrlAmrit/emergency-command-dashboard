import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import AdminDashboard from './components/AdminDashboard'
import VolunteerDashboard from './components/VolunteerDashboard'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App



