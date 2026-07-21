<script setup lang="ts">
import { productCreateSchema } from '@catalog/shared'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { catalogApi } from '@/api/client'
import { invalidateProducts, useProductQuery } from '@/composables/useCatalogQueries'
import { useToast } from '@/composables/useToast'
import { useTenantStore } from '@/stores/tenant'

const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()
const queryClient = useQueryClient()
const { push: toast } = useToast()

const isEdit = computed(() => route.path.includes('/edit'))
const productId = computed(() => route.params.id as string | undefined)
const tenantId = computed(() => tenantStore.selectedTenantId ?? '')

const existingQuery = useProductQuery(
  tenantId,
  computed(() => productId.value ?? ''),
  isEdit,
)

const name = ref('')
const description = ref('')
const priceInput = ref('')
const category = ref('')
const file = ref<File | null>(null)
const fieldErrors = ref<Record<string, string>>({})

watch(
  () => existingQuery.data.value,
  (p) => {
    if (!p) return
    name.value = p.name
    description.value = p.description
    priceInput.value = sanitizePrice(String(p.price))
    category.value = p.category
  },
  { immediate: true },
)

function sanitizePrice(raw: string) {
  let s = raw.replace(/[^\d.]/g, '')
  const dot = s.indexOf('.')
  if (dot !== -1) {
    s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '')
  }
  const [intPart, decPart] = s.split('.')
  if (decPart !== undefined && decPart.length > 2) {
    return `${intPart}.${decPart.slice(0, 2)}`
  }
  return s
}

function parsePrice(): number | null {
  const trimmed = priceInput.value.trim()
  if (trimmed === '' || trimmed === '.') return null
  const n = Number(trimmed)
  if (Number.isNaN(n) || n < 0) return null
  return n
}

function onPriceInput(e: Event) {
  const el = e.target as HTMLInputElement
  const next = sanitizePrice(el.value)
  priceInput.value = next
  if (el.value !== next) el.value = next
}

function onPriceKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const nav = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (nav.includes(e.key)) return
  if ((e.key === '.' || e.key === 'Decimal') && !priceInput.value.includes('.')) return
  if (/^\d$/.test(e.key)) return
  e.preventDefault()
}

function onPricePaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') ?? ''
  const el = e.target as HTMLInputElement
  const merged = sanitizePrice(`${priceInput.value}${pasted}`)
  priceInput.value = merged
  el.value = merged
}

function validateClient() {
  fieldErrors.value = {}
  const price = parsePrice()
  const parsed = productCreateSchema.safeParse({
    name: name.value,
    description: description.value,
    price: price ?? -1,
    category: category.value,
  })
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form'
      fieldErrors.value[key] = issue.message
    }
    return false
  }
  return true
}

const saveMutation = useMutation({
  mutationFn: async () => {
    if (!tenantId.value) throw new Error('No tenant')
    if (!validateClient()) throw new Error('validation')
    const price = parsePrice()
    if (price === null) throw new Error('validation')
    const payload = {
      name: name.value,
      description: description.value,
      price,
      category: category.value,
    }
    if (isEdit.value && productId.value) {
      let updated = await catalogApi.updateProduct(tenantId.value, productId.value, payload)
      if (file.value) {
        const presign = await catalogApi.presignImage(
          tenantId.value,
          productId.value,
          file.value.type as 'image/jpeg' | 'image/png' | 'image/webp',
        )
        await catalogApi.uploadToPresignedUrl(presign.uploadUrl, file.value)
        updated = await catalogApi.updateProduct(tenantId.value, productId.value, {
          imageUrls: [...updated.imageUrls, presign.publicUrl],
        })
      }
      return updated
    }
    const created = await catalogApi.createProduct(tenantId.value, payload)
    if (!file.value) throw new Error('IMAGE_REQUIRED')
    const presign = await catalogApi.presignImage(
      tenantId.value,
      created.id,
      file.value.type as 'image/jpeg' | 'image/png' | 'image/webp',
    )
    await catalogApi.uploadToPresignedUrl(presign.uploadUrl, file.value)
    return catalogApi.updateProduct(tenantId.value, created.id, {
      imageUrls: [presign.publicUrl],
    })
  },
  onSuccess: (p) => {
    invalidateProducts(queryClient, tenantId.value)
    toast(isEdit.value ? 'Producto actualizado' : 'Producto creado')
    router.push(`/products/${p.id}`)
  },
  onError: (e: Error) => {
    if (e.message === 'validation') {
      toast('Revisa los campos del formulario', 'error')
      return
    }
    if (e.message === 'IMAGE_REQUIRED') {
      fieldErrors.value.image = 'Selecciona al menos una imagen'
      toast('Agrega al menos una imagen', 'error')
      return
    }
    toast('No se pudo guardar, intenta de nuevo', 'error')
  },
})

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
}
</script>

<template>
  <section class="mx-auto max-w-xl space-y-6">
    <h2 class="text-2xl font-semibold text-ink-deep">
      {{ isEdit ? 'Editar producto' : 'Nuevo producto' }}
    </h2>
    <form class="space-y-4" @submit.prevent="saveMutation.mutate()">
      <div>
        <label for="name" class="text-sm font-medium text-ink">Nombre</label>
        <input
          id="name"
          v-model="name"
          class="focus-visible:outline-brand mt-1 w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        <p v-if="fieldErrors.name" class="mt-1 text-xs text-danger">{{ fieldErrors.name }}</p>
      </div>
      <div>
        <label for="description" class="text-sm font-medium text-ink">Descripción</label>
        <textarea
          id="description"
          v-model="description"
          rows="3"
          class="focus-visible:outline-brand mt-1 w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        <p v-if="fieldErrors.description" class="mt-1 text-xs text-danger">{{ fieldErrors.description }}</p>
      </div>
      <div>
        <label for="price" class="text-sm font-medium text-ink">Precio (USD)</label>
        <div
          class="focus-within:outline-brand mt-1 flex overflow-hidden rounded-md border border-border bg-surface-elevated focus-within:outline-2 focus-within:outline-offset-2"
        >
          <span
            class="flex shrink-0 items-center border-r border-border bg-surface px-3 text-sm font-medium text-muted"
            aria-hidden="true"
          >
            $
          </span>
          <input
            id="price"
            :value="priceInput"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder="0.00"
            aria-describedby="price-currency-hint"
            class="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink outline-none"
            @input="onPriceInput"
            @keydown="onPriceKeydown"
            @paste="onPricePaste"
          />
        </div>
        <p id="price-currency-hint" class="mt-1 text-xs text-muted">
          Dólares estadounidenses (USD). Solo números, máximo 2 decimales.
        </p>
        <p v-if="fieldErrors.price" class="mt-1 text-xs text-danger">{{ fieldErrors.price }}</p>
      </div>
      <div>
        <label for="category" class="text-sm font-medium text-ink">Categoría</label>
        <input
          id="category"
          v-model="category"
          class="focus-visible:outline-brand mt-1 w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        <p v-if="fieldErrors.category" class="mt-1 text-xs text-danger">{{ fieldErrors.category }}</p>
      </div>
      <div>
        <label for="image" class="text-sm font-medium text-ink">Imagen</label>
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="focus-visible:outline-brand mt-1 block w-full text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          @change="onFileChange"
        />
        <p v-if="fieldErrors.image" class="mt-1 text-xs text-danger">{{ fieldErrors.image }}</p>
      </div>
      <button
        type="submit"
        class="focus-visible:outline-brand rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
        :disabled="saveMutation.isPending.value"
      >
        {{ saveMutation.isPending.value ? 'Guardando…' : 'Guardar' }}
      </button>
    </form>
  </section>
</template>
