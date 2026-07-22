import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { catalogApi } from '@/api/client'
import { ALL_TENANTS_ID, isAllTenants, useTenantStore } from '@/stores/tenant'

export function useTenantsQuery() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => catalogApi.listTenants(),
  })
}

export function useProductsQuery(tenantId: MaybeRefOrGetter<string | null>) {
  const tenantsQuery = useTenantsQuery()

  return useQuery({
    queryKey: computed(() => ['products', toValue(tenantId)]),
    queryFn: async () => {
      const id = toValue(tenantId)
      if (!id) return []
      if (isAllTenants(id)) {
        const tenants = tenantsQuery.data.value ?? (await catalogApi.listTenants())
        const batches = await Promise.all(tenants.map((t) => catalogApi.listProducts(t.id)))
        return batches.flat().sort((a, b) => a.name.localeCompare(b.name, 'es'))
      }
      return catalogApi.listProducts(id)
    },
    enabled: computed(() => {
      const id = toValue(tenantId)
      if (!id) return false
      if (isAllTenants(id)) return (tenantsQuery.data.value?.length ?? 0) > 0
      return true
    }),
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
        !isAllTenants(toValue(tenantId)) &&
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
      if (!tenants) return
      const current = tenantStore.selectedTenantId
      if (isAllTenants(current)) return
      const valid = current && tenants.some((t) => t.id === current)
      if (!valid) tenantStore.selectTenant(ALL_TENANTS_ID)
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
  queryClient.invalidateQueries({ queryKey: ['products', ALL_TENANTS_ID] })
}
