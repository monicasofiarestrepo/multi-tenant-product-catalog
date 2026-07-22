import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { ZodError } from 'zod'
import { CatalogService, ApplicationError } from '@catalog/application'
import {
  imageUploadRequestSchema,
  productCreateSchema,
  productIdSchema,
  productUpdateSchema,
  tenantCreateSchema,
  tenantIdSchema,
} from '@catalog/shared'
import {
  createDocClient,
  DynamoProductRepository,
  DynamoTenantRepository,
} from '../adapters/dynamo-repositories'
import {
  MemoryProductRepository,
  MemoryTenantRepository,
  memoryImages,
} from '../adapters/memory-store'
import { createS3Client, S3ImageStorage } from '../adapters/s3-image-storage'

const TABLE = process.env.TABLE_NAME ?? ''
const BUCKET = process.env.IMAGES_BUCKET ?? ''
const CDN = process.env.IMAGES_CDN_URL ?? ''
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*'
const LOCAL = process.env.LOCAL_IN_MEMORY === '1'

function headers(extra: Record<string, string> = {}) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    ...extra,
  }
}

function json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return { statusCode, headers: headers(), body: JSON.stringify(body) }
}

function error(statusCode: number, code: string, message: string, details?: unknown) {
  return json(statusCode, { error: { code, message, details } })
}

function parseJsonBody(raw: string | undefined): unknown {
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    throw new ApplicationError('VALIDATION_ERROR', 'Invalid JSON body')
  }
}

function service() {
  if (LOCAL || !TABLE) {
    return new CatalogService(
      new MemoryTenantRepository(),
      new MemoryProductRepository(),
      memoryImages,
    )
  }
  const doc = createDocClient()
  const images = new S3ImageStorage(createS3Client(), BUCKET, CDN)
  return new CatalogService(
    new DynamoTenantRepository(doc, TABLE),
    new DynamoProductRepository(doc, TABLE),
    images,
  )
}

function pathParts(path: string) {
  return path.replace(/^\/+/, '').split('/').filter(Boolean)
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (event.requestContext.http.method === 'OPTIONS') {
    return { statusCode: 204, headers: headers() }
  }

  try {
    const parts = pathParts(event.rawPath ?? event.requestContext.http.path)
    const method = event.requestContext.http.method
    const svc = service()
    const body = parseJsonBody(event.body)

    if (parts[0] === 'tenants' && parts.length === 1 && method === 'GET') {
      const tenants = await svc.listTenants()
      return json(200, tenants)
    }

    if (parts[0] === 'tenants' && parts.length === 1 && method === 'POST') {
      const input = tenantCreateSchema.parse(body)
      const created = await svc.createTenant(input)
      return json(201, created)
    }

    if (parts[0] === 'tenants' && parts[2] === 'products' && parts.length === 3) {
      const tenantId = tenantIdSchema.parse(parts[1])
      if (method === 'GET') {
        const products = await svc.listProducts(tenantId)
        return json(200, products)
      }
      if (method === 'POST') {
        const input = productCreateSchema.parse(body)
        const created = await svc.createProduct(tenantId, input)
        return json(201, created)
      }
    }

    if (parts[0] === 'tenants' && parts[2] === 'products' && parts.length === 4) {
      const tenantId = tenantIdSchema.parse(parts[1])
      const productId = productIdSchema.parse(parts[3])
      if (method === 'GET') {
        const product = await svc.getProduct(tenantId, productId)
        return json(200, product)
      }
      if (method === 'PATCH') {
        const input = productUpdateSchema.parse(body)
        const updated = await svc.updateProduct(tenantId, productId, input)
        return json(200, updated)
      }
      if (method === 'DELETE') {
        await svc.deleteProduct(tenantId, productId)
        return { statusCode: 204, headers: headers() }
      }
    }

    if (
      parts[0] === 'tenants' &&
      parts[2] === 'products' &&
      parts[4] === 'image-upload' &&
      parts.length === 5 &&
      method === 'POST'
    ) {
      const tenantId = tenantIdSchema.parse(parts[1])
      const productId = productIdSchema.parse(parts[3])
      const input = imageUploadRequestSchema.parse(body)
      const result = await svc.createImageUpload(tenantId, productId, input)
      return json(200, result)
    }

    return error(404, 'NOT_FOUND', 'Route not found')
  } catch (e) {
    if (e instanceof ZodError) {
      return error(400, 'VALIDATION_ERROR', 'Invalid request', e.flatten())
    }
    if (e instanceof ApplicationError) {
      const status =
        e.code === 'NOT_FOUND' ? 404 : e.code === 'CONFLICT' ? 409 : 400
      return error(status, e.code, e.message)
    }
    console.error(e)
    return error(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
