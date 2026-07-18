import { useTheme } from '../context/ThemeContext.jsx'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`size-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="size-4 text-amber-400" />
      ) : (
        <Moon className="size-4 text-violet-600" />
      )}
    </button>
  )
}

export default ThemeToggle
