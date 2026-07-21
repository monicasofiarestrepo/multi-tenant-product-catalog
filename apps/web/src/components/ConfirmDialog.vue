<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  confirm: []
}>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="'confirm-title'"
    @click.self="open = false"
  >
    <div class="w-full max-w-md rounded-lg border border-border bg-surface-elevated p-6 shadow-md">
      <h2 id="confirm-title" class="text-lg font-semibold text-ink">{{ title }}</h2>
      <p class="mt-2 text-sm text-muted">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="focus-visible:outline-brand rounded-md border border-border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
          @click="open = false"
        >
          {{ cancelLabel ?? 'Cancelar' }}
        </button>
        <button
          type="button"
          class="focus-visible:outline-brand rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink-near focus-visible:outline-2 focus-visible:outline-offset-2"
          @click="emit('confirm')"
        >
          {{ confirmLabel ?? 'Confirmar' }}
        </button>
      </div>
    </div>
  </div>
</template>
