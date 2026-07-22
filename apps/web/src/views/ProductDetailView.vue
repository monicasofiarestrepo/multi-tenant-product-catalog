<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { ProductDto, TenantDto } from '@catalog/shared'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { catalogApi } from '@/api/client'
import {
  invalidateProducts,
  useProductsQuery,
  useProductQuery,
  useTenantsQuery,
} from '@/composables/useCatalogQueries'
import { useToast } from '@/composables/useToast'
import { isAllTenants, useTenantStore } from '@/stores/tenant'

type SearchHit = ProductDto & { tenantName: string }

const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()
const queryClient = useQueryClient()
const { push: toast } = useToast()

const productId = computed(() => route.params.id as string)

const tenantsQuery = useTenantsQuery()
const productsQuery = useProductsQuery(computed(() => tenantStore.selectedTenantId))

const tenantId = computed(() => {
  const scope = tenantStore.selectedTenantId
  if (scope && !isAllTenants(scope)) return scope
  const hit = productsQuery.data.value?.find((p) => p.id === productId.value)
  return hit?.tenantId ?? ''
})

const productQuery = useProductQuery(
  tenantId,
  productId,
  computed(() => {
    const list = productsQuery.data.value
    if (!list) return false
    return list.some((p) => p.id === productId.value)
  }),
)

const confirmOpen = ref(false)
const search = ref('')
const searchOpen = ref(false)

const siblingProducts = computed(() => productsQuery.data.value ?? [])
const currentIndex = computed(() =>
  siblingProducts.value.findIndex((p) => p.id === productId.value),
)
const prevProduct = computed(() => {
  const i = currentIndex.value
  if (i <= 0) return null
  return siblingProducts.value[i - 1] ?? null
})
const nextProduct = computed(() => {
  const i = currentIndex.value
  if (i < 0 || i >= siblingProducts.value.length - 1) return null
  return siblingProducts.value[i + 1] ?? null
})

const catalogEmpty = computed(
  () =>
    Boolean(tenantId.value) &&
    !productsQuery.isLoading.value &&
    !productsQuery.isError.value &&
    siblingProducts.value.length === 0,
)

const productMissing = computed(
  () =>
    Boolean(tenantId.value) &&
    !productsQuery.isLoading.value &&
    siblingProducts.value.length > 0 &&
    currentIndex.value === -1,
)

watch(
  [productMissing, siblingProducts],
  ([missing, list]) => {
    if (missing && list[0]) {
      router.replace(`/products/${list[0].id}`)
    }
  },
  { immediate: true },
)

const allProductsQuery = useQuery({
  queryKey: computed(() => [
    'products-search-index',
    (tenantsQuery.data.value ?? []).map((t) => t.id).join(','),
  ]),
  queryFn: async (): Promise<SearchHit[]> => {
    const tenants: TenantDto[] = tenantsQuery.data.value ?? []
    const batches = await Promise.all(
      tenants.map(async (t) => {
        const products = await catalogApi.listProducts(t.id)
        return products.map((p) => ({ ...p, tenantName: t.name }))
      }),
    )
    return batches.flat()
  },
  enabled: computed(() => searchOpen.value && Boolean(tenantsQuery.data.value?.length)),
  staleTime: 30_000,
})

const searchHits = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return []
  return (allProductsQuery.data.value ?? [])
    .filter((p) => p.name.toLowerCase().includes(q))
    .slice(0, 8)
})

function goToHit(hit: SearchHit) {
  tenantStore.selectTenant(hit.tenantId)
  search.value = ''
  searchOpen.value = false
  router.push(`/products/${hit.id}`)
}

function onSearchBlur() {
  window.setTimeout(() => {
    searchOpen.value = false
  }, 150)
}

const deleteMutation = useMutation({
  mutationFn: () => catalogApi.deleteProduct(tenantId.value, productId.value),
  onSuccess: () => {
    invalidateProducts(queryClient, tenantId.value)
    toast('Producto eliminado')
    router.push('/')
  },
  onError: () => toast('No se pudo eliminar, intenta de nuevo', 'error'),
})

function onConfirmDelete() {
  confirmOpen.value = false
  deleteMutation.mutate()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        class="focus-visible:outline-brand inline-flex items-center gap-2 self-start rounded-md text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label="Volver al catálogo"
        @click="router.push('/')"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Catálogo
      </button>

      <div class="relative w-full max-w-md">
        <label for="product-search" class="sr-only">Buscar producto</label>
        <input
          id="product-search"
          v-model="search"
          type="search"
          placeholder="Buscar por nombre (todas las marcas)"
          class="focus-visible:outline-brand w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          autocomplete="off"
          @focus="searchOpen = true"
          @blur="onSearchBlur"
        />
        <ul
          v-if="searchOpen && search.trim() && (searchHits.length || allProductsQuery.isFetching.value)"
          class="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-surface-elevated shadow-md"
          role="listbox"
        >
          <li
            v-if="allProductsQuery.isFetching.value && !searchHits.length"
            class="px-3 py-2 text-sm text-muted"
          >
            Buscando…
          </li>
          <li
            v-for="hit in searchHits"
            :key="`${hit.tenantId}-${hit.id}`"
            role="option"
          >
            <button
              type="button"
              class="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-surface"
              @mousedown.prevent="goToHit(hit)"
            >
              <span class="font-medium text-ink">{{ hit.name }}</span>
              <span class="text-xs text-muted">{{ hit.tenantName }}</span>
            </button>
          </li>
          <li
            v-if="!allProductsQuery.isFetching.value && search.trim() && !searchHits.length"
            class="px-3 py-2 text-sm text-muted"
          >
            Sin resultados
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="productsQuery.isLoading.value"
      class="h-48 animate-pulse rounded-lg bg-surface-elevated"
    />

    <div
      v-else-if="catalogEmpty"
      class="flex min-h-72 flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface-elevated px-6 py-16 text-center"
    >
      <p class="text-base text-muted">Esta marca no cuenta con productos</p>
      <RouterLink
        to="/products/new"
        class="focus-visible:outline-brand inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Agregar productos
      </RouterLink>
    </div>

    <p v-else-if="productsQuery.isError.value" class="text-danger">
      No se pudo cargar el catálogo. Intenta de nuevo.
    </p>

    <div
      v-else-if="productQuery.isLoading.value"
      class="h-48 animate-pulse rounded-lg bg-surface-elevated"
    />

    <p v-else-if="productQuery.isError.value" class="text-danger">
      No se pudo cargar el producto.
    </p>

    <div
      v-else-if="productQuery.data.value"
      class="flex flex-col gap-4"
    >
      <div class="flex items-center justify-between gap-2 lg:hidden">
        <button
          type="button"
          class="focus-visible:outline-brand flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-ink disabled:opacity-30 focus-visible:outline-2"
          :disabled="!prevProduct"
          aria-label="Producto anterior"
          @click="prevProduct && router.push(`/products/${prevProduct.id}`)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="focus-visible:outline-brand flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-ink disabled:opacity-30 focus-visible:outline-2"
          :disabled="!nextProduct"
          aria-label="Producto siguiente"
          @click="nextProduct && router.push(`/products/${nextProduct.id}`)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div class="relative grid items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <button
          type="button"
          class="focus-visible:outline-brand hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-ink disabled:opacity-30 focus-visible:outline-2 lg:flex"
          :disabled="!prevProduct"
          aria-label="Producto anterior"
          @click="prevProduct && router.push(`/products/${prevProduct.id}`)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <article class="grid gap-8 lg:grid-cols-2">
          <div class="overflow-hidden rounded-lg border border-border bg-surface-elevated">
            <img
              v-if="productQuery.data.value.imageUrls[0]"
              :src="productQuery.data.value.imageUrls[0]"
              :alt="productQuery.data.value.name"
              class="aspect-square w-full object-cover"
            />
            <div v-else class="flex aspect-square items-center justify-center text-muted">
              Sin imagen
            </div>
          </div>
          <div class="space-y-4">
            <p class="text-sm font-medium uppercase text-brand">
              {{ productQuery.data.value.category }}
            </p>
            <h1 class="text-3xl font-bold text-ink-deep">{{ productQuery.data.value.name }}</h1>
            <p class="text-muted">{{ productQuery.data.value.description }}</p>
            <p class="text-2xl font-bold text-ink">
              ${{ productQuery.data.value.price.toLocaleString() }}
            </p>
            <div class="flex flex-wrap gap-3 pt-4">
              <RouterLink
                :to="`/products/${productId}/edit`"
                class="focus-visible:outline-brand rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Editar
              </RouterLink>
              <button
                type="button"
                class="focus-visible:outline-brand rounded-md border border-danger px-4 py-2 text-sm text-danger focus-visible:outline-2 focus-visible:outline-offset-2"
                @click="confirmOpen = true"
              >
                Eliminar
              </button>
            </div>
          </div>
        </article>

        <button
          type="button"
          class="focus-visible:outline-brand hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-ink disabled:opacity-30 focus-visible:outline-2 lg:flex"
          :disabled="!nextProduct"
          aria-label="Producto siguiente"
          @click="nextProduct && router.push(`/products/${nextProduct.id}`)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <ConfirmDialog
        v-model:open="confirmOpen"
        title="Eliminar producto"
        message="¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirm-label="Eliminar"
        @confirm="onConfirmDelete"
      />
    </div>
  </div>
</template>
