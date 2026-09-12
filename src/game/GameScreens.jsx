import { useMemo, useState } from 'react'
import { QUESTION_PACKS, shuffle } from './questions.js'
import { PersonCard, Sheet, Toggle, TopBar } from './components.jsx'

const PLAYER_CLASS = ['p1', 'p2']

export function GameFlow({ sets, premium, prefs, setPrefs, onExit, onUpgrade, onEditPeople }) {
  const playable = sets.filter((s) => s.people.length >= 3)
  const [phase, setPhase] = useState('setup') // setup | intro | pick | confirm | ready | pass | board | verify | win
  const [setId, setSetId] = useState(playable[0]?.id || null)
  const [strict, setStrict] = useState(prefs.strict)
  const [names, setNames] = useState(prefs.names)
  const [game, setGame] = useState(null)
  const [picking, setPicking] = useState(0) // which player is selecting a secret
  const [pendingSecret, setPendingSecret] = useState(null)
  const [guess, setGuess] = useState(null) // person being guessed
  const [winner, setWinner] = useState(null)

  const chosenSet = sets.find((s) => s.id === setId) || null

  function startSelection() {
    setPrefs({ strict, names })
    setGame({
      people: [...chosenSet.people],
      secrets: [null, null],
      elim: [[], []],
      turn: 0,
      questions: [0, 0],
      bonus: [false, false],
    })
    setPicking(0)
    setPendingSecret(null)
    setPhase('intro')
  }

  function lockIn() {
    const secrets = [...game.secrets]
    secrets[picking] = pendingSecret.id
    setGame({ ...game, secrets })
    setPendingSecret(null)
    if (picking === 0) {
      setPicking(1)
      setPhase('intro')
    } else {
      setPhase('ready')
    }
  }

  function toggleEliminate(personId) {
    const elim = game.elim.map((list, i) => {
      if (i !== game.turn) return list
      return list.includes(personId) ? list.filter((id) => id !== personId) : [...list, personId]
    })
    setGame({ ...game, elim })
  }

  function endTurn() {
    const questions = [...game.questions]
    questions[game.turn] += game.bonus[game.turn] ? 2 : 1
    const bonus = [...game.bonus]
    bonus[game.turn] = false
    setGame({ ...game, questions, bonus, turn: 1 - game.turn })
    setPhase('pass')
  }

  function resolveGuess(correct) {
    if (correct) {
      const questions = [...game.questions]
      if (!strict) questions[game.turn] += 1
      setGame({ ...game, questions })
      setWinner(game.turn)
      setGuess(null)
      setPhase('win')
      return
    }
    // Wrong guess: opponent gets two questions on their next turn.
    const questions = [...game.questions]
    questions[game.turn] += strict ? 0 : 1
    const bonus = [...game.bonus]
    bonus[1 - game.turn] = true
    setGame({ ...game, questions, bonus, turn: 1 - game.turn })
    setGuess(null)
    setPhase('pass')
  }

  function rematch() {
    setGame({
      people: [...chosenSet.people],
      secrets: [null, null],
      elim: [[], []],
      turn: 0,
      questions: [0, 0],
      bonus: [false, false],
    })
    setWinner(null)
    setPicking(0)
    setPendingSecret(null)
    setPhase('intro')
  }

  /* ---------- Setup ---------- */

  if (phase === 'setup') {
    if (playable.length === 0) {
      return (
        <div className="app">
          <TopBar title="Play" onBack={onExit} />
          <div className="takeover">
            <div className="big-emoji">👥</div>
            <h2 className="display">First, add your people</h2>
            <p>You need a People Set with at least 3 people you both know before you can play.</p>
            <button type="button" className="btn btn-primary" onClick={onEditPeople}>
              Create My First Set
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className="app">
        <TopBar title="New Game" onBack={onExit} />
        <div className="stack">
          <p className="section-label" style={{ margin: '0 0 -4px' }}>
            Who’s on the board?
          </p>
          {playable.map((s) => (
            <button
              key={s.id}
              type="button"
              className="set-card"
              style={setId === s.id ? { outline: '3px solid var(--teal)' } : undefined}
              onClick={() => setSetId(s.id)}
            >
              <span className="set-emoji">👥</span>
              <span className="set-info">
                <span className="set-name">{s.name}</span>
                <br />
                <span className="set-count">{s.people.length} people</span>
              </span>
              {setId === s.id && <span style={{ color: 'var(--teal)', fontWeight: 800 }}>✓</span>}
            </button>
          ))}

          <p className="section-label" style={{ marginBottom: -4 }}>
            Mode
          </p>
          <button type="button" className="set-card" style={{ outline: '3px solid var(--teal)' }}>
            <span className="set-emoji">📱</span>
            <span className="set-info">
              <span className="set-name">Same Phone</span>
              <br />
              <span className="set-count">Pass one phone back and forth</span>
            </span>
            <span style={{ color: 'var(--teal)', fontWeight: 800 }}>✓</span>
          </button>
          <button type="button" className="set-card" style={{ opacity: 0.55 }} onClick={premium ? undefined : onUpgrade}>
            <span className="set-emoji">📲</span>
            <span className="set-info">
              <span className="set-name">Two Phones</span>
              <br />
              <span className="set-count">{premium ? 'Coming soon' : 'Premium · coming soon'}</span>
            </span>
          </button>

          <p className="section-label" style={{ marginBottom: -4 }}>
            Rules
          </p>
          <Toggle
            on={strict}
            onChange={setStrict}
            label="Strict Mode"
            sub="Guessing uses up your question for the turn"
          />

          {premium ? (
            <>
              <p className="section-label" style={{ marginBottom: -4 }}>
                Player names
              </p>
              <div className="btn-row">
                {[0, 1].map((i) => (
                  <div className="field" style={{ flex: 1 }} key={i}>
                    <input
                      aria-label={`Player ${i + 1} name`}
                      value={names[i]}
                      maxLength={14}
                      onChange={(e) => {
                        const next = [...names]
                        next[i] = e.target.value
                        setNames(next)
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <button type="button" className="btn btn-primary" style={{ marginTop: 10 }} disabled={!chosenSet} onClick={startSelection}>
            Continue
          </button>
        </div>
      </div>
    )
  }

  const name = (i) => (names[i]?.trim() ? names[i].trim() : `Player ${i + 1}`)

  /* ---------- Secret selection ---------- */

  if (phase === 'intro') {
    const other = 1 - picking
    return (
      <div className="app">
        <div className="takeover">
          <div className="big-emoji">🤫</div>
          <h2 className={`display ${PLAYER_CLASS[picking]}`}>{name(picking)}</h2>
          <p>
            <b>{name(other)}, look away!</b>
            <br />
            {name(picking)} is about to secretly pick their person.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => setPhase('pick')}>
            I’m Ready
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'pick') {
    return (
      <div className="app">
        <div className="board-head">
          <span className={`who ${PLAYER_CLASS[picking]}`}>{name(picking)}</span>
          <span className="remaining-pill">Pick your secret person</span>
        </div>
        <p className="muted" style={{ margin: '0 0 12px', fontSize: 15 }}>
          Tap the person your opponent will try to guess.
        </p>
        <div className="people-grid grid-large">
          {game.people.map((p) => (
            <PersonCard
              key={p.id}
              person={p}
              selected={pendingSecret?.id === p.id}
              onClick={() => setPendingSecret(p)}
            />
          ))}
        </div>
        <div className="board-actions">
          <button type="button" className="btn btn-teal" disabled={!pendingSecret} onClick={() => setPhase('confirm')}>
            {pendingSecret ? `Choose ${pendingSecret.nickname || pendingSecret.name}` : 'Tap someone above'}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'confirm') {
    return (
      <div className="app">
        <div className="takeover">
          <div style={{ width: 140, borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lift)' }}>
            <PersonCard person={pendingSecret} onClick={() => {}} />
          </div>
          <h2 className="display">
            Your person is {pendingSecret.nickname || pendingSecret.name}.
          </h2>
          <p>You’ll answer questions about them. Keep it secret!</p>
          <button type="button" className="btn btn-primary" onClick={lockIn}>
            Lock In
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setPhase('pick')}>
            Pick someone else
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'ready') {
    return (
      <div className="app">
        <div className="takeover">
          <div className="big-emoji">🎲</div>
          <h2 className="display">Both players locked in!</h2>
          <p>
            <span className={PLAYER_CLASS[0]}>
              <b>{name(0)}</b>
            </span>{' '}
            goes first. Take turns asking yes/no questions out loud, then knock people off your board.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => setPhase('pass')}>
            Start Game
          </button>
        </div>
      </div>
    )
  }

  /* ---------- Privacy screen between turns ---------- */

  if (phase === 'pass') {
    const t = game.turn
    return (
      <div className="app">
        <div className="takeover">
          <div className="big-emoji">🔒</div>
          <h2 className={`display ${PLAYER_CLASS[t]}`}>{name(t)}’s Turn</h2>
          <p>Pass the phone to {name(t)}.</p>
          {game.bonus[t] && <p style={{ color: 'var(--ink)' }}>⭐ You get <b>two questions</b> this turn — your opponent guessed wrong.</p>}
          <button type="button" className="btn btn-primary" onClick={() => setPhase('board')}>
            I’m {name(t)}
          </button>
        </div>
      </div>
    )
  }

  /* ---------- Board ---------- */

  if (phase === 'board' || phase === 'guessing') {
    const t = game.turn
    const eliminated = game.elim[t]
    const remaining = game.people.length - eliminated.length
    const guessing = phase === 'guessing'
    return (
      <BoardScreen
        game={game}
        strict={strict}
        premium={premium}
        onUpgrade={onUpgrade}
        playerName={name(t)}
        playerClass={PLAYER_CLASS[t]}
        remaining={remaining}
        guessing={guessing}
        onToggle={(p) => {
          if (guessing) {
            if (!eliminated.includes(p.id)) {
              setGuess(p)
              setPhase('verify')
            }
          } else {
            toggleEliminate(p.id)
          }
        }}
        onStartGuess={() => setPhase('guessing')}
        onCancelGuess={() => setPhase('board')}
        onEndTurn={endTurn}
        onQuit={() => {
          if (window.confirm('End this game? Nobody wins.')) onExit()
        }}
      />
    )
  }

  /* ---------- Guess verification ---------- */

  if (phase === 'verify') {
    const guesser = game.turn
    const opponent = 1 - guesser
    return (
      <div className="app">
        <div className="takeover">
          <div style={{ width: 140, borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lift)' }}>
            <PersonCard person={guess} onClick={() => {}} />
          </div>
          <h2 className="display">
            “Is your person {guess.nickname || guess.name}?”
          </h2>
          <p>
            <b className={PLAYER_CLASS[opponent]}>{name(opponent)}</b> — answer honestly!
          </p>
          <div className="btn-row" style={{ width: '100%', maxWidth: 340 }}>
            <button type="button" className="btn btn-teal" onClick={() => resolveGuess(true)}>
              YES! 🎉
            </button>
            <button type="button" className="btn btn-card" onClick={() => resolveGuess(false)}>
              Nope
            </button>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setGuess(null)
              setPhase('board')
            }}
          >
            Wait — cancel this guess
          </button>
        </div>
      </div>
    )
  }

  /* ---------- Win ---------- */

  if (phase === 'win') {
    const w = winner
    return (
      <div className="app">
        <div className="win">
          <div className="confetti">🎉</div>
          <h2 className={`display ${PLAYER_CLASS[w]}`}>{name(w)} Wins!</h2>
          <p className="muted" style={{ margin: 0 }}>
            The secret person was {secretName(game, 1 - w)}.
          </p>
          <div className="stat-row">
            <div className="stat">
              <div className="num">{game.questions[w]}</div>
              <div className="lbl">Questions asked</div>
            </div>
            <div className="stat">
              <div className="num">{game.elim[w].length}</div>
              <div className="lbl">People eliminated</div>
            </div>
          </div>
          <div className="stack" style={{ width: '100%', maxWidth: 340 }}>
            <button type="button" className="btn btn-primary" onClick={rematch}>
              Rematch
            </button>
            <button type="button" className="btn btn-card" onClick={() => setPhase('setup')}>
              New People
            </button>
            <button type="button" className="btn btn-ghost" onClick={onExit}>
              Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

function secretName(game, ownerIndex) {
  const person = game.people.find((p) => p.id === game.secrets[ownerIndex])
  return person ? person.nickname || person.name : '…'
}

function BoardScreen({
  game,
  strict,
  premium,
  onUpgrade,
  playerName,
  playerClass,
  remaining,
  guessing,
  onToggle,
  onStartGuess,
  onCancelGuess,
  onEndTurn,
  onQuit,
}) {
  const [showQuestions, setShowQuestions] = useState(false)
  const t = game.turn
  const eliminated = game.elim[t]

  return (
    <div className="app">
      <div className="board-head">
        <span className={`who ${playerClass}`}>{playerName}</span>
        <span className="remaining-pill">People remaining: {remaining}</span>
      </div>

      {game.bonus[t] && !guessing && <div className="bonus-banner">⭐ Two questions this turn</div>}
      {guessing ? (
        <div className="guess-bar">Tap the person you think it is</div>
      ) : (
        <div className="hint-banner">Ask a yes/no question out loud, then tap people to knock them out. Tap again to undo.</div>
      )}

      <div className="board-scroll">
        <div className="people-grid grid-large">
          {game.people.map((p) => (
            <PersonCard
              key={p.id}
              person={p}
              eliminated={eliminated.includes(p.id)}
              onClick={() => onToggle(p)}
            />
          ))}
        </div>
      </div>

      <div className="board-actions">
        {guessing ? (
          <button type="button" className="btn btn-card" onClick={onCancelGuess}>
            Cancel guess
          </button>
        ) : (
          <>
            <div className="btn-row">
              <button type="button" className="btn btn-card" onClick={() => setShowQuestions(true)}>
                💡 Question Ideas
              </button>
              <button type="button" className="btn btn-teal" onClick={onStartGuess}>
                🎯 Make a Guess
              </button>
            </div>
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={onEndTurn}>
                Done — Pass Phone
              </button>
            </div>
            <button type="button" className="btn btn-ghost" style={{ padding: 8, fontSize: 14 }} onClick={onQuit}>
              End game
            </button>
            {strict && <p className="footnote" style={{ margin: 0 }}>Strict Mode: guessing replaces your question this turn.</p>}
          </>
        )}
      </div>

      {showQuestions && (
        <QuestionIdeas premium={premium} onUpgrade={onUpgrade} onClose={() => setShowQuestions(false)} />
      )}
    </div>
  )
}

export function QuestionIdeas({ premium, onUpgrade, onClose }) {
  const [packId, setPackId] = useState(QUESTION_PACKS[0].id)
  const [seed, setSeed] = useState(0)
  const pack = QUESTION_PACKS.find((p) => p.id === packId)
  const locked = pack.premium && !premium
  const prompts = useMemo(() => shuffle(pack.prompts).slice(0, 5), [packId, seed])

  return (
    <Sheet title="Question ideas" onClose={onClose}>
      <div className="pack-tabs">
        {QUESTION_PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`pack-tab${p.id === packId ? ' active' : ''}${p.premium && !premium ? ' locked' : ''}`}
            onClick={() => setPackId(p.id)}
          >
            {p.emoji} {p.name}
            {p.premium && !premium ? ' 🔒' : ''}
          </button>
        ))}
      </div>

      {locked ? (
        <div className="stack">
          <div className="upgrade-nudge">
            <b>Chaos Mode is a premium pack.</b> Ridiculous, subjective questions like “Would this person
            survive a zombie apocalypse?”
          </div>
          <button type="button" className="btn btn-primary" onClick={onUpgrade}>
            Unlock the Full Game — $1.99
          </button>
        </div>
      ) : (
        <>
          <div className="prompt-list">
            {prompts.map((q) => (
              <div key={q} className="prompt-item">
                {q}
              </div>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-card" onClick={() => setSeed(seed + 1)}>
              🔀 Shuffle
            </button>
            <button type="button" className="btn btn-teal" onClick={onClose}>
              Got one!
            </button>
          </div>
        </>
      )}
    </Sheet>
  )
}
