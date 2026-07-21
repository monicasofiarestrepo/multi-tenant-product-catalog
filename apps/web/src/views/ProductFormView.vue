<script setup lang="ts">
import { productCreateSchema } from '@catalog/shared'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { catalogApi } from '@/api/client'
import {
  invalidateProducts,
  useProductQuery,
  useProductsQuery,
  useTenantsQuery,
} from '@/composables/useCatalogQueries'
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

const tenantsQuery = useTenantsQuery()
const productsQuery = useProductsQuery(computed(() => tenantStore.selectedTenantId))
const existingQuery = useProductQuery(
  tenantId,
  computed(() => productId.value ?? ''),
  isEdit,
)

const brandName = computed(() => {
  const id = tenantStore.selectedTenantId
  const t = (tenantsQuery.data.value ?? []).find((x) => x.id === id)
  return t?.name ?? 'esta marca'
})

const formTitle = computed(() =>
  isEdit.value ? `Editar producto de ${brandName.value}` : `Nuevo Producto de ${brandName.value}`,
)

const existingCategories = computed(() => {
  const set = new Set<string>()
  for (const p of productsQuery.data.value ?? []) {
    if (p.category.trim()) set.add(p.category.trim())
  }
  return [...set].sort((a, b) => a.localeCompare(b))
})

const filteredCategories = computed(() => {
  const q = category.value.trim().toLowerCase()
  if (!q) return existingCategories.value
  return existingCategories.value.filter((c) => c.toLowerCase().includes(q))
})

const name = ref('')
const description = ref('')
const priceInput = ref('')
const category = ref('')
const categoryOpen = ref(false)
const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})
const fileInputRef = ref<HTMLInputElement | null>(null)

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

watch(file, (f) => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = f ? URL.createObjectURL(f) : null
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

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

const isSaving = computed(() => saveMutation.isPending.value)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const next = input.files?.[0] ?? null
  file.value = next
  if (next) fieldErrors.value.image = ''
}

function pickCategory(c: string) {
  category.value = c
  categoryOpen.value = false
}

function onCategoryBlur() {
  window.setTimeout(() => {
    categoryOpen.value = false
  }, 150)
}

function openFilePicker() {
  fileInputRef.value?.click()
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const dropped = e.dataTransfer?.files?.[0]
  if (!dropped) return
  if (!/^image\/(jpeg|png|webp)$/.test(dropped.type)) {
    fieldErrors.value.image = 'Usa JPEG, PNG o WebP'
    return
  }
  file.value = dropped
  fieldErrors.value.image = ''
}
</script>

<template>
  <section class="mx-auto max-w-xl space-y-6">
    <h2 class="text-2xl font-semibold text-ink-deep">{{ formTitle }}</h2>
    <form class="space-y-4" @submit.prevent="saveMutation.mutate()">
      <div>
        <label for="name" class="text-sm font-medium text-ink">Nombre</label>
        <input
          id="name"
          v-model="name"
          class="focus-visible:outline-brand mt-1 w-full rounded-md border border-border bg-surface-elevated py-2 pl-3 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
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
        <div class="relative mt-1">
          <input
            id="category"
            v-model="category"
            role="combobox"
            :aria-expanded="categoryOpen"
            aria-autocomplete="list"
            aria-controls="category-list"
            placeholder="Elige o escribe una categoría"
            class="focus-visible:outline-brand w-full rounded-md border border-border bg-surface-elevated py-2 pl-3 pr-10 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            autocomplete="off"
            @focus="categoryOpen = true"
            @input="categoryOpen = true"
            @blur="onCategoryBlur"
          />
          <button
            type="button"
            class="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted hover:text-ink"
            tabindex="-1"
            aria-label="Mostrar categorías"
            @mousedown.prevent="categoryOpen = !categoryOpen"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ul
            v-if="categoryOpen && filteredCategories.length"
            id="category-list"
            class="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-surface-elevated shadow-md"
            role="listbox"
          >
            <li v-for="c in filteredCategories" :key="c" role="option">
              <button
                type="button"
                class="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface"
                @mousedown.prevent="pickCategory(c)"
              >
                {{ c }}
              </button>
            </li>
          </ul>
        </div>
        <p v-if="categoryOpen && !existingCategories.length" class="mt-1 text-xs text-muted">
          Aún no hay categorías en esta marca — escribe una nueva.
        </p>
        <p v-if="fieldErrors.category" class="mt-1 text-xs text-danger">{{ fieldErrors.category }}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-ink" id="image-label">Imagen</p>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="sr-only"
          aria-labelledby="image-label"
          @change="onFileChange"
        />
        <button
          type="button"
          class="group focus-visible:outline-brand mt-1 flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface-elevated px-4 py-8 text-center transition duration-200 hover:border-brand hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2"
          @click="openFilePicker"
          @dragover.prevent
          @drop="onDrop"
        >
          <div
            v-if="previewUrl"
            class="relative h-28 w-28 overflow-hidden rounded-lg border border-border"
          >
            <img :src="previewUrl" alt="Vista previa" class="h-full w-full object-cover" />
          </div>
          <span
            v-else
            class="flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 text-brand transition duration-200 group-hover:scale-105 group-hover:bg-brand/25"
            aria-hidden="true"
          >
            <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path
                d="M12 16V8m0 0l-3 3m3-3l3 3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20 16.5v1a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="space-y-1">
            <span class="block text-sm font-semibold text-ink">
              {{ file ? file.name : 'Sube una imagen del producto' }}
            </span>
            <span class="block text-xs text-muted">
              Arrastra aquí o haz clic · JPEG, PNG o WebP
            </span>
          </span>
        </button>
        <p v-if="fieldErrors.image" class="mt-1 text-xs text-danger">{{ fieldErrors.image }}</p>
      </div>

      <button
        type="submit"
        class="focus-visible:outline-brand rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
        :disabled="isSaving"
      >
        {{ isSaving ? 'Guardando…' : 'Guardar' }}
      </button>
    </form>
  </section>
</template>
