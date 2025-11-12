import { Link } from 'react-router-dom'
import turnpikeLogo from '../assets/turnpikelogo.png'
import './Home.css'

export default function Home() {
  const stats = [
    { value: '20 min', label: 'Average response', detail: 'or less to reach you' },
    { value: '24/7/365', label: 'Availability', detail: 'Always ready' },
    { value: '5-star', label: 'Service rating', detail: 'Professional service' },
  ]

  const services = [
    { title: 'Emergency Jumpstart', icon: '⚡', link: '/services#jumpstart' },
    { title: 'Flat Tire Change', icon: '🛞', link: '/services#tire' },
    { title: 'Car Lockout Service', icon: '🔑', link: '/services#lockout' },
    { title: 'Battery Replacement', icon: '🔋', link: '/services#battery' },
    { title: 'Fuel Delivery', icon: '⛽', link: '/services#fuel' },
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">24/7 EMERGENCY ROADSIDE ASSISTANCE</p>
          <h1>
            Stranded? Stuck?
            <br />
            <span className="text-highlight">Help is 20 minutes away.</span>
          </h1>
          <p className="hero-lead">
            Greater Cleveland's fastest emergency roadside assistance. When your car breaks down, every second counts.
            We deliver jumpstarts, tire changes, lockouts, battery replacement, and fuel delivery—fast.
          </p>
          <div className="hero-actions">
            <a href="tel:+13132148805" className="btn btn-primary btn-large">
              📞 Call (313) 214-8805
            </a>
            <Link to="/contact" className="btn btn-secondary btn-large">
              Get a Quote
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <img src={turnpikeLogo} alt="Turnpike Recovery" className="hero-logo" />
          <div className="hero-phone">
            <span>Emergency Hotline</span>
            <a href="tel:+13132148805">(313) 214-8805</a>
          </div>
          <ul className="hero-features">
            <li>✓ Talk directly to Anthony—no call centers</li>
            <li>✓ 20-minute average response time</li>
            <li>✓ Upfront pricing, no hidden fees</li>
            <li>✓ Available 24/7, 365 days a year</li>
          </ul>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-detail">{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="services-preview">
        <div className="section-header">
          <p className="eyebrow">What We Do</p>
          <h2>Full-Service Roadside Assistance</h2>
          <p className="section-lead">
            From dead batteries to flat tires, we handle every roadside emergency with speed and professionalism.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <Link key={index} to={service.link} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
            </Link>
          ))}
        </div>
        <div className="services-cta">
          <Link to="/services" className="btn btn-primary">
            View All Services →
          </Link>
        </div>
      </section>

      <section className="why-section">
        <div className="why-content">
          <h2>Why Choose Turnpike Recovery?</h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>🎯 Fast Response</h3>
              <p>Average 20-minute arrival time. When you are stranded, every minute counts.</p>
            </div>
            <div className="why-card">
              <h3>💯 No Runaround</h3>
              <p>Talk directly to Anthony. No automated menus, no hold time, no call centers.</p>
            </div>
            <div className="why-card">
              <h3>💰 Transparent Pricing</h3>
              <p>Upfront pricing before we start. No surprise fees, no hidden charges.</p>
            </div>
            <div className="why-card">
              <h3>🛡️ Professional Service</h3>
              <p>Treated like family, not a case number. Local, trusted, and reliable.</p>
            </div>
          </div>
          <div className="why-cta">
            <Link to="/about" className="btn btn-secondary">
              Learn More About Anthony →
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Need Help Right Now?</h2>
          <p>Don't wait—call us immediately for fast, professional roadside assistance.</p>
          <a href="tel:+13132148805" className="btn btn-primary btn-large">
            📞 Call (313) 214-8805 Now
          </a>
          <p className="cta-note">Available 24/7 • Greater Cleveland & Surrounding Areas</p>
        </div>
      </section>
    </div>
  )
}
