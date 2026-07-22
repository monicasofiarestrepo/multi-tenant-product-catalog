import type { Product, Tenant } from '@catalog/domain'

export const SEED_TENANTS: Tenant[] = [
  { id: 'bikystore', name: 'Bike House', slug: 'bikystore' },
  { id: 'biky', name: 'Biky', slug: 'biky' },
  { id: 'keybe', name: 'Keybe', slug: 'keybe' },
]

export function seedProducts(now: string): Product[] {
  return [
    {
      id: 'p-bike-marlin7',
      tenantId: 'bikystore',
      name: 'Trek Marlin 7 2026',
      description: 'MTB Trek vendida en Bike House Colombia.',
      price: 4290000,
      category: 'Montaña',
      imageUrls: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'p-biky-essential',
      tenantId: 'biky',
      name: 'Plan Essential — Autopilot AI Messages',
      description: 'Plan Essential de Biky: mensajes IA 24/7 y catálogo inteligente.',
      price: 790,
      category: 'Suscripción',
      imageUrls: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'p-keybe-smartchat',
      tenantId: 'keybe',
      name: 'Keybe SmartChat',
      description: 'Comunicación omnicanal multiagente impulsada por IA.',
      price: 0,
      category: 'Plataforma',
      imageUrls: [],
      createdAt: now,
      updatedAt: now,
    },
  ]
}
