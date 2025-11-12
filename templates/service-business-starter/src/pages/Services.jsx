import { Link } from 'react-router-dom'
import './Services.css'

export default function Services() {
  const services = [
    {
      id: 'jumpstart',
      icon: '⚡',
      title: 'Emergency Jumpstart Service',
      description: 'Dead battery killed your plans? We deliver rapid jumpstart service anywhere in Greater Cleveland. Get started in minutes, not hours.',
      features: [
        'Fast 20-minute response time',
        'Professional battery testing',
        'Works on all vehicle types',
        'Available 24/7/365',
      ],
    },
    {
      id: 'tire',
      icon: '🛞',
      title: 'Flat Tire Change & Repair',
      description: 'Flat tire or blowout has you stranded? We bring the tools, expertise, and spare—emergency tire change service completed roadside in under 15 minutes.',
      features: [
        'Quick roadside tire change',
        'Emergency tire repair when possible',
        'Spare tire installation',
        'All vehicle types serviced',
      ],
    },
    {
      id: 'lockout',
      icon: '🔑',
      title: 'Car Lockout Service',
      description: 'Locked your keys in the car? Our professional lockout service gets you back in fast—no damage, no hassle, no judgment. Available 24/7.',
      features: [
        'Non-destructive entry methods',
        'No damage to your vehicle',
        'Fast response time',
        'Works on most vehicle makes/models',
      ],
    },
    {
      id: 'battery',
      icon: '🔋',
      title: 'Mobile Battery Replacement',
      description: 'Battery dead for good? We carry premium replacement batteries and install them on-site. Full mobile battery service—no tow truck needed.',
      features: [
        'Quality replacement batteries in stock',
        'On-site installation',
        'Battery testing included',
        'Warranty on new batteries',
      ],
    },
    {
      id: 'fuel',
      icon: '⛽',
      title: 'Emergency Fuel Delivery',
      description: 'Ran out of gas on the highway? We deliver emergency fuel directly to your location. Get back on the road without the walk of shame to the gas station.',
      features: [
        'Fast fuel delivery service',
        'Enough gas to get you to a station',
        'Available anywhere in service area',
        'Quick turnaround time',
      ],
    },
  ]

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-content">
          <h1>Our Roadside Assistance Services</h1>
          <p className="services-lead">
            Professional, fast, and reliable emergency roadside assistance for every situation.
            When you are stranded, we are there—20 minutes or less, guaranteed.
          </p>
          <a href="tel:+13132148805" className="btn btn-primary btn-large">
            📞 Call for Immediate Help
          </a>
        </div>
      </section>

      <section className="services-list">
        {services.map((service) => (
          <div key={service.id} id={service.id} className="service-detail">
            <div className="service-detail-icon">{service.icon}</div>
            <div className="service-detail-content">
              <h2>{service.title}</h2>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <a href="tel:+13132148805" className="btn btn-secondary">
                Call for This Service
              </a>
            </div>
          </div>
        ))}
      </section>

      <section className="services-cta-section">
        <div className="services-cta-content">
          <h2>Not Sure Which Service You Need?</h2>
          <p>Call us and describe your situation. We will help you figure out exactly what you need.</p>
          <div className="services-cta-buttons">
            <a href="tel:+13132148805" className="btn btn-primary btn-large">
              📞 Call (313) 214-8805
            </a>
            <Link to="/contact" className="btn btn-secondary btn-large">
              Send Us a Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
