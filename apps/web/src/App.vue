<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AddBrandDialog from '@/components/AddBrandDialog.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TenantSelector from '@/components/TenantSelector.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useCatalogSync } from '@/composables/useCatalogQueries'

const { tenantsQuery } = useCatalogSync()
const addBrandOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-border bg-surface-elevated/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-brand">Catálogo</p>
          <RouterLink to="/" class="text-xl font-bold text-ink focus-visible:outline-brand focus-visible:outline-2">
            Multi-tenant Product Catalog
          </RouterLink>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <TenantSelector
            :tenants="tenantsQuery.data.value ?? []"
            :loading="tenantsQuery.isLoading.value"
          />
          <button
            type="button"
            class="focus-visible:outline-brand rounded-md border border-brand px-3 py-2 text-sm font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2"
            @click="addBrandOpen = true"
          >
            + Nueva marca
          </button>
        </div>
      </div>
    </header>
    <AddBrandDialog v-model:open="addBrandOpen" />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <RouterView />
    </main>
    <SiteFooter />
    <ToastContainer />
  </div>
</template>
