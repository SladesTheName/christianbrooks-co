import { useEffect, useState } from 'react'
import {
  isPremium,
  loadPrefs,
  loadSets,
  savePrefs,
  saveSets,
  setPremium as persistPremium,
} from './storage.js'
import { TopBar } from './components.jsx'
import { SetsScreen, SetEditor } from './PeopleScreens.jsx'
import { GameFlow } from './GameScreens.jsx'

export default function App() {
  const [screen, setScreen] = useState({ name: 'home' })
  const [sets, setSetsState] = useState(loadSets)
  const [premium, setPremiumState] = useState(isPremium)
  const [prefs, setPrefsState] = useState(loadPrefs)
  const [storageWarning, setStorageWarning] = useState(false)

  useEffect(() => {
    const ok = saveSets(sets)
    setStorageWarning(!ok)
  }, [sets])

  function setSets(next) {
    setSetsState(next)
  }

  function setPrefs(next) {
    setPrefsState(next)
    savePrefs(next)
  }

  function unlockPremium() {
    persistPremium(true)
    setPremiumState(true)
  }

  const go = (name, extra = {}) => setScreen({ name, ...extra })

  if (screen.name === 'home') {
    return (
      <HomeScreen
        hasPlayableSet={sets.some((s) => s.people.length >= 3)}
        premium={premium}
        onPlay={() => go('play')}
        onPeople={() => go('people')}
        onHowTo={() => go('howto')}
        onUpgrade={() => go('upgrade')}
        storageWarning={storageWarning}
      />
    )
  }

  if (screen.name === 'people') {
    return (
      <SetsScreen
        sets={sets}
        setSets={setSets}
        premium={premium}
        onBack={() => go('home')}
        onOpenSet={(id) => go('editor', { setId: id, hint: false })}
        onUpgrade={() => go('upgrade')}
      />
    )
  }

  if (screen.name === 'editor') {
    const set = sets.find((s) => s.id === screen.setId)
    if (!set) {
      go('people')
      return null
    }
    return (
      <SetEditor
        set={set}
        sets={sets}
        setSets={setSets}
        premium={premium}
        hint={screen.hint}
        onBack={() => go(screen.hint ? 'home' : 'people')}
        onUpgrade={() => go('upgrade')}
        onPlay={() => go('play')}
      />
    )
  }

  if (screen.name === 'howto') {
    return <HowToPlay onBack={() => go('home')} />
  }

  if (screen.name === 'upgrade') {
    return <Upgrade premium={premium} onUnlock={unlockPremium} onBack={() => go('home')} />
  }

  if (screen.name === 'play') {
    return (
      <GameFlow
        sets={sets}
        premium={premium}
        prefs={prefs}
        setPrefs={setPrefs}
        onExit={() => go('home')}
        onUpgrade={() => go('upgrade')}
        onEditPeople={() => {
          if (sets.length === 0) {
            const set = { id: 'first', name: 'My People', people: [] }
            setSets([set])
            go('editor', { setId: set.id, hint: true })
          } else {
            go('editor', { setId: sets[0].id, hint: true })
          }
        }}
      />
    )
  }

  return null
}

function HomeScreen({ hasPlayableSet, premium, onPlay, onPeople, onHowTo, onUpgrade, storageWarning }) {
  return (
    <div className="app">
      <div className="home">
        <div className="home-head">
          <div className="home-logo">🕵️</div>
          <h1 className="display">
            Who Do You <span className="p1">Know?</span>
          </h1>
          <p className="home-tag">
            The real-life guessing game. Build a board out of people you actually know, then guess who.
          </p>
        </div>
        <div className="stack home-menu">
          <button type="button" className="btn btn-primary" onClick={onPlay}>
            ▶ Play
          </button>
          <button type="button" className="btn btn-card" onClick={onPeople}>
            👥 My People
          </button>
          <button type="button" className="btn btn-card" onClick={onHowTo}>
            📖 How to Play
          </button>
          {!premium && (
            <button type="button" className="btn btn-card" onClick={onUpgrade}>
              ⭐ Upgrade
            </button>
          )}
        </div>
        <p className="home-foot">
          {storageWarning
            ? '⚠️ This device is out of storage space — recent changes may not be saved.'
            : hasPlayableSet
              ? 'Grab a friend, pass one phone, play.'
              : 'Start by adding a few people you both know.'}
        </p>
      </div>
    </div>
  )
}

const RULES = [
  'Both players secretly choose one person from the board.',
  'Take turns asking one yes/no question out loud. The app doesn’t know the answers — you do.',
  'Answer honestly based on what you know about the person.',
  'Tap people on your board to eliminate anyone who no longer fits. Tap again to undo.',
  'If neither player knows the answer, the asker may choose another question.',
  'Avoid questions that essentially identify one individual.',
  'Don’t ask the exact same question your opponent just asked.',
  'On your turn, you may ask one question and then optionally make one guess.',
  'Correct guess = you win!',
  'Incorrect guess = your opponent gets two questions on their next turn.',
]

function HowToPlay({ onBack }) {
  return (
    <div className="app">
      <TopBar title="How to Play" onBack={onBack} />
      <div className="stack">
        <div className="panel">
          <ol className="rules-list">
            {RULES.map((rule, i) => (
              <li key={rule}>
                <span className="rule-num">{i + 1}</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="panel">
          <p style={{ margin: 0 }}>
            <b>Strict Mode:</b> guessing replaces asking a question — you can ask <i>or</i> guess on your
            turn, not both. Turn it on when setting up a game.
          </p>
        </div>
        <div className="panel">
          <p style={{ margin: 0 }} className="muted">
            <b style={{ color: 'var(--ink)' }}>Stuck on a question?</b> Tap 💡 Question Ideas during the
            game for prompts about appearance, life, your relationship with the person, and personality.
          </p>
        </div>
      </div>
    </div>
  )
}

const PERKS = [
  'Bigger boards — up to 30 people',
  'Unlimited People Sets',
  'Chaos Mode question pack',
  'Custom player names',
  'Duplicate an existing People Set',
  'Two Phone Mode (when it ships)',
  'All future premium packs and modes',
]

function Upgrade({ premium, onUnlock, onBack }) {
  const [confirming, setConfirming] = useState(false)

  if (premium) {
    return (
      <div className="app">
        <TopBar title="Premium" onBack={onBack} />
        <div className="takeover">
          <div className="big-emoji">⭐</div>
          <h2 className="display">You’ve got the full game.</h2>
          <p>Bigger boards, unlimited sets, Chaos Mode, and everything still to come. Thanks for the support!</p>
          <button type="button" className="btn btn-primary" onClick={onBack}>
            Back to the game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <TopBar title="Upgrade" onBack={onBack} />
      <div className="stack">
        <div className="panel" style={{ textAlign: 'center' }}>
          <p className="kicker">One-time unlock · no subscription</p>
          <div className="price-tag">$1.99</div>
          <p className="muted" style={{ margin: '6px 0 0' }}>
            Build bigger boards, save unlimited groups, unlock Chaos Mode, and more.
          </p>
        </div>
        <div className="panel">
          <ul className="perk-list">
            {PERKS.map((perk) => (
              <li key={perk}>
                <span className="tick">✓</span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
        {confirming ? (
          <div className="panel">
            <p style={{ marginTop: 0 }}>
              <b>Heads up:</b> app-store checkout isn’t wired up in this preview build, so this button
              unlocks premium on this device for free. In the released app this runs through the App
              Store / Google Play with purchase restoration.
            </p>
            <button type="button" className="btn btn-primary" onClick={onUnlock}>
              Unlock Premium on this device
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setConfirming(true)}>
            Unlock the Full Game — $1.99
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => window.alert('Purchase restoration runs through the App Store / Google Play in the released app. Nothing to restore in this preview build.')}
        >
          Restore purchase
        </button>
        <p className="footnote">
          The free game is fully playable: one People Set, up to 16 people, and unlimited games.
        </p>
      </div>
    </div>
  )
}
