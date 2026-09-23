import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readString, writeString } from '../lib/storage.js'

export const THEME_KEY = 'fractionlab-theme'
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Light mode is the default; dark only if the user chose it before.
  const [theme, setTheme] = useState(() => (readString(THEME_KEY) === 'dark' ? 'dark' : 'light'))

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    writeString(THEME_KEY, theme)
  }, [theme])

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }),
    [theme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
