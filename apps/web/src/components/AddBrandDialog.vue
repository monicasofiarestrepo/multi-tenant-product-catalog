<script setup lang="ts">
import { tenantCreateSchema, slugifyTenantName } from '@catalog/shared'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { catalogApi, ApiError } from '@/api/client'
import { useToast } from '@/composables/useToast'
import { useTenantStore } from '@/stores/tenant'

const open = defineModel<boolean>('open', { required: true })

const name = ref('')
const slugOverride = ref('')
const useCustomSlug = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const queryClient = useQueryClient()
const tenantStore = useTenantStore()
const { push: toast } = useToast()

const previewSlug = computed(() => {
  if (useCustomSlug.value && slugOverride.value.trim()) {
    return slugOverride.value.trim().toLowerCase()
  }
  return slugifyTenantName(name.value)
})

watch(open, (isOpen) => {
  if (!isOpen) {
    name.value = ''
    slugOverride.value = ''
    useCustomSlug.value = false
    fieldErrors.value = {}
  }
})

const createMutation = useMutation({
  mutationFn: async () => {
    const payload = {
      name: name.value.trim(),
      ...(useCustomSlug.value && slugOverride.value.trim()
        ? { slug: slugOverride.value.trim().toLowerCase() }
        : {}),
    }
    const parsed = tenantCreateSchema.safeParse(payload)
    if (!parsed.success) {
      fieldErrors.value = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? 'form'
        fieldErrors.value[key] = issue.message
      }
      throw new Error('validation')
    }
    return catalogApi.createTenant(parsed.data)
  },
  onSuccess: async (tenant) => {
    await queryClient.invalidateQueries({ queryKey: ['tenants'] })
    tenantStore.selectTenant(tenant.id)
    toast(`Marca "${tenant.name}" creada`)
    open.value = false
  },
  onError: (e: Error) => {
    if (e.message === 'validation') return
    if (e instanceof ApiError && e.code === 'CONFLICT') {
      toast('Ya existe una marca con ese identificador', 'error')
      return
    }
    toast(e instanceof ApiError ? e.message : 'No se pudo crear la marca', 'error')
  },
})

function onSubmit() {
  fieldErrors.value = {}
  createMutation.mutate()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="add-brand-title"
    @click.self="open = false"
    @keydown="onKeydown"
  >
    <form
      class="w-full max-w-md rounded-lg border border-border bg-surface-elevated p-6 shadow-md"
      @submit.prevent="onSubmit"
    >
      <h2 id="add-brand-title" class="text-lg font-semibold text-ink-deep">Nueva marca</h2>
      <p class="mt-1 text-sm text-muted">Agrega un tenant al catálogo multi-marca.</p>

      <div class="mt-4 space-y-4">
        <div>
          <label for="brand-name" class="text-sm font-medium text-ink">Nombre de la marca</label>
          <input
            id="brand-name"
            v-model="name"
            type="text"
            required
            maxlength="80"
            class="focus-visible:outline-brand mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          <p v-if="fieldErrors.name" class="mt-1 text-xs text-danger">{{ fieldErrors.name }}</p>
        </div>

        <div>
          <label class="flex items-center gap-2 text-sm text-ink">
            <input v-model="useCustomSlug" type="checkbox" class="rounded border-border" />
            Personalizar identificador (slug)
          </label>
          <input
            v-if="useCustomSlug"
            id="brand-slug"
            v-model="slugOverride"
            type="text"
            maxlength="64"
            placeholder="mi-marca"
            class="focus-visible:outline-brand mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          <p v-if="fieldErrors.slug" class="mt-1 text-xs text-danger">{{ fieldErrors.slug }}</p>
          <p class="mt-2 text-xs text-muted">
            ID en catálogo: <span class="font-mono text-ink">{{ previewSlug }}</span>
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="focus-visible:outline-brand rounded-md border border-border px-4 py-2 text-sm focus-visible:outline-2"
          @click="open = false"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="focus-visible:outline-brand rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2"
          :disabled="createMutation.isPending.value || !name.trim()"
        >
          {{ createMutation.isPending.value ? 'Creando…' : 'Crear marca' }}
        </button>
      </div>
    </form>
  </div>
</template>
