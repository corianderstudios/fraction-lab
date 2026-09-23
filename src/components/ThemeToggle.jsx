import { useTheme } from '../context/ThemeContext.jsx'
import { MoonIcon, SunIcon } from './Icons.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button type="button" onClick={toggleTheme} className="icon-btn" aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
