import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { catalogApi } from '@/api/client'
import { useTenantStore } from '@/stores/tenant'

export function useTenantsQuery() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => catalogApi.listTenants(),
  })
}

export function useProductsQuery(tenantId: MaybeRefOrGetter<string | null>) {
  return useQuery({
    queryKey: computed(() => ['products', toValue(tenantId)]),
    queryFn: () => catalogApi.listProducts(toValue(tenantId)!),
    enabled: computed(() => Boolean(toValue(tenantId))),
  })
}

export function useProductQuery(
  tenantId: MaybeRefOrGetter<string>,
  productId: MaybeRefOrGetter<string>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  return useQuery({
    queryKey: computed(() => ['products', toValue(tenantId), toValue(productId)]),
    queryFn: () => catalogApi.getProduct(toValue(tenantId), toValue(productId)),
    enabled: computed(
      () =>
        Boolean(toValue(enabled)) &&
        Boolean(toValue(tenantId)) &&
        Boolean(toValue(productId)),
    ),
  })
}

export function useCatalogSync() {
  const tenantStore = useTenantStore()
  const queryClient = useQueryClient()
  const tenantsQuery = useTenantsQuery()

  watch(
    () => tenantsQuery.data.value,
    (tenants) => {
      if (!tenants?.length) return
      const current = tenantStore.selectedTenantId
      const valid = current && tenants.some((t) => t.id === current)
      if (!valid) tenantStore.selectTenant(tenants[0]!.id)
    },
    { immediate: true },
  )

  watch(
    () => tenantStore.selectedTenantId,
    (id, prev) => {
      if (id && id !== prev) {
        queryClient.invalidateQueries({ queryKey: ['products', id] })
      }
    },
  )

  return { tenantsQuery, tenantStore }
}

export function invalidateProducts(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string,
) {
  queryClient.invalidateQueries({ queryKey: ['products', tenantId] })
}
