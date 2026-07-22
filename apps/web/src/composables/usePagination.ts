import { computed, ref, watch } from 'vue'

export const CATALOG_PAGE_SIZE = 30

export function usePagination<T>(items: () => T[], pageSize: number) {
  const page = ref(1)

  const totalItems = computed(() => items().length)
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems.value / pageSize)),
  )

  watch(totalPages, (max) => {
    if (page.value > max) page.value = max
  })

  const paginated = computed(() => {
    if (totalItems.value === 0) return []
    const start = (page.value - 1) * pageSize
    return items().slice(start, start + pageSize)
  })

  const visiblePages = computed(() => {
    const total = totalPages.value
    const current = page.value
    const maxVisible = 10
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    let end = Math.min(total, current + 5)
    let start = Math.max(1, end - maxVisible + 1)
    end = Math.min(total, start + maxVisible - 1)
    start = Math.max(1, end - maxVisible + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })

  function goTo(next: number) {
    page.value = Math.min(Math.max(1, next), totalPages.value)
  }

  function resetPage() {
    page.value = 1
  }

  return {
    page,
    totalItems,
    totalPages,
    paginated,
    visiblePages,
    goTo,
    resetPage,
  }
}
