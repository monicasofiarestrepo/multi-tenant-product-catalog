import type { Product, Tenant } from '@catalog/domain'

export const SEED_TENANTS: Tenant[] = [
  { id: 'acme', name: 'Acme Motors', slug: 'acme' },
  { id: 'bikystore', name: 'BikeHouse', slug: 'bikehouse' },
  { id: 'keybe-demo', name: 'Keybe Demo', slug: 'keybe-demo' },
]

export function seedProducts(now: string): Product[] {
  return [
    {
      id: 'p-acme-1',
      tenantId: 'acme',
      name: 'SUV Explorer',
      description: 'Familia y ciudad.',
      price: 28900,
      category: 'SUV',
      imageUrls: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'p-bike-1',
      tenantId: 'bikystore',
      name: 'Trek Marlin 7',
      description: 'MTB entrada.',
      price: 899,
      category: 'Bicicletas',
      imageUrls: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'p-keybe-1',
      tenantId: 'keybe-demo',
      name: 'Plan Starter',
      description: 'Suite ventas IA.',
      price: 199,
      category: 'Software',
      imageUrls: [],
      createdAt: now,
      updatedAt: now,
    },
  ]
}
