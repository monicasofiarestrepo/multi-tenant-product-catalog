<script setup lang="ts">
import type { TenantDto } from '@catalog/shared'
import { computed } from 'vue'
import { ALL_TENANTS_ID, useTenantStore } from '@/stores/tenant'

const props = defineProps<{
  tenants: TenantDto[]
  loading?: boolean
}>()

const tenantStore = useTenantStore()

const sortedTenants = computed(() =>
  [...props.tenants].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })),
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <label for="tenant-select" class="text-xs font-semibold uppercase tracking-wide text-muted">
      Marca
    </label>
    <select
      id="tenant-select"
      class="select-control header-control min-w-48 max-w-full py-0"
      :disabled="loading"
      :value="tenantStore.selectedTenantId ?? ALL_TENANTS_ID"
      @change="tenantStore.selectTenant(($event.target as HTMLSelectElement).value)"
    >
      <option :value="ALL_TENANTS_ID">Todas</option>
      <option v-for="t in sortedTenants" :key="t.id" :value="t.id">
        {{ t.name }}
      </option>
    </select>
  </div>
</template>
