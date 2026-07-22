import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { getTenantCookie, setTenantCookie } from '@/utils/cookie'

/** Sentinel: show products from every brand */
export const ALL_TENANTS_ID = '__all__'

export function isAllTenants(id: string | null | undefined) {
  return id === ALL_TENANTS_ID
}

export const useTenantStore = defineStore('tenant', () => {
  const cookie = getTenantCookie()
  const selectedTenantId = ref<string | null>(cookie ?? ALL_TENANTS_ID)

  const showingAll = computed(() => isAllTenants(selectedTenantId.value))

  function selectTenant(id: string) {
    selectedTenantId.value = id
    setTenantCookie(id)
  }

  watch(selectedTenantId, (id) => {
    if (id) setTenantCookie(id)
  })

  return { selectedTenantId, showingAll, selectTenant }
})
