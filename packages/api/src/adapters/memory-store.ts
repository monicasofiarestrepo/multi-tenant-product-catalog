import type { ImageStorage, Product, ProductRepository, Tenant, TenantRepository } from '@catalog/domain'

const tenants = new Map<string, Tenant>()
const products = new Map<string, Product>()

function productKey(tenantId: string, productId: string) {
  return `${tenantId}#${productId}`
}

export class MemoryTenantRepository implements TenantRepository {
  async list(): Promise<Tenant[]> {
    return [...tenants.values()]
  }
  async getById(tenantId: string): Promise<Tenant | null> {
    return tenants.get(tenantId) ?? null
  }
  async create(tenant: Tenant): Promise<Tenant> {
    if (tenants.has(tenant.id)) {
      throw new Error('TENANT_EXISTS')
    }
    tenants.set(tenant.id, tenant)
    return tenant
  }
}

export class MemoryProductRepository implements ProductRepository {
  async listByTenant(tenantId: string): Promise<Product[]> {
    return [...products.values()].filter((p) => p.tenantId === tenantId)
  }
  async getById(tenantId: string, productId: string): Promise<Product | null> {
    const p = products.get(productKey(tenantId, productId))
    return p ?? null
  }
  async create(product: Product): Promise<Product> {
    products.set(productKey(product.tenantId, product.id), product)
    return product
  }
  async update(product: Product): Promise<Product> {
    products.set(productKey(product.tenantId, product.id), product)
    return product
  }
  async delete(tenantId: string, productId: string): Promise<void> {
    products.delete(productKey(tenantId, productId))
  }
}

export class MemoryImageStorage implements ImageStorage {
  private readonly objects = new Map<string, Buffer>()
  private readonly base: string

  constructor(base = 'http://localhost:3000/media') {
    this.base = base
  }

  async createUploadUrl(params: {
    tenantId: string
    productId: string
    contentType: string
  }) {
    const ext = params.contentType.split('/')[1] ?? 'bin'
    const key = `tenants/${params.tenantId}/products/${params.productId}/${Date.now()}.${ext}`
    const publicUrl = `${this.base}/${key}`
    return {
      uploadUrl: `${this.base}/upload/${encodeURIComponent(key)}`,
      publicUrl,
      key,
    }
  }

  registerUpload(key: string, body: Buffer) {
    this.objects.set(key, body)
  }

  getObject(key: string) {
    return this.objects.get(key)
  }

  async deleteByKey(key: string) {
    this.objects.delete(key)
  }

  keysFromUrls(urls: string[]) {
    return urls
      .map((u) => {
        const prefix = `${this.base}/`
        return u.startsWith(prefix) ? u.slice(prefix.length) : null
      })
      .filter((k): k is string => Boolean(k))
  }
}

export const memoryImages = new MemoryImageStorage()
