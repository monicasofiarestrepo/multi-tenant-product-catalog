<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import CatalogPagination from '@/components/CatalogPagination.vue'
import ProductFilters from '@/components/ProductFilters.vue'
import ProductFiltersSkeleton from '@/components/ProductFiltersSkeleton.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProductFilters } from '@/composables/useProductFilters'
import { CATALOG_PAGE_SIZE, usePagination } from '@/composables/usePagination'
import { useCatalogSync, useProductsQuery } from '@/composables/useCatalogQueries'

const { tenantsQuery, tenantStore } = useCatalogSync()
const productsQuery = useProductsQuery(computed(() => tenantStore.selectedTenantId))

const allProducts = computed(() => productsQuery.data.value ?? [])
const { search, category, categories, filtered, reset } = useProductFilters(() => allProducts.value)
const {
  page,
  totalPages,
  paginated: pagedProducts,
  visiblePages,
  resetPage,
} = usePagination(() => filtered.value, CATALOG_PAGE_SIZE)

const catalogTop = ref<HTMLElement | null>(null)
const manageMode = ref(false)
const canManage = computed(() => Boolean(tenantStore.selectedTenantId) && !tenantStore.showingAll)
const catalogLoading = computed(
  () => productsQuery.isLoading.value || tenantsQuery.isLoading.value,
)
const showPagination = computed(
  () => !catalogLoading.value && filtered.value.length > CATALOG_PAGE_SIZE,
)

watch(
  () => tenantStore.selectedTenantId,
  () => {
    reset()
    resetPage()
    manageMode.value = false
  },
)

watch([search, category], () => {
  resetPage()
})

function onPageNavigate() {
  catalogTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section ref="catalogTop" class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-ink-deep">Catálogo</h2>
        <p class="text-sm text-muted">
          {{
            tenantStore.showingAll
              ? 'Vista agregada (solo lectura). Elige una marca para aislar el catálogo y administrar.'
              : 'Productos de esta marca (catálogo aislado)'
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
        “Todas” solo muestra; el CRUD queda por marca.
      </p>
    </div>

    <p v-if="tenantsQuery.isError.value" class="text-sm text-danger">
      No se pudo cargar marcas. Intenta de nuevo.
    </p>
    <p v-if="productsQuery.isError.value" class="text-sm text-danger">
      No se pudo cargar el catálogo. Intenta de nuevo.
    </p>

    <ProductFiltersSkeleton v-if="catalogLoading && tenantStore.selectedTenantId" />
    <ProductFilters
      v-else-if="tenantStore.selectedTenantId"
      v-model:search="search"
      v-model:category="category"
      :categories="categories"
    />

    <div
      v-if="
        tenantStore.selectedTenantId &&
        !catalogLoading &&
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

    <div
      v-else-if="tenantStore.selectedTenantId || catalogLoading"
      class="space-y-6"
    >
      <ProductGrid
        :products="pagedProducts"
        :loading="catalogLoading"
        :manage-mode="manageMode"
      />
      <CatalogPagination
        v-if="showPagination"
        v-model:page="page"
        :total-pages="totalPages"
        :visible-pages="visiblePages"
        @navigate="onPageNavigate"
      />
    </div>
  </section>
</template>
