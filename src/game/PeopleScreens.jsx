import { useRef, useState } from 'react'
import { CATEGORIES, fileToPhoto, limitsFor, uid, deleteAllData } from './storage.js'
import { Avatar, PersonCard, Sheet, TopBar } from './components.jsx'

export function SetsScreen({ sets, setSets, premium, onBack, onOpenSet, onUpgrade }) {
  const limits = limitsFor(premium)
  const atSetLimit = sets.length >= limits.maxSets

  function createSet() {
    const set = { id: uid(), name: 'My People', people: [] }
    setSets([...sets, set])
    onOpenSet(set.id)
  }

  return (
    <div className="app">
      <TopBar title="My People" onBack={onBack} />
      <div className="stack">
        {sets.map((set) => (
          <button key={set.id} type="button" className="set-card" onClick={() => onOpenSet(set.id)}>
            <span className="set-emoji">👥</span>
            <span className="set-info">
              <span className="set-name">{set.name}</span>
              <br />
              <span className="set-count">
                {set.people.length} {set.people.length === 1 ? 'person' : 'people'}
              </span>
            </span>
            <span className="chev">›</span>
          </button>
        ))}
        {atSetLimit ? (
          <div className="upgrade-nudge">
            <b>Want more than one group?</b> Premium unlocks unlimited People Sets.{' '}
            <button type="button" className="btn-ghost" style={{ padding: 0, fontWeight: 700, color: 'var(--coral)' }} onClick={onUpgrade}>
              Upgrade →
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-card" onClick={createSet}>
            + New People Set
          </button>
        )}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 32 }}>
        <p className="footnote">
          Your people, photos, and games are stored only on this device. Nothing is uploaded anywhere.
        </p>
        <DeleteAllButton
          onDeleted={() => {
            setSets([])
          }}
        />
      </div>
    </div>
  )
}

function DeleteAllButton({ onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  if (!confirming) {
    return (
      <button type="button" className="btn btn-ghost" onClick={() => setConfirming(true)}>
        Delete All Data
      </button>
    )
  }
  return (
    <div className="btn-row">
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => {
          deleteAllData()
          onDeleted()
          setConfirming(false)
        }}
      >
        Yes, erase everything
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </div>
  )
}

export function SetEditor({ set, sets, setSets, premium, onBack, onUpgrade, hint, onPlay }) {
  const [editing, setEditing] = useState(null) // person object or 'new'
  const [reordering, setReordering] = useState(false)
  const limits = limitsFor(premium)
  const atPeopleLimit = set.people.length >= limits.maxPeople
  const canDuplicate = premium && sets.length < limits.maxSets

  function updateSet(patch) {
    setSets(sets.map((s) => (s.id === set.id ? { ...s, ...patch } : s)))
  }

  function savePerson(person) {
    const exists = set.people.some((p) => p.id === person.id)
    updateSet({
      people: exists ? set.people.map((p) => (p.id === person.id ? person : p)) : [...set.people, person],
    })
    setEditing(null)
  }

  function deletePerson(id) {
    updateSet({ people: set.people.filter((p) => p.id !== id) })
    setEditing(null)
  }

  function move(index, dir) {
    const next = [...set.people]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    updateSet({ people: next })
  }

  function deleteSet() {
    if (!window.confirm(`Delete “${set.name}” and everyone in it?`)) return
    setSets(sets.filter((s) => s.id !== set.id))
    onBack()
  }

  function duplicateSet() {
    const copy = {
      id: uid(),
      name: `${set.name} (copy)`,
      people: set.people.map((p) => ({ ...p, id: uid() })),
    }
    setSets([...sets, copy])
    onBack()
  }

  return (
    <div className="app">
      <TopBar
        title="Edit People Set"
        onBack={onBack}
        right={
          <button type="button" className="btn-ghost" style={{ fontWeight: 700 }} onClick={() => setReordering(!reordering)}>
            {reordering ? 'Done' : 'Reorder'}
          </button>
        }
      />
      <div className="stack">
        <div className="field">
          <label htmlFor="set-name">Group name</label>
          <input
            id="set-name"
            value={set.name}
            onChange={(e) => updateSet({ name: e.target.value })}
            placeholder="Our Friends & Family"
            maxLength={40}
          />
        </div>

        {hint && set.people.length < 3 && (
          <div className="upgrade-nudge">
            <b>First, build your board.</b> Add at least 3 people you both know — friends, family, church, work.
            The more people, the better the game.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="count-pill">
            {set.people.length} / {limits.maxPeople} people
          </span>
          {set.people.length >= 3 && onPlay && (
            <button type="button" className="btn-ghost" style={{ fontWeight: 700, color: 'var(--teal)' }} onClick={onPlay}>
              Play with this set →
            </button>
          )}
        </div>

        <div className="people-grid">
          {set.people.map((person, i) => (
            <PersonCard key={person.id} person={person} onClick={() => !reordering && setEditing(person)}>
              {reordering && (
                <span className="reorder-arrows">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    onClick={(e) => {
                      e.stopPropagation()
                      move(i, -1)
                    }}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    onClick={(e) => {
                      e.stopPropagation()
                      move(i, 1)
                    }}
                  >
                    →
                  </button>
                </span>
              )}
            </PersonCard>
          ))}
          {!atPeopleLimit && (
            <button type="button" className="person-card add-card" onClick={() => setEditing('new')}>
              <span className="plus">+</span>
              Add person
            </button>
          )}
        </div>

        {atPeopleLimit && !premium && (
          <div className="upgrade-nudge">
            <b>Board is full at {limits.maxPeople}.</b> Premium boards hold up to 30 people.{' '}
            <button type="button" className="btn-ghost" style={{ padding: 0, fontWeight: 700, color: 'var(--coral)' }} onClick={onUpgrade}>
              Upgrade →
            </button>
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          {canDuplicate && (
            <button type="button" className="btn btn-ghost" onClick={duplicateSet}>
              Duplicate this set
            </button>
          )}
          <button type="button" className="btn btn-danger" onClick={deleteSet}>
            Delete this set
          </button>
        </div>
      </div>

      {editing && (
        <PersonSheet
          person={editing === 'new' ? null : editing}
          onSave={savePerson}
          onDelete={deletePerson}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function PersonSheet({ person, onSave, onDelete, onClose }) {
  const [name, setName] = useState(person?.name || '')
  const [nickname, setNickname] = useState(person?.nickname || '')
  const [category, setCategory] = useState(person?.category || 'None')
  const [photo, setPhoto] = useState(person?.photo || null)
  const [photoError, setPhotoError] = useState(null)
  const fileRef = useRef(null)

  async function pickPhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setPhoto(await fileToPhoto(file))
      setPhotoError(null)
    } catch {
      setPhotoError('Couldn’t load that photo. Try a different one.')
    }
  }

  function save() {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave({
      id: person?.id || uid(),
      name: trimmed,
      nickname: nickname.trim(),
      category,
      photo,
    })
  }

  return (
    <Sheet title={person ? 'Edit person' : 'Add person'} onClose={onClose}>
      <div className="stack">
        <div className="photo-picker">
          {photo ? (
            <img className="photo-preview" src={photo} alt="" />
          ) : (
            <div className="photo-preview empty">📷</div>
          )}
          <div className="stack" style={{ flex: 1, gap: 6 }}>
            <button type="button" className="btn btn-card" style={{ padding: '11px 14px', fontSize: 15 }} onClick={() => fileRef.current?.click()}>
              {photo ? 'Change photo' : 'Add photo (optional)'}
            </button>
            {photo && (
              <button type="button" className="btn btn-ghost" style={{ padding: 6, fontSize: 14 }} onClick={() => setPhoto(null)}>
                Remove photo
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickPhoto} />
        </div>
        {photoError && <p className="footnote" style={{ color: 'var(--coral-dark)', textAlign: 'left', margin: 0 }}>{photoError}</p>}

        <div className="field">
          <label htmlFor="p-name">Name</label>
          <input id="p-name" autoFocus={!person} value={name} onChange={(e) => setName(e.target.value)} placeholder="Laura" maxLength={30} />
        </div>
        <div className="field">
          <label htmlFor="p-nick">Nickname (optional)</label>
          <input id="p-nick" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Aunt Laura" maxLength={30} />
        </div>
        <div className="field">
          <label htmlFor="p-cat">Category (only shown while editing)</label>
          <select id="p-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn btn-primary" disabled={!name.trim()} onClick={save}>
          {person ? 'Save' : 'Add to board'}
        </button>
        {person && (
          <button type="button" className="btn btn-danger" onClick={() => onDelete(person.id)}>
            Remove {person.name}
          </button>
        )}
      </div>
    </Sheet>
  )
}
