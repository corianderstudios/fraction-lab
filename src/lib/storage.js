// localStorage can throw (private mode, quota, disabled cookies), so every call is guarded.
const MAX_STORED_LENGTH = 10_000

export function readString(key) {
  try {
    const value = window.localStorage.getItem(key)
    return typeof value === 'string' && value.length <= MAX_STORED_LENGTH ? value : null
  } catch {
    return null
  }
}

export function writeString(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable — the app still works, it just won't remember */
  }
}

export function readJSON(key) {
  const raw = readString(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const writeJSON = (key, value) => writeString(key, JSON.stringify(value))
