import type { ProductDto } from '@catalog/shared'
import { computed, ref } from 'vue'

export function filterProducts(
  products: ProductDto[],
  search: string,
  category: string,
) {
  const q = search.trim().toLowerCase()
  return products.filter((p) => {
    const matchSearch = !q || p.name.toLowerCase().includes(q)
    const matchCat = category === '' || p.category === category
    return matchSearch && matchCat
  })
}

export function useProductFilters(products: () => ProductDto[]) {
  const search = ref('')
  const category = ref('')

  const categories = computed(() => {
    const set = new Set(products().map((p) => p.category))
    return [...set].sort()
  })

  const filtered = computed(() =>
    filterProducts(products(), search.value, category.value),
  )

  function reset() {
    search.value = ''
    category.value = ''
  }

  return { search, category, categories, filtered, reset }
}
