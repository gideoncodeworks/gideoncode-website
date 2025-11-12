import { Link } from 'react-router-dom'
import turnpikeLogo from '../assets/turnpikelogo.png'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Turnpike Recovery</h1>
          <p className="about-tagline">Real help from a real person—not a call center robot.</p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-content">
          <img src={turnpikeLogo} alt="Turnpike Recovery" className="about-logo" />
          <div className="about-text">
            <h2>Meet Anthony</h2>
            <p>
              Hey there, I am Anthony—owner, operator, and the guy who will actually answer when you call.
              I have spent years helping stranded drivers across Greater Cleveland get back on the road, and
              I treat every customer like they are family having a rough day.
            </p>
            <p>
              Here is what makes Turnpike Recovery different: When you call us at 3 AM with a dead battery
              or at rush hour with a flat tire, you are talking directly to me. No phone tree. No hold music.
              No dispatch center in another state. Just a local Cleveland guy with a truck full of tools,
              ready to help you out of a jam.
            </p>
            <p>
              I know how stressful car trouble can be. That is why I promise honest pricing, lightning-fast
              response times, and the kind of friendly service that makes a bad situation just a little bit better.
              Whether you are stuck on I-90, stranded in a parking lot, or broken down in your driveway—I have got you.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h3>Fast & Reliable</h3>
            <p>Average 20-minute response time because when you are stranded, every minute counts.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💯</div>
            <h3>Honest & Transparent</h3>
            <p>Upfront pricing with no hidden fees. You will know the cost before we start any work.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Personal Touch</h3>
            <p>Talk directly to Anthony. No automated systems, no call centers—just real help from a real person.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🛡️</div>
            <h3>Professional Service</h3>
            <p>Treated like family, not a case number. We are local, trusted, and here to help.</p>
          </div>
        </div>
      </section>

      <section className="about-guarantee">
        <div className="guarantee-content">
          <h2>The Turnpike Recovery Guarantee</h2>
          <ul className="guarantee-list">
            <li>✓ Talk to Anthony directly—zero automated menus, zero hold time, zero runaround</li>
            <li>✓ Transparent pricing before we start—no surprise fees, no hidden charges, no games</li>
            <li>✓ Treated like family, not a case number—because roadside emergencies are stressful enough</li>
            <li>✓ Average 20-minute arrival time—because when you are stranded, every minute counts</li>
          </ul>
          <div className="guarantee-cta">
            <a href="tel:+13132148805" className="btn btn-primary btn-large">
              📞 Call Anthony: (313) 214-8805
            </a>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to Experience the Difference?</h2>
        <p>Whether you need help right now or just want to save our number for when you do, we are here 24/7.</p>
        <div className="about-cta-buttons">
          <a href="tel:+13132148805" className="btn btn-primary btn-large">
            Call Now
          </a>
          <Link to="/contact" className="btn btn-secondary btn-large">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
