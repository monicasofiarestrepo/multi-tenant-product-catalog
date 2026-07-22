<script setup lang="ts">
import { computed } from 'vue'

const page = defineModel<number>('page', { required: true })

const props = defineProps<{
  totalPages: number
  visiblePages: number[]
}>()

const emit = defineEmits<{
  navigate: []
}>()

const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value < props.totalPages)

function setPage(n: number) {
  if (n === page.value || n < 1 || n > props.totalPages) return
  page.value = n
  emit('navigate')
}

function prev() {
  setPage(page.value - 1)
}

function next() {
  setPage(page.value + 1)
}
</script>

<template>
  <nav
    class="catalog-pagination"
    aria-label="Paginación del catálogo"
  >
    <button
      v-if="canPrev"
      type="button"
      class="catalog-pagination__nav catalog-pagination__nav--prev focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2"
      @click="prev"
    >
      <svg
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Anterior
    </button>

    <ol class="catalog-pagination__pages" role="list">
      <li v-for="n in visiblePages" :key="n">
        <button
          type="button"
          class="catalog-pagination__page focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2"
          :class="{ 'catalog-pagination__page--active': n === page }"
          :aria-current="n === page ? 'page' : undefined"
          :aria-label="`Página ${n}`"
          @click="setPage(n)"
        >
          {{ n }}
        </button>
      </li>
    </ol>

    <button
      v-if="canNext"
      type="button"
      class="catalog-pagination__nav catalog-pagination__nav--next focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2"
      @click="next"
    >
      Siguiente
      <svg
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </nav>
</template>

<style scoped>
.catalog-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding-top: var(--space-2);
}

.catalog-pagination__pages {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.catalog-pagination__page {
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-muted);
  cursor: pointer;
  transition:
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out);
}

.catalog-pagination__page:hover:not(.catalog-pagination__page--active) {
  color: var(--color-ink);
}

.catalog-pagination__page--active {
  border-color: var(--color-brand);
  background: var(--color-surface-elevated);
  color: var(--color-ink-deep);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.catalog-pagination__nav {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-1);
  border: none;
  background: transparent;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-muted);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.catalog-pagination__nav:hover {
  color: var(--color-brand);
}

html.dark .catalog-pagination__page--active {
  border-color: var(--color-brand-bright);
}
</style>