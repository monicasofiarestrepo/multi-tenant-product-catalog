export type TenantId = string
export type ProductId = string

export interface Tenant {
  id: TenantId
  name: string
  slug: string
}

export interface Product {
  id: ProductId
  tenantId: TenantId
  name: string
  description: string
  price: number
  category: string
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductRepository {
  listByTenant(tenantId: TenantId): Promise<Product[]>
  getById(tenantId: TenantId, productId: ProductId): Promise<Product | null>
  create(product: Product): Promise<Product>
  update(product: Product): Promise<Product>
  delete(tenantId: TenantId, productId: ProductId): Promise<void>
}

export interface TenantRepository {
  list(): Promise<Tenant[]>
  getById(tenantId: TenantId): Promise<Tenant | null>
  create(tenant: Tenant): Promise<Tenant>
}

export interface ImageUploadParams {
  tenantId: TenantId
  productId: ProductId
  contentType: string
  fileName?: string
}

export interface ImageUploadResult {
  uploadUrl: string
  publicUrl: string
  key: string
}

export interface ImageStorage {
  createUploadUrl(params: ImageUploadParams): Promise<ImageUploadResult>
  deleteByKey(key: string): Promise<void>
  keysFromUrls(urls: string[]): string[]
}
