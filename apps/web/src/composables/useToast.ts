import { ref } from 'vue'

export type ToastKind = 'success' | 'error'

export interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

const toasts = ref<ToastItem[]>([])
let seq = 0

export function useToast() {
  function push(message: string, kind: ToastKind = 'success') {
    const id = ++seq
    toasts.value.push({ id, message, kind })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 4000)
  }
  return { toasts, push }
}
