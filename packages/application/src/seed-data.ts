import type { Product, Tenant } from '@catalog/domain'

export const SEED_TENANTS: Tenant[] = [
  { id: 'bikystore', name: 'Bike House', slug: 'bikystore' },
  { id: 'biky', name: 'Biky', slug: 'biky' },
  { id: 'keybe', name: 'Keybe', slug: 'keybe' },
]

/** Public demo URLs for seed cards. */
const SEED_IMAGES = {
  bike: 'https://images.unsplash.com/photo-1485965120180-c6be97aa33487?auto=format&fit=crop&w=800&q=80',
  biky: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80',
  keybe: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
} as const

export function seedProducts(now: string): Product[] {
  return [
    {
      id: 'p-bike-marlin7',
      tenantId: 'bikystore',
      name: 'Trek Marlin 7 2026',
      description: 'MTB Trek vendida en Bike House Colombia.',
      price: 4290000,
      category: 'Montaña',
      imageUrls: [SEED_IMAGES.bike],
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
      imageUrls: [SEED_IMAGES.biky],
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
      imageUrls: [SEED_IMAGES.keybe],
      createdAt: now,
      updatedAt: now,
    },
  ]
}
