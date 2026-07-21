<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { catalogApi } from '@/api/client'
import { invalidateProducts, useProductQuery } from '@/composables/useCatalogQueries'
import { useToast } from '@/composables/useToast'
import { useTenantStore } from '@/stores/tenant'

const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()
const queryClient = useQueryClient()
const { push: toast } = useToast()

const productId = computed(() => route.params.id as string)
const tenantId = computed(() => tenantStore.selectedTenantId ?? '')

const productQuery = useProductQuery(tenantId, productId)
const confirmOpen = ref(false)

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
  <div v-if="productQuery.isLoading.value" class="h-48 animate-pulse rounded-lg bg-surface-elevated" />
  <p v-else-if="productQuery.isError.value" class="text-danger">No se pudo cargar el producto.</p>
  <article v-else-if="productQuery.data.value" class="grid gap-8 lg:grid-cols-2">
    <div class="overflow-hidden rounded-lg border border-border bg-surface-elevated">
      <img
        v-if="productQuery.data.value.imageUrls[0]"
        :src="productQuery.data.value.imageUrls[0]"
        :alt="productQuery.data.value.name"
        class="aspect-square w-full object-cover"
      />
      <div v-else class="flex aspect-square items-center justify-center text-muted">Sin imagen</div>
    </div>
    <div class="space-y-4">
      <p class="text-sm font-medium uppercase text-brand">{{ productQuery.data.value.category }}</p>
      <h1 class="text-3xl font-bold text-ink-deep">{{ productQuery.data.value.name }}</h1>
      <p class="text-muted">{{ productQuery.data.value.description }}</p>
      <p class="text-2xl font-bold text-ink">${{ productQuery.data.value.price.toLocaleString() }}</p>
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
    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Eliminar producto"
      message="¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
      confirm-label="Eliminar"
      @confirm="onConfirmDelete"
    />
  </article>
</template>
