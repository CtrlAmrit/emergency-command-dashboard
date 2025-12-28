import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin' || location.pathname === '/'

  return (
    <nav className="top-navigation">
      <div className="role-switcher">
        <div className={`selector-slider ${isAdmin ? 'admin' : 'volunteer'}`} />
        <Link 
          to="/admin" 
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


