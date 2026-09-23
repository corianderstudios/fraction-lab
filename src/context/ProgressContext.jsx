import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { SECTION_IDS } from '../data/sections.js'
import { GAME_OPS } from '../lib/router.js'
import { MAX_QUESTIONS } from '../lib/questionGenerator.js'
import { readJSON, writeJSON } from '../lib/storage.js'

// v2: "in progress" is now set only by the user, never by visiting a page.
export const PROGRESS_KEY = 'fractionlab-progress-v2'
const ProgressContext = createContext(null)
const EMPTY = { inProgress: {}, completed: {}, bestScores: {} }

/** Stored data could be edited by hand, so only well-formed values survive. */
export function sanitizeProgress(raw) {
  const out = { inProgress: {}, completed: {}, bestScores: {} }
  if (!raw || typeof raw !== 'object') return out
  for (const id of SECTION_IDS) {
    if (raw.completed?.[id] === true) out.completed[id] = true
    else if (raw.inProgress?.[id] === true) out.inProgress[id] = true
  }
  for (const op of GAME_OPS) {
    const score = raw.bestScores?.[op]
    if (Number.isInteger(score) && score >= 0 && score <= MAX_QUESTIONS) out.bestScores[op] = score
  }
  return out
}

function without(obj, key) {
  const copy = { ...obj }
  delete copy[key]
  return copy
}

function reducer(state, action) {
  switch (action.type) {
    case 'toggleInProgress': {
      if (!SECTION_IDS.includes(action.id) || state.completed[action.id]) return state
      const inProgress = state.inProgress[action.id]
        ? without(state.inProgress, action.id)
        : { ...state.inProgress, [action.id]: true }
      return { ...state, inProgress }
    }
    case 'toggleComplete': {
      if (!SECTION_IDS.includes(action.id)) return state
      if (state.completed[action.id]) return { ...state, completed: without(state.completed, action.id) }
      // Completing a section clears its "in progress" flag.
      return {
        ...state,
        completed: { ...state.completed, [action.id]: true },
        inProgress: without(state.inProgress, action.id),
      }
    }
    case 'bestScore': {
      if (!GAME_OPS.includes(action.op) || !Number.isInteger(action.score)) return state
      const previous = state.bestScores[action.op]
      if (previous !== undefined && previous >= action.score) return state
      return { ...state, bestScores: { ...state.bestScores, [action.op]: action.score } }
    }
    case 'reset':
      return EMPTY
    default:
      return state
  }
}

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => sanitizeProgress(readJSON(PROGRESS_KEY)))

  useEffect(() => {
    writeJSON(PROGRESS_KEY, state)
  }, [state])

  const actions = useMemo(
    () => ({
      toggleInProgress: (id) => dispatch({ type: 'toggleInProgress', id }),
      toggleComplete: (id) => dispatch({ type: 'toggleComplete', id }),
      setBestScore: (op, score) => dispatch({ type: 'bestScore', op, score }),
      resetProgress: () => dispatch({ type: 'reset' }),
    }),
    [],
  )

  const value = useMemo(
    () => ({
      ...actions,
      state,
      /** 'complete' | 'in-progress' | 'not-started' */
      getStatus: (id) => (state.completed[id] ? 'complete' : state.inProgress[id] ? 'in-progress' : 'not-started'),
    }),
    [state, actions],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
