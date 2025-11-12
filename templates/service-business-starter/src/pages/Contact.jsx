import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real implementation, this would send to a backend/email service
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p className="contact-tagline">
            Need help now? Call us directly. Have a question? Fill out the form below and we will get back to you ASAP.
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-cards">
          <div className="contact-card">
            <div className="contact-card-icon">📞</div>
            <h3>Call Us Now</h3>
            <p>For immediate assistance, call Anthony directly.</p>
            <a href="tel:+13132148805" className="contact-link">
              (313) 214-8805
            </a>
            <span className="contact-availability">Available 24/7/365</span>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">✉️</div>
            <h3>Email Us</h3>
            <p>For non-urgent inquiries or quotes.</p>
            <a href="mailto:turnpikerecovery@gmail.com" className="contact-link">
              turnpikerecovery@gmail.com
            </a>
            <span className="contact-availability">Response within 24 hours</span>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">📍</div>
            <h3>Service Area</h3>
            <p>Greater Cleveland & surrounding areas</p>
            <div className="service-areas">
              <span>Cleveland</span>
              <span>Parma</span>
              <span>Lakewood</span>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <p className="form-description">
            Fill out the form below and we will get back to you as soon as possible.
          </p>

          {submitted && (
            <div className="form-success">
              ✓ Thank you! Your message has been sent. We will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="service">Service Needed</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Select a service...</option>
                <option value="jumpstart">Emergency Jumpstart</option>
                <option value="tire">Flat Tire Change</option>
                <option value="lockout">Car Lockout</option>
                <option value="battery">Battery Replacement</option>
                <option value="fuel">Fuel Delivery</option>
                <option value="other">Other / Not Sure</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us about your situation or ask us a question..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="contact-cta">
        <div className="contact-cta-content">
          <h2>Need Help Right Now?</h2>
          <p>Don't wait for a callback—call us immediately for fast assistance.</p>
          <a href="tel:+13132148805" className="btn btn-primary btn-large">
            📞 Call (313) 214-8805 Now
          </a>
        </div>
      </section>
    </div>
  )
}
