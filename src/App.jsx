import EscapeScorecard from './EscapeScorecard.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Story />
        <Content />
        <ScorecardSection />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#hero" className="nav-name">Christian Brooks</a>
        <ul className="nav-links">
          <li><a href="#story">Story</a></li>
          <li><a href="#content">Content</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="section-inner">
        <span className="hero-eyebrow">christianbrooks.co</span>
        <h1>Christian Brooks</h1>
        <p className="hero-subline">Husband. Father. Follower of Jesus.</p>
        <div className="hero-divider" />
        <p className="hero-body">
          I spent years thinking I wasn't the type of person who could build
          something of my own. Turns out I was wrong. I'm an IT manager documenting
          the real process of building digital income on the side. Not the highlight
          reel. The wins, the pivots, the slow weeks, all of it.
        </p>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="story" id="story">
      <div className="section-inner">
        <p className="section-label">My story</p>
        <h2 className="section-heading">How I got here</h2>
        <div className="section-body">
          <p>
            For a long time I told myself the same thing a lot of people tell
            themselves. That building something of your own was for other people.
            People with more time, more money, more experience. Not someone with a
            full-time job, a family, and a mortgage.
          </p>
          <p>
            Then I started making videos. Something I wanted to do since I was a kid
            but talked myself out of because I didn't have credentials. Turns out you
            don't need credentials. You need a camera and something real to say.
          </p>
          <p>
            I'm not at the finish line. I'm in the middle of it. But I'm further than
            I was. And that's the point.
          </p>
        </div>
      </div>
    </section>
  )
}

function Content() {
  const columns = [
    {
      icon: '💡',
      title: 'Digital Income',
      desc: 'Building assets that can earn without trading more hours',
    },
    {
      icon: '⚙️',
      title: 'AI Tools',
      desc: 'Using AI to move faster without losing your voice',
    },
    {
      icon: '🚪',
      title: 'The Exit Strategy',
      desc: 'Building a bridge before you burn one',
    },
  ]

  return (
    <section className="content-section" id="content">
      <div className="section-inner-wide">
        <div className="content-intro section-inner">
          <p className="section-label">What I create</p>
          <h2 className="section-heading">What I'm building</h2>
          <div className="section-body">
            <p>
              Content about building digital income while working a 9-5. Using AI
              as a real tool, not a magic button. Finding your way out of a job
              you've outgrown, on your own terms, not out of desperation.
            </p>
            <p>
              No hype. No "I made $10K in 30 days." Just the real process from
              someone who is still in it.
            </p>
          </div>
        </div>
        <div className="columns">
          {columns.map((col) => (
            <div className="column-card" key={col.title}>
              <span className="column-icon" role="img" aria-label={col.title}>{col.icon}</span>
              <p className="column-title">{col.title}</p>
              <p className="column-desc">{col.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScorecardSection() {
  return (
    <section className="scorecard-section" id="scorecard">
      <div className="section-inner">
        <p className="section-label">Self-assessment</p>
        <h2 className="section-heading">Not sure where you are? Find out in 3 minutes.</h2>
        <EscapeScorecard />
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-inner">
        <p className="section-label">Partnerships</p>
        <h2 className="section-heading">Work with me</h2>
        <div className="section-body">
          <p>
            I create content for an audience of corporate professionals building
            toward their first digital income stream. If you have a product or
            service that genuinely helps that person, I'd love to hear from you.
          </p>
        </div>
        <div className="contact-email">
          <span className="contact-email-icon" aria-hidden="true">✉</span>
          <a href="mailto:partnerships@christianbrooks.co">
            partnerships@christianbrooks.co
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <p className="footer-copy">© 2026 Christian Brooks · christianbrooks.co</p>
        <p className="footer-tagline">Built in public. Faith over fear.</p>
      </div>
    </footer>
  )
}
