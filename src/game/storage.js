// All game data lives in localStorage on this device. Nothing is uploaded.

const KEYS = {
  sets: 'rlgw_sets_v1',
  premium: 'rlgw_premium_v1',
  prefs: 'rlgw_prefs_v1',
}

export const FREE_LIMITS = { maxSets: 1, maxPeople: 16 }
export const PREMIUM_LIMITS = { maxSets: Infinity, maxPeople: 30 }

export const CATEGORIES = [
  'None',
  'Family',
  'Church',
  'College',
  'High School',
  'Friends',
  'Work',
  'Neighbors',
  'Other',
]

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function loadSets() {
  return loadJSON(KEYS.sets, [])
}

export function saveSets(sets) {
  return saveJSON(KEYS.sets, sets)
}

export function isPremium() {
  return loadJSON(KEYS.premium, false) === true
}

export function setPremium(value) {
  saveJSON(KEYS.premium, value === true)
}

export function limitsFor(premium) {
  return premium ? PREMIUM_LIMITS : FREE_LIMITS
}

const DEFAULT_PREFS = { strict: false, names: ['Player 1', 'Player 2'] }

export function loadPrefs() {
  return { ...DEFAULT_PREFS, ...loadJSON(KEYS.prefs, {}) }
}

export function savePrefs(prefs) {
  saveJSON(KEYS.prefs, prefs)
}

export function deleteAllData() {
  Object.values(KEYS).forEach((k) => {
    try {
      localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  })
}

// Reads an image file, center-crops it to a square, and returns a small
// JPEG data URL so a full board of photos fits comfortably in localStorage.
export function fileToPhoto(file, size = 384) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        const out = Math.min(size, side)
        const canvas = document.createElement('canvas')
        canvas.width = out
        canvas.height = out
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      } catch (err) {
        reject(err)
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image.'))
    }
    img.src = url
  })
}
