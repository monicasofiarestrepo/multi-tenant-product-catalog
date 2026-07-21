import type { ProductDto } from '@catalog/shared'
import { describe, expect, it } from 'vitest'
import { filterProducts } from './useProductFilters'

const sample: ProductDto[] = [
  {
    id: '1',
    tenantId: 'a',
    name: 'Alpha Bike',
    description: 'x',
    price: 1,
    category: 'Bicicletas',
    imageUrls: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    tenantId: 'a',
    name: 'Beta SUV',
    description: 'y',
    price: 2,
    category: 'SUV',
    imageUrls: [],
    createdAt: '',
    updatedAt: '',
  },
]

describe('filterProducts', () => {
  it('filters by name and category', () => {
    expect(filterProducts(sample, 'alpha', '')).toHaveLength(1)
    expect(filterProducts(sample, '', 'SUV')).toHaveLength(1)
    expect(filterProducts(sample, 'beta', 'SUV')).toHaveLength(1)
    expect(filterProducts(sample, 'gamma', '')).toHaveLength(0)
  })
})
