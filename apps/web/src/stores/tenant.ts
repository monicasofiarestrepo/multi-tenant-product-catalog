import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getTenantCookie, setTenantCookie } from '@/utils/cookie'

export const useTenantStore = defineStore('tenant', () => {
  const selectedTenantId = ref<string | null>(getTenantCookie())

  function selectTenant(id: string) {
    selectedTenantId.value = id
    setTenantCookie(id)
  }

  watch(selectedTenantId, (id) => {
    if (id) setTenantCookie(id)
  })

  return { selectedTenantId, selectTenant }
})
