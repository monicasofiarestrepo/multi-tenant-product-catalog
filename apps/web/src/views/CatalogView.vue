<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import ProductFilters from '@/components/ProductFilters.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProductFilters } from '@/composables/useProductFilters'
import { useCatalogSync, useProductsQuery } from '@/composables/useCatalogQueries'

const { tenantsQuery, tenantStore } = useCatalogSync()
const productsQuery = useProductsQuery(computed(() => tenantStore.selectedTenantId))

const allProducts = computed(() => productsQuery.data.value ?? [])
const { search, category, categories, filtered, reset } = useProductFilters(() => allProducts.value)
const manageMode = ref(false)
const canManage = computed(() => Boolean(tenantStore.selectedTenantId) && !tenantStore.showingAll)

watch(
  () => tenantStore.selectedTenantId,
  () => {
    reset()
    manageMode.value = false
  },
)
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-ink-deep">Catálogo</h2>
        <p class="text-sm text-muted">
          {{
            tenantStore.showingAll
              ? 'Productos de todas las marcas'
              : 'Productos por marca (multi-tenant)'
          }}
        </p>
      </div>
      <div v-if="canManage" class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="focus-visible:outline-brand inline-flex items-center justify-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
          :aria-pressed="manageMode"
          @click="manageMode = !manageMode"
        >
          {{ manageMode ? 'Listo' : 'Administrar' }}
        </button>
        <RouterLink
          to="/products/new"
          class="focus-visible:outline-brand inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Agregar producto
        </RouterLink>
      </div>
      <p v-else-if="tenantStore.showingAll" class="text-xs text-muted sm:max-w-xs sm:text-right">
        Elige una marca para administrar o agregar productos.
      </p>
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

    <div
      v-if="
        tenantStore.selectedTenantId &&
        !productsQuery.isLoading.value &&
        !productsQuery.isError.value &&
        allProducts.length === 0
      "
      class="flex min-h-56 flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface-elevated px-6 py-12 text-center"
    >
      <p class="text-base text-muted">
        {{
          tenantStore.showingAll
            ? 'Aún no hay productos en el catálogo'
            : 'Esta marca no cuenta con productos'
        }}
      </p>
      <RouterLink
        v-if="canManage"
        to="/products/new"
        class="focus-visible:outline-brand inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Agregar productos
      </RouterLink>
    </div>

    <ProductGrid
      v-else
      :products="filtered"
      :loading="productsQuery.isLoading.value || tenantsQuery.isLoading.value"
      :manage-mode="manageMode"
    />
  </section>
</template>
