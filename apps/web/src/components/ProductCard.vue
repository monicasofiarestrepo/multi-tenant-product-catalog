<script setup lang="ts">
import type { ProductDto } from '@catalog/shared'
import { RouterLink } from 'vue-router'

defineProps<{
  product: ProductDto
}>()
</script>

<template>
  <article
    class="overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm transition hover:shadow-md"
  >
    <RouterLink :to="`/products/${product.id}`" class="block focus-visible:outline-brand focus-visible:outline-2">
      <div class="aspect-4/3 bg-surface">
        <img
          v-if="product.imageUrls[0]"
          :src="product.imageUrls[0]"
          :alt="product.name"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="flex h-full items-center justify-center text-sm text-muted"
        >
          Sin imagen
        </div>
      </div>
      <div class="space-y-1 p-4">
        <p class="text-xs font-medium uppercase text-brand">{{ product.category }}</p>
        <h3 class="text-lg font-semibold text-ink">{{ product.name }}</h3>
        <p class="text-sm text-muted line-clamp-2">{{ product.description }}</p>
        <p class="pt-1 text-base font-bold text-ink-deep">
          ${{ product.price.toLocaleString() }}
        </p>
      </div>
    </RouterLink>
  </article>
</template>
