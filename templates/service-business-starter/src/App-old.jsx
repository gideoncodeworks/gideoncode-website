import './App.css'
import turnpikeLogo from './assets/turnpikelogo.png'

const stats = [
  {
    label: 'Average response',
    value: '20 min',
    detail: 'or less to reach you in the Greater Cleveland area',
  },
  { label: 'Availability', value: '24/7/365', detail: 'Always ready when you need us most' },
  { label: 'Service rating', value: '5-star', detail: 'Fast, friendly, and professional service' },
]

const services = [
  {
    title: 'Emergency Jumpstart Service',
    description: 'Dead battery killed your plans? We deliver rapid jumpstart service anywhere in Greater Cleveland. Get started in minutes, not hours.',
    badge: 'Most Popular',
  },
  {
    title: 'Flat Tire Change & Repair',
    description: 'Flat tire or blowout has you stranded? We bring the tools, expertise, and spare—emergency tire change service completed roadside in under 15 minutes.',
    badge: 'Fast Response',
  },
  {
    title: 'Car Lockout Service',
    description: 'Locked your keys in the car? Our professional lockout service gets you back in fast—no damage, no hassle, no judgment. Available 24/7.',
    badge: 'No Damage',
  },
  {
    title: 'Mobile Battery Replacement',
    description: 'Battery dead for good? We carry premium replacement batteries and install them on-site. Full mobile battery service—no tow truck needed.',
    badge: 'Same-Day',
  },
  {
    title: 'Emergency Fuel Delivery',
    description: 'Ran out of gas on the highway? We deliver emergency fuel directly to your location. Get back on the road without the walk of shame to the gas station.',
    badge: 'Lifesaver',
  },
]

const responseSteps = [
  {
    time: '0—2 min',
    title: 'Call us',
    detail: 'Speak directly to Anthony—no automated menus, no call centers. Just real help, fast.',
  },
  {
    time: '2—5 min',
    title: 'We are on the way',
    detail: 'Your location confirmed, service truck dispatched. We will keep you updated every step.',
  },
  {
    time: '5—20 min',
    title: 'We arrive',
    detail: 'Professional service tech arrives with tools, parts, and everything needed to get you moving.',
  },
  {
    time: '20—30 min',
    title: 'Back on the road',
    detail: 'Problem solved, payment handled, and you are safely back on your way.',
  },
]

const guarantees = [
  'Talk to Anthony directly—zero automated menus, zero hold time, zero runaround.',
  'Transparent pricing before we start—no surprise fees, no hidden charges, no games.',
  'Treated like family, not a case number—because roadside emergencies are stressful enough.',
  'Average 20-minute arrival time—because when you are stranded, every minute counts.',
]

function App() {
  return (
    <div className="page">
      <header className="hero panel">
        <div className="hero__content">
          <p className="eyebrow">24/7 EMERGENCY ROADSIDE ASSISTANCE • GREATER CLEVELAND</p>
          <h1>
            Stranded? Stuck? Out of luck?
            <span className="text-outline"> Not anymore.</span>
          </h1>
          <p className="lead">
            When your car breaks down, every second counts. Turnpike Recovery is Greater Cleveland's fastest response roadside assistance—
            delivering jumpstarts, tire changes, lockouts, battery replacement, and fuel delivery in 20 minutes or less. Real help. Real fast. No runaround.
          </p>
          <div className="actions">
            <a className="btn btn--primary" href="tel:+13132148805">
              Call for help now
            </a>
            <a className="btn btn--ghost" href="mailto:turnpikerecovery@gmail.com">
              Email us
            </a>
          </div>
          <div className="stat-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat">
                <span className="stat__value">{stat.value}</span>
                <span className="stat__label">{stat.label}</span>
                <p className="stat__detail">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__card panel panel--light">
          <img src={turnpikeLogo} alt="Turnpike Recovery logo" className="hero__logo" />
          <p className="hero__tagline">Your trusted roadside assistance partner in Greater Cleveland.</p>
          <div className="hero__hotline">
            <span>Emergency hotline</span>
            <a href="tel:+13132148805">(313) 214-8805</a>
            <small>Available 24/7, 365 days a year</small>
          </div>
          <ul className="hero__list">
            <li>Fast response times—usually 20 minutes or less</li>
            <li>Speak directly to Anthony, no call center runaround</li>
            <li>Upfront pricing with no hidden fees</li>
          </ul>
        </div>
      </header>

      <section className="section">
        <div className="section__header">
          <p className="eyebrow">Full-Service Roadside Assistance</p>
          <h2>From breakdown to back on the road—we handle it all.</h2>
          <p className="section__lead">
            Dead battery at 3 AM? Flat tire on I-90? Locked out at the grocery store? Turnpike Recovery is your 24/7 emergency
            roadside assistance partner in Cleveland, Parma, Lakewood, and surrounding areas. Professional service. Honest pricing. Lightning-fast response.
          </p>
        </div>
        <div className="card-grid">
          {services.map((service) => (
            <article key={service.title} className="card panel">
              <span className="badge">{service.badge}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--about">
        <div className="section__header">
          <p className="eyebrow">About Anthony & Turnpike Recovery</p>
          <h2>Real help from a real person—not a call center robot.</h2>
        </div>
        <div className="about-content panel panel--light">
          <div className="about-text">
            <p>
              Hey there, I am Anthony—owner, operator, and the guy who will actually answer when you call. I have spent years helping stranded drivers across Greater Cleveland get back on the road, and I treat every customer like they are family having a rough day.
            </p>
            <p>
              Here is what makes Turnpike Recovery different: When you call us at 3 AM with a dead battery or at rush hour with a flat tire, you are talking directly to me. No phone tree. No hold music. No dispatch center in another state. Just a local Cleveland guy with a truck full of tools, ready to help you out of a jam.
            </p>
            <p>
              I know how stressful car trouble can be. That is why I promise honest pricing, lightning-fast response times, and the kind of friendly service that makes a bad situation just a little bit better. Whether you are stuck on I-90, stranded in a parking lot, or broken down in your driveway—I have got you.
            </p>
            <div className="about-cta">
              <a className="btn btn--primary" href="tel:+13132148805">
                Call Anthony directly: (313) 214-8805
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section panel panel--timeline">
        <div className="section__header section__header--compact">
          <p className="eyebrow">How it works</p>
          <h2>From your call to back on the road.</h2>
        </div>
        <ol className="timeline">
          {responseSteps.map((step) => (
            <li key={step.title} className="timeline__item">
              <span className="timeline__time">{step.time}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--guarantee">
        <div className="panel panel--contrast">
          <p className="eyebrow eyebrow--light">Our Promise</p>
          <h2>Reliable, honest, and always there when you need us.</h2>
          <ul className="guarantee-list">
            {guarantees.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="assurance">
            <p>Need roadside assistance right now?</p>
            <a href="tel:+13132148805" className="btn btn--inverse">
              Call (313) 214-8805
            </a>
          </div>
        </div>
      </section>

      <section className="section section--contact">
        <div className="section__header">
          <p className="eyebrow">Contact Us</p>
          <h2>We are here 24/7—ready when you need us.</h2>
          <p className="section__lead">
            Save our contact information now so you are prepared when roadside trouble strikes.
            We are always just one call away.
          </p>
        </div>
        <div className="contact-grid">
          <div className="contact-card panel panel--light">
            <h3>Emergency Hotline</h3>
            <p>Call anytime, day or night. Anthony answers personally.</p>
            <a className="contact-link" href="tel:+13132148805">
              <strong>(313) 214-8805</strong>
            </a>
            <a className="btn btn--primary" href="tel:+13132148805">
              Call now
            </a>
          </div>
          <div className="contact-card panel panel--light">
            <h3>Email Us</h3>
            <p>For non-urgent questions, quotes, or general inquiries.</p>
            <a className="contact-link" href="mailto:turnpikerecovery@gmail.com">
              <strong>turnpikerecovery@gmail.com</strong>
            </a>
            <a className="btn btn--ghost" href="mailto:turnpikerecovery@gmail.com">
              Send email
            </a>
          </div>
          <div className="contact-card panel panel--light">
            <h3>Service Area</h3>
            <p>Proudly serving Greater Cleveland and surrounding areas.</p>
            <p className="contact-detail">
              <strong>Available 24/7/365</strong><br />
              Fast response times—usually 20 minutes or less
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
