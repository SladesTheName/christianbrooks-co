import { useState } from 'react'
import EscapeScorecard from './EscapeScorecard.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Story />
        <Building />
        <Portfolio />
        <ScorecardSection />
        <Resources />
        <Work />
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
          <li><a href="#resources">Resources</a></li>
          <li><a href="#work">Work with me</a></li>
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
              something of my own. Turns out I was wrong. I'm a corporate manager,
              veteran, and father documenting what it actually looks like to build
              toward freedom - without burning down what matters in the process.
              The wins, the failures, the faith, and the weight of doing it all
              at once.
            </p>
            <div className="hero-ctas">
              <a href="#scorecard" className="btn btn-gold">Take the Escape Scorecard</a>
              <a href="#content" className="btn btn-outline">See my work</a>
            </div>
          </div>
          <div className="hero-portrait-wrap">
            <div className="hero-portrait">
              <img
                src="/christian-headshot.jpg"
                alt="Christian Brooks"
                loading="eager"
              />
            </div>
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
            Then I started making videos. Something I wanted to do since I was a
            kid but talked myself out of because I didn't have credentials. I also
            tried a sticker business, Amazon FBA, children's books, an AI
            automation agency, affiliate marketing - I've got a longer list of
            failures than most people have attempts. But each one taught me
            something. And eventually I picked up a camera and realized I didn't
            need credentials. I needed something real to say.
          </p>
          <p>
            I'm not at the finish line. I'm in the middle of it - still at the
            corporate desk, still figuring it out, still leaning on my faith when
            I don't know what's next. But I'm further than I was. And that's the
            point.
          </p>
        </div>
      </div>
    </section>
  )
}

function Building() {
  const columns = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5" fill="currentColor" stroke="none" />
        </svg>
      ),
      title: 'The Honest Middle',
      desc: "What nobody tells you about building something while still showing up at the 9-5.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3c0 0 -3.5 3.5 -3.5 8a3.5 3.5 0 0 0 7 0c0 -3 -2 -5 -3.5 -8z" />
          <path d="M12 14c0 0 -1.5 1.5 -1.5 3.5a1.5 1.5 0 0 0 3 0c0 -1.5 -1 -2.5 -1.5 -3.5z" fill="currentColor" stroke="none" />
        </svg>
      ),
      title: 'Faith + Ambition',
      desc: "Wrestling with whether what you're building honors God, your family, and your purpose.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 17 L3 13 Q 12 6 21 13 L21 17" />
          <line x1="3" y1="17" x2="21" y2="17" />
          <line x1="7" y1="13.5" x2="7" y2="17" />
          <line x1="17" y1="13.5" x2="17" y2="17" />
          <line x1="12" y1="10" x2="12" y2="17" />
        </svg>
      ),
      title: 'The Exit Strategy',
      desc: 'Building a bridge before you burn one.',
    },
  ]

  return (
    <section className="content-section" id="building">
      <div className="section-inner-wide">
        <div className="content-intro section-inner">
          <p className="section-label">What I create</p>
          <h2 className="section-heading">What I'm building</h2>
          <div className="section-body">
            <p>
              Content about building toward freedom while working a full-time
              corporate job. The emotional weight of it. The real mechanics of it.
              The faith required for it. No hype. No "I made $10K in 30 days."
              Just the honest process from someone who's still in it.
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

function Portfolio() {
  return (
    <section className="portfolio" id="content">
      <div className="section-inner-wide">
        <div className="content-intro section-inner">
          <p className="section-label">Content</p>
          <h2 className="section-heading">Where to find me</h2>
        </div>

        <div className="brand-cards">
          <article className="brand-card">
            <header className="brand-head">
              <h3 className="brand-handle">@officialchristianbrooks</h3>
              <p className="brand-tag">Personal brand</p>
            </header>
            <p className="brand-desc">
              Faith, fatherhood, corporate life, and building toward freedom.
            </p>
            <dl className="brand-stats">
              <div>
                <dt>Followers</dt>
                <dd>7,000+</dd>
              </div>
              <div>
                <dt>Views</dt>
                <dd>20,000,000+</dd>
              </div>
            </dl>
            <div className="brand-links">
              <a href="https://instagram.com/officialchristianbrooks" target="_blank" rel="noopener noreferrer">
                Instagram <span aria-hidden="true">{'\u2192'}</span>
              </a>
            </div>
          </article>

          <article className="brand-card">
            <header className="brand-head">
              <h3 className="brand-handle">@everycorporatever</h3>
              <p className="brand-tag">Corporate humor</p>
            </header>
            <p className="brand-desc">
              If you've ever stared at a meeting invite and questioned your life
              choices, this is for you.
            </p>
            <p className="brand-note">
              Currently producing 60 reels a month in partnership with Deel.
            </p>
            <div className="brand-links">
              <a href="https://instagram.com/everycorporatever" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://tiktok.com/@everycorporatever" target="_blank" rel="noopener noreferrer">TikTok</a>
              <a href="https://youtube.com/@everycorporatever" target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </article>
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

function Resources() {
  return (
    <section className="resources" id="resources">
      <div className="section-inner-wide">
        <div className="content-intro section-inner">
          <p className="section-label">Resources</p>
          <h2 className="section-heading">Tools I've built</h2>
        </div>

        <div className="resource-list">
          <article className="resource-card">
            <div className="resource-flag">Coming soon</div>
            <h3 className="resource-title">Build Without Breaking</h3>
            <p className="resource-desc">
              A guide for men building toward freedom without breaking their
              family, their faith, or themselves in the process. Honest
              frameworks. Real talk. No guru nonsense.
            </p>
            <WaitlistForm />
          </article>

          <article className="resource-card">
            <div className="resource-flag resource-flag-live">Available</div>
            <h3 className="resource-title">Audience Ignition Guide</h3>
            <p className="resource-desc">
              The emotional mirroring framework behind 20M+ views in under 30 days.
            </p>
            <a
              className="btn btn-gold resource-cta"
              href="https://christianbrooks.gumroad.com/l/itdnrm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get the guide
            </a>
          </article>

          <article className="resource-card resource-card-affiliate">
            <h3 className="resource-title">Tools I actually use</h3>
            <ul className="affiliate-list">
              <li>
                <a href="https://forge-wallet.com/discount/BROOKS" target="_blank" rel="noopener noreferrer">
                  <span className="affiliate-name">Forge Wallet</span>
                  <span className="affiliate-desc">Minimalist wallet I carry every day. Code BROOKS for a discount.</span>
                </a>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'waitlist-bwb' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong.')
      }
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="waitlist-success">
        You're on the list. I'll email you the minute it's ready.
      </p>
    )
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit}>
      <div className="waitlist-fields">
        <input
          type="text"
          placeholder="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="First name"
        />
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
        />
      </div>
      <button
        type="submit"
        className="btn btn-outline waitlist-btn"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Adding you...' : 'Join the waitlist'}
      </button>
      {errorMsg && <p className="waitlist-error">{errorMsg}</p>}
    </form>
  )
}

function Work() {
  return (
    <section className="contact" id="work">
      <div className="section-inner">
        <p className="section-label">Partnerships</p>
        <h2 className="section-heading">Work with me</h2>
        <div className="section-body">
          <p>
            I create content for corporate men navigating the tension between
            ambition, faith, and family responsibility. My audience is building
            toward freedom - not looking for shortcuts. If you have a product or
            service that genuinely serves that person, I'd love to hear from you.
          </p>
        </div>
        <div className="contact-email">
          <span className="contact-email-icon" aria-hidden="true">{'\u2709'}</span>
          <a href="mailto:partnerships@christianbrooks.co">
            partnerships@christianbrooks.co
          </a>
        </div>

        <ul className="social-row" aria-label="Follow on social">
          <li>
            <a href="https://instagram.com/officialchristianbrooks" target="_blank" rel="noopener noreferrer">
              <span className="social-platform">Instagram</span>
              <span className="social-handle">@officialchristianbrooks</span>
            </a>
          </li>
          <li>
            <a href="https://instagram.com/everycorporatever" target="_blank" rel="noopener noreferrer">
              <span className="social-platform">Instagram</span>
              <span className="social-handle">@everycorporatever</span>
            </a>
          </li>
          <li>
            <a href="https://tiktok.com/@everycorporatever" target="_blank" rel="noopener noreferrer">
              <span className="social-platform">TikTok</span>
              <span className="social-handle">@everycorporatever</span>
            </a>
          </li>
          <li>
            <a href="https://youtube.com/@everycorporatever" target="_blank" rel="noopener noreferrer">
              <span className="social-platform">YouTube</span>
              <span className="social-handle">@everycorporatever</span>
            </a>
          </li>
        </ul>
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
