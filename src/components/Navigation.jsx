import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  
  // Hide navigation on EntryPage and ReportIncident page
  if (location.pathname === '/' || location.pathname === '/report') {
    return null
  }

  const isAdmin = location.pathname === '/command'

  return (
    <nav className="top-navigation">
      <div className="role-switcher">
        <div className={`selector-slider ${isAdmin ? 'admin' : 'volunteer'}`} />
        <Link 
          to="/command" 
          className={`role-option ${isAdmin ? 'active' : ''}`}
        >
          <span className="role-icon">◈</span>
          Command Center (Admin)
        </Link>
          <Link 
            to="/volunteer" 
            className={`role-option ${!isAdmin ? 'active' : ''}`}
          >
            <span className="role-icon">✦</span>
            Volunteer
          </Link>
      </div>
    </nav>
  )
}

export default Navigation


