import { Link } from 'react-router-dom'
import turnpikeLogo from '../assets/turnpikelogo.png'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <img src={turnpikeLogo} alt="Turnpike Recovery" className="footer-logo" />
          <p className="footer-tagline">
            Greater Cleveland's trusted 24/7 emergency roadside assistance partner.
          </p>
          <div className="footer-emergency">
            <span>Emergency Hotline</span>
            <a href="tel:+13132148805">(313) 214-8805</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Anthony</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Our Services</h4>
          <ul className="footer-links">
            <li><Link to="/services/jumpstart">Emergency Jumpstart</Link></li>
            <li><Link to="/services/tire-change">Flat Tire Change</Link></li>
            <li><Link to="/services/lockout">Car Lockout Service</Link></li>
            <li><Link to="/services/battery">Mobile Battery Replacement</Link></li>
            <li><Link to="/services/fuel-delivery">Emergency Fuel Delivery</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Service Area</h4>
          <p>Proudly serving Greater Cleveland and surrounding areas including:</p>
          <ul className="footer-areas">
            <li>Cleveland</li>
            <li>Parma</li>
            <li>Lakewood</li>
            <li>And more</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Turnpike Recovery, LLC. All rights reserved.</p>
        <p className="footer-credit">
          Website by <a href="https://gideoncodeworks.com" target="_blank" rel="noopener noreferrer">Gideon Codeworks</a>
        </p>
      </div>
    </footer>
  )
}
