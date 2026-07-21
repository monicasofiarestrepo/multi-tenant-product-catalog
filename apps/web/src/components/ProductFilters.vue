<script setup lang="ts">
const search = defineModel<string>('search', { required: true })
const category = defineModel<string>('category', { required: true })

defineProps<{
  categories: string[]
}>()
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
    <div class="flex flex-1 flex-col gap-1">
      <label for="product-search" class="text-sm font-medium text-ink">Buscar</label>
      <input
        id="product-search"
        v-model="search"
        type="search"
        placeholder="Nombre del producto"
        class="focus-visible:outline-brand rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      />
    </div>
    <div class="flex flex-col gap-1 sm:w-48">
      <label for="product-category" class="text-sm font-medium text-ink">Categoría</label>
      <select
        id="product-category"
        v-model="category"
        class="focus-visible:outline-brand rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <option value="">Todas</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>
  </div>
</template>
