<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import ProductFilters from '@/components/ProductFilters.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProductFilters } from '@/composables/useProductFilters'
import { useCatalogSync, useProductsQuery } from '@/composables/useCatalogQueries'

const { tenantsQuery, tenantStore } = useCatalogSync()
const productsQuery = useProductsQuery(computed(() => tenantStore.selectedTenantId))

const allProducts = computed(() => productsQuery.data.value ?? [])
const { search, category, categories, filtered, reset } = useProductFilters(() => allProducts.value)

watch(
  () => tenantStore.selectedTenantId,
  () => reset(),
)
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-ink-deep">Catálogo</h2>
        <p class="text-sm text-muted">Productos por marca (multi-tenant)</p>
      </div>
      <RouterLink
        v-if="tenantStore.selectedTenantId"
        :to="'/products/new'"
        class="focus-visible:outline-brand inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Agregar producto
      </RouterLink>
    </div>

    <p v-if="tenantsQuery.isError.value" class="text-sm text-danger">
      No se pudo cargar marcas. Intenta de nuevo.
    </p>
    <p v-if="productsQuery.isError.value" class="text-sm text-danger">
      No se pudo cargar el catálogo. Intenta de nuevo.
    </p>

    <ProductFilters
      v-if="tenantStore.selectedTenantId"
      v-model:search="search"
      v-model:category="category"
      :categories="categories"
    />

    <ProductGrid
      :products="filtered"
      :loading="productsQuery.isLoading.value || tenantsQuery.isLoading.value"
    />
  </section>
</template>
