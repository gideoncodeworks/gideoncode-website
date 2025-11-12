import { Link, useLocation } from 'react-router-dom'
import turnpikeLogo from '../assets/turnpikelogo.png'
import './Navigation.css'

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={turnpikeLogo} alt="Turnpike Recovery" />
          <span className="nav-brand">Turnpike Recovery</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link
            to="/services"
            className={location.pathname.startsWith('/services') ? 'nav-link active' : 'nav-link'}
          >
            Services
          </Link>
          <Link
            to="/about"
            className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}
          >
            Contact
          </Link>
          <a href="tel:+13132148805" className="nav-cta">
            Call Now
          </a>
        </div>
      </div>
    </nav>
  )
}
