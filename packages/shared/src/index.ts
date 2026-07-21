import { z } from 'zod'

export const tenantIdSchema = z.string().min(1).max(64)

export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

const tenantSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const tenantCreateSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(tenantSlugPattern, 'Slug inválido (usa minúsculas, números y guiones)')
    .optional(),
})

export function slugifyTenantName(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return base.length > 0 ? base : 'marca'
}

export const productSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrls: z.array(z.string().url()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const productCreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  price: z.number().nonnegative(),
  category: z.string().min(1).max(80),
  imageUrls: z.array(z.string().url()).optional(),
})

export const productUpdateSchema = productCreateSchema.partial()

export const imageUploadRequestSchema = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  fileName: z.string().max(200).optional(),
})

export const imageUploadResponseSchema = z.object({
  uploadUrl: z.string().url(),
  publicUrl: z.string().url(),
  key: z.string(),
})

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
})

export type TenantDto = z.infer<typeof tenantSchema>
export type TenantCreateInput = z.infer<typeof tenantCreateSchema>
export type ProductDto = z.infer<typeof productSchema>
export type ProductCreateInput = z.infer<typeof productCreateSchema>
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
export type ImageUploadRequest = z.infer<typeof imageUploadRequestSchema>
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>
export type ApiErrorBody = z.infer<typeof apiErrorSchema>
