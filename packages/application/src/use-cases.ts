import { randomUUID } from 'node:crypto'
import type {
  ImageStorage,
  Product,
  ProductRepository,
  Tenant,
  TenantRepository,
} from '@catalog/domain'
import type { ImageUploadRequest, ProductCreateInput, ProductUpdateInput, TenantCreateInput } from '@catalog/shared'
import { slugifyTenantName } from '@catalog/shared'
import { SEED_TENANTS, seedProducts } from './seed-data'

export class ApplicationError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

export class CatalogService {
  private seeded = false

  constructor(
    private readonly tenants: TenantRepository,
    private readonly products: ProductRepository,
    private readonly images: ImageStorage,
  ) {}

  async ensureSeed(): Promise<void> {
    if (this.seeded) return
    const existing = await this.tenants.list()
    if (existing.length > 0) {
      this.seeded = true
      return
    }
    const now = new Date().toISOString()
    for (const t of SEED_TENANTS) {
      await this.tenants.create(t)
    }
    for (const p of seedProducts(now)) {
      await this.products.create(p)
    }
    this.seeded = true
  }

  async listTenants(): Promise<Tenant[]> {
    await this.ensureSeed()
    return this.tenants.list()
  }

  async createTenant(input: TenantCreateInput): Promise<Tenant> {
    await this.ensureSeed()
    const slug = input.slug ?? slugifyTenantName(input.name)
    const id = slug
    const existing = await this.tenants.getById(id)
    if (existing) {
      throw new ApplicationError('CONFLICT', 'Ya existe una marca con ese identificador')
    }
    const tenant: Tenant = { id, name: input.name.trim(), slug }
    return this.tenants.create(tenant)
  }

  async listProducts(tenantId: string): Promise<Product[]> {
    await this.ensureSeed()
    return this.products.listByTenant(tenantId)
  }

  async getProduct(tenantId: string, productId: string): Promise<Product> {
    await this.ensureSeed()
    const p = await this.products.getById(tenantId, productId)
    if (!p) throw new ApplicationError('NOT_FOUND', 'Product not found')
    return p
  }

  async createProduct(tenantId: string, input: ProductCreateInput): Promise<Product> {
    await this.ensureSeed()
    const tenant = await this.tenants.getById(tenantId)
    if (!tenant) throw new ApplicationError('NOT_FOUND', 'Tenant not found')
    const now = new Date().toISOString()
    const product: Product = {
      id: randomUUID(),
      tenantId,
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      imageUrls: input.imageUrls ?? [],
      createdAt: now,
      updatedAt: now,
    }
    return this.products.create(product)
  }

  async updateProduct(
    tenantId: string,
    productId: string,
    input: ProductUpdateInput,
  ): Promise<Product> {
    const existing = await this.getProduct(tenantId, productId)
    const nextUrls = input.imageUrls ?? existing.imageUrls
    const updated: Product = {
      ...existing,
      ...input,
      imageUrls: nextUrls,
      updatedAt: new Date().toISOString(),
    }
    const saved = await this.products.update(updated)
    if (input.imageUrls) {
      const kept = new Set(nextUrls)
      const removed = existing.imageUrls.filter((u) => !kept.has(u))
      const keys = this.images.keysFromUrls(removed)
      await Promise.all(keys.map((k) => this.images.deleteByKey(k).catch(() => undefined)))
    }
    return saved
  }

  async deleteProduct(tenantId: string, productId: string): Promise<void> {
    const existing = await this.getProduct(tenantId, productId)
    const keys = this.images.keysFromUrls(existing.imageUrls)
    await this.products.delete(tenantId, productId)
    await Promise.all(keys.map((k) => this.images.deleteByKey(k).catch(() => undefined)))
  }

  async createImageUpload(
    tenantId: string,
    productId: string,
    input: ImageUploadRequest,
  ): Promise<Awaited<ReturnType<ImageStorage['createUploadUrl']>>> {
    await this.getProduct(tenantId, productId)
    return this.images.createUploadUrl({
      tenantId,
      productId,
      contentType: input.contentType,
      contentLength: input.contentLength,
      fileName: input.fileName,
    })
  }
}
