<script setup lang="ts">
import type { ProductDto } from '@catalog/shared'
import ProductCard from './ProductCard.vue'

defineProps<{
  products: ProductDto[]
  loading?: boolean
  manageMode?: boolean
}>()
</script>

<template>
  <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="n in 6"
      :key="n"
      class="h-64 animate-pulse rounded-lg bg-surface-elevated"
    />
  </div>
  <p v-else-if="products.length === 0" class="rounded-lg border border-border bg-surface-elevated p-8 text-center text-muted">
    No hay productos que coincidan con el filtro.
  </p>
  <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
      :manage-mode="manageMode"
    />
  </div>
</template>
