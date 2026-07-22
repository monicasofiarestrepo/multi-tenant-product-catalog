import type {
  ImageUploadResponse,
  ProductCreateInput,
  ProductDto,
  ProductUpdateInput,
  TenantCreateInput,
  TenantDto,
} from '@catalog/shared'

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export class ApiError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new ApiError('CONFIG', 'VITE_API_URL is not configured')
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    let body: { error?: { code?: string; message?: string } } = {}
    try {
      body = await res.json()
    } catch {
      /* empty */
    }
    throw new ApiError(
      body.error?.code ?? 'HTTP_ERROR',
      body.error?.message ?? res.statusText,
    )
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const catalogApi = {
  listTenants: () => request<TenantDto[]>('/tenants'),
  createTenant: (body: TenantCreateInput) =>
    request<TenantDto>('/tenants', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  listProducts: (tenantId: string) =>
    request<ProductDto[]>(`/tenants/${tenantId}/products`),
  getProduct: (tenantId: string, productId: string) =>
    request<ProductDto>(`/tenants/${tenantId}/products/${productId}`),
  createProduct: (tenantId: string, body: ProductCreateInput) =>
    request<ProductDto>(`/tenants/${tenantId}/products`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateProduct: (tenantId: string, productId: string, body: ProductUpdateInput) =>
    request<ProductDto>(`/tenants/${tenantId}/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  deleteProduct: (tenantId: string, productId: string) =>
    request<void>(`/tenants/${tenantId}/products/${productId}`, {
      method: 'DELETE',
    }),
  presignImage: (
    tenantId: string,
    productId: string,
    contentType: string,
    contentLength: number,
  ) =>
    request<ImageUploadResponse>(
      `/tenants/${tenantId}/products/${productId}/image-upload`,
      {
        method: 'POST',
        body: JSON.stringify({ contentType, contentLength }),
      },
    ),
  uploadToPresignedUrl: async (
    uploadUrl: string,
    file: Blob,
    contentType: string,
  ) => {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    })
    if (!res.ok) throw new ApiError('UPLOAD_FAILED', 'Image upload failed')
  },
}
