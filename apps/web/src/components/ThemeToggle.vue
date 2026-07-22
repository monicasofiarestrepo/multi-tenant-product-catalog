<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    role="switch"
    :aria-checked="theme.isDark"
    :aria-label="theme.isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
    @click="theme.toggle()"
  >
    <span class="theme-toggle__track" aria-hidden="true">
      <span class="theme-toggle__icon theme-toggle__icon--sun">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="4" />
          <path
            stroke-linecap="round"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
          />
        </svg>
      </span>
      <span class="theme-toggle__icon theme-toggle__icon--moon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 14.5A8.5 8.5 0 119.5 3a7 7 0 0011.5 11.5z"
          />
        </svg>
      </span>
      <span class="theme-toggle__knob">
        <svg
          v-if="!theme.isDark"
          class="theme-toggle__knob-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            stroke-linecap="round"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
          />
        </svg>
        <svg
          v-else
          class="theme-toggle__knob-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 14.5A8.5 8.5 0 119.5 3a7 7 0 0011.5 11.5z"
          />
        </svg>
      </span>
    </span>
  </button>
</template>
