<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="rounded-md px-4 py-3 text-sm font-medium shadow-md"
      :class="t.kind === 'success' ? 'bg-brand text-ink-near' : 'bg-danger text-white'"
    >
      {{ t.message }}
    </div>
  </div>
</template>
