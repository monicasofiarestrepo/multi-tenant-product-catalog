<script setup lang="ts">
import type { TenantDto } from '@catalog/shared'
import { useTenantStore } from '@/stores/tenant'

defineProps<{
  tenants: TenantDto[]
  loading?: boolean
}>()

const tenantStore = useTenantStore()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label for="tenant-select" class="text-xs font-semibold uppercase tracking-wide text-muted">
      Marca
    </label>
    <select
      id="tenant-select"
      class="focus-visible:outline-brand min-w-48 rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      :disabled="loading"
      :value="tenantStore.selectedTenantId ?? ''"
      @change="tenantStore.selectTenant(($event.target as HTMLSelectElement).value)"
    >
      <option v-if="tenants.length === 0" value="" disabled>
        Sin marcas — crea una
      </option>
      <option v-else-if="!tenantStore.selectedTenantId" value="" disabled>
        Selecciona marca
      </option>
      <option v-for="t in tenants" :key="t.id" :value="t.id">
        {{ t.name }}
      </option>
    </select>
  </div>
</template>
