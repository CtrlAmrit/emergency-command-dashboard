import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="top-navigation">
      <Link 
        to="/admin" 
        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
      >
        Admin View
      </Link>
      <Link 
        to="/volunteer" 
        className={`nav-link ${location.pathname === '/volunteer' ? 'active' : ''}`}
      >
        Volunteer View
      </Link>
    </nav>
  )
}

export default Navigation


