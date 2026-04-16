import { useState } from 'react'

const QUESTIONS = [
  {
    dimension: 'Income Control',
    text: 'If you lost your job tomorrow, how quickly could you generate income on your own?',
    lowLabel: 'Not at all',
    highLabel: 'Immediately',
    note: null,
  },
  {
    dimension: 'Schedule Control',
    text: 'How much authority do you have over your own time right now?',
    lowLabel: 'None at all',
    highLabel: 'Complete control',
    note: null,
  },
  {
    dimension: 'Stress Level',
    text: 'How would you rate your current stress level at work?',
    lowLabel: 'Constant pressure',
    highLabel: 'Calm and sustainable',
    note: 'For this one, 10 = low stress. 1 = constant pressure.',
  },
  {
    dimension: 'Skill Leverage',
    text: 'Are your skills packaged into assets you own - or just rented out to an employer?',
    lowLabel: 'Purely rented',
    highLabel: 'Fully packaged into assets',
    note: null,
  },
  {
    dimension: 'Purpose Alignment',
    text: "Are you building toward your own future - or maintaining someone else's?",
    lowLabel: "Someone else's entirely",
    highLabel: 'Fully my own',
    note: null,
  },
]

function getInterpretation(score) {
  if (score <= 24) return "You have a real gap right now - and that's exactly why you're here."
  if (score <= 39) return "You've got pieces in place. Something's missing though."
  return "You're closer than most people. Let's talk about what's next."
}

function getLowestDimension(answers) {
  let minVal = Infinity
  let minIndex = 0
  answers.forEach((v, i) => {
    if (v < minVal) { minVal = v; minIndex = i }
  })
  return QUESTIONS[minIndex].dimension
}

export default function EscapeScorecard() {
  const [step, setStep] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState(Array(5).fill(5))
  const [transitioning, setTransitioning] = useState(false)

  const [emailFormOpen, setEmailFormOpen] = useState(false)
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailError, setEmailError] = useState(null)

  function transition(callback) {
    setTransitioning(true)
    setTimeout(() => { callback(); setTransitioning(false) }, 220)
  }

  function handleStart() {
    transition(() => setStep('questions'))
  }

  function handleNext() {
    transition(() => {
      if (currentQ < 4) { setCurrentQ(q => q + 1) } else { setStep('results') }
    })
  }

  function handleRetake() {
    transition(() => {
      setAnswers(Array(5).fill(5))
      setCurrentQ(0)
      setStep('intro')
      setEmailFormOpen(false)
      setEmailSubmitted(false)
      setEmailError(null)
    })
  }

  function setAnswer(val) {
    setAnswers(prev => { const next = [...prev]; next[currentQ] = val; return next })
  }

  async function handleEmailSubmit({ name, email }) {
    setEmailSubmitting(true)
    setEmailError(null)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const text = await res.text()
      let data = {}
      try { if (text) data = JSON.parse(text) } catch (_) {}
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setEmailSubmitted(true)
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setEmailSubmitting(false)
    }
  }

  const runningScore =
    answers.slice(0, currentQ).reduce((a, b) => a + b, 0) + answers[currentQ]
  const finalScore = answers.reduce((a, b) => a + b, 0)

  return (
    <div className={`sc-card ${transitioning ? 'sc-fading' : 'sc-visible'}`}>
      {step === 'intro' && (
        <IntroScreen onStart={handleStart} />
      )}
      {step === 'questions' && (
        <QuestionScreen
          q={QUESTIONS[currentQ]}
          index={currentQ}
          value={answers[currentQ]}
          onChange={setAnswer}
          onNext={handleNext}
          runningScore={runningScore}
        />
      )}
      {step === 'results' && (
        <ResultsScreen
          score={finalScore}
          lowestDimension={getLowestDimension(answers)}
          onRetake={handleRetake}
          emailFormOpen={emailFormOpen}
          emailSubmitting={emailSubmitting}
          emailSubmitted={emailSubmitted}
          emailError={emailError}
          onJoinList={() => setEmailFormOpen(true)}
          onEmailSubmit={handleEmailSubmit}
        />
      )}
    </div>
  )
}

function IntroScreen({ onStart }) {
  return (
    <div className="sc-screen">
      <h3 className="sc-intro-heading">Find Your Starting Point</h3>
      <p className="sc-intro-body">
        Five quick questions. Honest answers only. This only works if you mean it.
        Get your score and a personalized breakdown sent straight to your inbox.
      </p>
      <button className="btn btn-gold sc-cta-btn" onClick={onStart}>
        Start the Assessment
      </button>
    </div>
  )
}

const THUMB_PX = 20

function QuestionScreen({ q, index, value, onChange, onNext, runningScore }) {
  const progress = ((index + 1) / 5) * 100
  const pct = (value - 1) / 9
  const thumbOffset = THUMB_PX / 2 - pct * THUMB_PX
  const fillPct = (pct * 100).toFixed(1)

  return (
    <div className="sc-screen">
      <div className="sc-progress-track">
        <div className="sc-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="sc-q-meta">
        <span className="sc-q-count">Question {index + 1} of 5</span>
        <span className="sc-running-score">
          Running total: <strong>{runningScore}</strong>
        </span>
      </div>
      <p className="sc-dimension">{q.dimension}</p>
      <p className="sc-question-text">{q.text}</p>

      <div className="sc-slider-wrap">
        <div className="sc-slider-track-wrap">
          <div
            className="sc-slider-value"
            style={{ left: `calc(${pct * 100}% + ${thumbOffset}px)` }}
            aria-live="polite"
          >
            {value}
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="sc-slider"
            style={{ '--sc-fill': `${fillPct}%` }}
            aria-label={q.dimension}
          />
        </div>
        <div className="sc-slider-labels">
          <span>1 - {q.lowLabel}</span>
          <span>{q.highLabel} - 10</span>
        </div>
      </div>

      {q.note && <p className="sc-note">{q.note}</p>}

      <button className="btn btn-gold sc-cta-btn" onClick={onNext}>
        {index < 4 ? 'Next' : 'See My Results'}
      </button>
    </div>
  )
}

function ResultsScreen({
  score, lowestDimension, onRetake,
  emailFormOpen, emailSubmitting, emailSubmitted, emailError,
  onJoinList, onEmailSubmit,
}) {
  const showGuide = score < 40

  return (
    <div className="sc-screen">
      <div className="sc-score-block">
        <span className="sc-score-num">{score}</span>
        <span className="sc-score-denom">/ 50</span>
      </div>
      <p className="sc-lowest-dim">
        Lowest dimension: <strong>{lowestDimension}</strong>
      </p>
      <p className="sc-interpretation">{getInterpretation(score)}</p>

      <div className="sc-result-cards">
        <ResultCard
          icon="📲"
          heading="Send me your score"
          body="DM me your lowest dimension on Instagram. Tell me what scored lowest and a little about where you are. I read every one."
          cta="Find me on Instagram"
          href="https://instagram.com/officialchristianbrooks"
        />
        {showGuide && (
          <ResultCard
            icon="📋"
            heading="Get the free guide"
            body="The 9-5 Exit Operating System walks you through exactly what to build first. No email required."
            cta="Download free"
            href="/exit-os.pdf"
            download="9-5-Exit-Operating-System.pdf"
          />
        )}
        <ResultCard
          icon="✉️"
          heading="Follow the real process"
          body="I send occasional updates on what's actually working as I build this. No pitch sequences. Just the process."
          cta="Join the list"
          onClick={onJoinList}
        />
      </div>

      {emailFormOpen && (
        <EmailForm
          submitted={emailSubmitted}
          submitting={emailSubmitting}
          error={emailError}
          onSubmit={onEmailSubmit}
        />
      )}

      <button className="sc-retake-btn" onClick={onRetake}>
        Take it again
      </button>
    </div>
  )
}

function ResultCard({ icon, heading, body, cta, href, download, onClick }) {
  const isExternal = href && href.startsWith('http')
  return (
    <div className="sc-result-card">
      <span className="sc-result-card-icon" aria-hidden="true">{icon}</span>
      <p className="sc-result-card-heading">{heading}</p>
      <p className="sc-result-card-body">{body}</p>
      {onClick ? (
        <button className="sc-result-card-cta" onClick={onClick}>{cta}</button>
      ) : (
        <a
          href={href}
          className="sc-result-card-cta"
          download={download || undefined}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {cta}
        </a>
      )}
    </div>
  )
}

function EmailForm({ submitted, submitting, error, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ name, email })
  }

  if (submitted) {
    return (
      <div className="sc-email-confirm">
        <span className="sc-email-confirm-icon" aria-hidden="true">✓</span>
        <p className="sc-email-confirm-text">
          You're in. I'll send updates on what's actually working. No pitch sequences, just the real process.
        </p>
      </div>
    )
  }

  return (
    <form className="sc-email-form" onSubmit={handleSubmit} noValidate>
      <p className="sc-email-form-heading">Join the list</p>
      <div className="sc-field">
        <label htmlFor="sc-name">First name</label>
        <input
          id="sc-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your first name"
          required
          autoComplete="given-name"
        />
      </div>
      <div className="sc-field">
        <label htmlFor="sc-email">Email</label>
        <input
          id="sc-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoComplete="email"
        />
      </div>
      {error && <p className="sc-email-error">{error}</p>}
      <button type="submit" className="btn btn-gold" disabled={submitting}>
        {submitting ? 'Adding you...' : 'Subscribe'}
      </button>
    </form>
  )
}
