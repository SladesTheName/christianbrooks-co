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
      <div className="section-inner-wide">
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="hero-eyebrow">christianbrooks.co</span>
            <h1>Christian <em>Brooks</em></h1>
            <p className="hero-subline">Husband. Father. Follower of Jesus.</p>
            <div className="hero-divider" />
            <p className="hero-body">
              I spent years thinking I wasn't the type of person who could build
              something of my own. Turns out I was wrong. I'm an IT manager documenting
              the real process of building digital income on the side. Not the highlight
              reel. The wins, the pivots, the slow weeks, all of it.
            </p>
          </div>
          <div className="hero-portrait-wrap">
            <div className="hero-portrait-frame" aria-hidden="true" />
            <div className="hero-portrait">
              <img
                src="/christian-headshot.jpg"
                alt="Christian Brooks"
                loading="eager"
              />
            </div>
            <p className="hero-caption">Building in public</p>
          </div>
        </div>
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
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.1 1 1.8V18h6v-1.5c0-.7.4-1.3 1-1.8A7 7 0 0 0 12 2z" />
        </svg>
      ),
      title: 'Digital Income',
      desc: 'Building assets that can earn without trading more hours',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      ),
      title: 'AI Tools',
      desc: 'Using AI to move faster without losing your voice',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 4h3a2 2 0 0 1 2 2v14" />
          <path d="M2 20h20" />
          <path d="M13 20V4L6 6v14" />
          <circle cx="9" cy="13" r="0.5" fill="currentColor" />
        </svg>
      ),
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
              <span className="column-icon" aria-hidden="true">{col.icon}</span>
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
