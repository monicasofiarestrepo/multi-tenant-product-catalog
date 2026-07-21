<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import type { ProductDto } from '@catalog/shared'
import { RouterLink } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { catalogApi } from '@/api/client'
import { invalidateProducts } from '@/composables/useCatalogQueries'
import { useToast } from '@/composables/useToast'
import { useTenantStore } from '@/stores/tenant'

const props = defineProps<{
  product: ProductDto
  manageMode?: boolean
}>()

const tenantStore = useTenantStore()
const queryClient = useQueryClient()
const { push: toast } = useToast()
const confirmOpen = ref(false)

const deleteMutation = useMutation({
  mutationFn: () => {
    const tenantId = tenantStore.selectedTenantId
    if (!tenantId) throw new Error('NO_TENANT')
    return catalogApi.deleteProduct(tenantId, props.product.id)
  },
  onSuccess: () => {
    const tenantId = tenantStore.selectedTenantId
    if (tenantId) invalidateProducts(queryClient, tenantId)
    toast('Producto eliminado')
  },
  onError: () => toast('No se pudo eliminar, intenta de nuevo', 'error'),
})

function onConfirmDelete() {
  confirmOpen.value = false
  deleteMutation.mutate()
}

const isDeleting = computed(() => deleteMutation.isPending.value)
</script>

<template>
  <article
    class="overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm transition hover:shadow-md"
  >
    <div class="relative aspect-4/3 bg-surface">
      <RouterLink
        :to="`/products/${product.id}`"
        class="block h-full focus-visible:outline-brand focus-visible:outline-2"
        :tabindex="manageMode ? -1 : undefined"
        :aria-hidden="manageMode || undefined"
        :class="manageMode ? 'pointer-events-none' : ''"
      >
        <img
          v-if="product.imageUrls[0]"
          :src="product.imageUrls[0]"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-200"
          :class="manageMode ? 'opacity-40' : ''"
        />
        <div
          v-else
          class="flex h-full items-center justify-center text-sm text-muted transition duration-200"
          :class="manageMode ? 'opacity-40' : ''"
        >
          Sin imagen
        </div>
      </RouterLink>

      <div
        v-if="manageMode"
        class="absolute inset-0 flex items-center justify-center gap-2 bg-ink/45 p-3"
        role="group"
        :aria-label="`Acciones para ${product.name}`"
      >
        <RouterLink
          :to="`/products/${product.id}/edit`"
          class="focus-visible:outline-brand rounded-md bg-brand px-3 py-2 text-sm font-semibold text-ink shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Editar
        </RouterLink>
        <button
          type="button"
          class="focus-visible:outline-brand rounded-md border border-danger bg-surface-elevated px-3 py-2 text-sm font-medium text-danger shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          :disabled="isDeleting"
          @click="confirmOpen = true"
        >
          Eliminar
        </button>
      </div>
    </div>

    <RouterLink
      :to="`/products/${product.id}`"
      class="block space-y-1 p-4 focus-visible:outline-brand focus-visible:outline-2"
      :class="manageMode ? 'pointer-events-none' : ''"
      :tabindex="manageMode ? -1 : undefined"
    >
      <p class="text-xs font-medium uppercase text-brand">{{ product.category }}</p>
      <h3 class="text-lg font-semibold text-ink">{{ product.name }}</h3>
      <p class="text-sm text-muted line-clamp-2">{{ product.description }}</p>
      <p class="pt-1 text-base font-bold text-ink-deep">
        ${{ product.price.toLocaleString() }}
      </p>
    </RouterLink>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Eliminar producto"
      message="¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
      confirm-label="Eliminar"
      @confirm="onConfirmDelete"
    />
  </article>
</template>
