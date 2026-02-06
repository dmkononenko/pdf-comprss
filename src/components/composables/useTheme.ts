import { ref, onMounted, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'pdf-compressor-theme'

const theme = ref<Theme>('system')
const resolvedTheme = ref<'light' | 'dark'>('light')

export function useTheme() {
  const isDark = ref(false)

  onMounted(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme
    }

    applyTheme()
  })

  function applyTheme() {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    let resolved: 'light' | 'dark'

    if (theme.value === 'system') {
      resolved = mediaQuery.matches ? 'dark' : 'light'
    } else {
      resolved = theme.value
    }

    resolvedTheme.value = resolved
    isDark.value = resolved === 'dark'

    if (resolved === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme()
  }

  // Listen for system theme changes when using 'system' theme
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme.value === 'system') {
        applyTheme()
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  })

  return {
    theme,
    resolvedTheme,
    isDark,
    setTheme
  }
}
