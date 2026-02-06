<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from './composables/useTheme'
import type { Theme } from './composables/useTheme'

const { theme, setTheme } = useTheme()

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'desktop' }
]

const currentThemeIndex = computed(() => {
  return themes.findIndex((t) => t.value === theme.value)
})

function cycleTheme() {
  const nextIndex = (currentThemeIndex.value + 1) % themes.length
  setTheme(themes[nextIndex].value)
}

const currentIcon = computed(() => {
  const currentTheme = themes[currentThemeIndex.value]
  switch (currentTheme.icon) {
    case 'sun':
      return {
        viewBox: '0 0 24 24',
        path: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
      }
    case 'moon':
      return {
        viewBox: '0 0 24 24',
        path: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
      }
    case 'desktop':
      return {
        viewBox: '0 0 24 24',
        path: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      }
  }
})
</script>

<template>
  <button
    @click="cycleTheme"
    class="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
    :title="`Current theme: ${themes[currentThemeIndex]?.label}`"
    aria-label="Toggle theme"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="currentIcon.viewBox"
      class="w-4 h-4 text-neutral-700 dark:text-neutral-300"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path :d="currentIcon.path" />
    </svg>
  </button>
</template>
