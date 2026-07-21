import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import type { Product, ProductRepository, Tenant, TenantRepository } from '@catalog/domain'

function tenantPk(tenantId: string) {
  return `TENANT#${tenantId}`
}

function productSk(productId: string) {
  return `PRODUCT#${productId}`
}

export class DynamoTenantRepository implements TenantRepository {
  constructor(
    private readonly doc: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async list(): Promise<Tenant[]> {
    const res = await this.doc.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'entityType = :t',
        ExpressionAttributeValues: { ':t': 'TENANT' },
      }),
    )
    return (res.Items ?? []).map((i) => ({
      id: i.tenantId as string,
      name: i.name as string,
      slug: i.slug as string,
    }))
  }

  async getById(tenantId: string): Promise<Tenant | null> {
    const res = await this.doc.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: tenantPk(tenantId), SK: 'META' },
      }),
    )
    if (!res.Item) return null
    return {
      id: res.Item.tenantId as string,
      name: res.Item.name as string,
      slug: res.Item.slug as string,
    }
  }

  async create(tenant: Tenant): Promise<Tenant> {
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: tenantPk(tenant.id),
          SK: 'META',
          entityType: 'TENANT',
          tenantId: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    )
    return tenant
  }
}

export class DynamoProductRepository implements ProductRepository {
  constructor(
    private readonly doc: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async listByTenant(tenantId: string): Promise<Product[]> {
    const res = await this.doc.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': tenantPk(tenantId),
          ':sk': 'PRODUCT#',
        },
      }),
    )
    return (res.Items ?? []).map((i) => this.fromItem(i))
  }

  async getById(tenantId: string, productId: string): Promise<Product | null> {
    const res = await this.doc.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: tenantPk(tenantId), SK: productSk(productId) },
      }),
    )
    if (!res.Item) return null
    return this.fromItem(res.Item)
  }

  async create(product: Product): Promise<Product> {
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: this.toItem(product),
        ConditionExpression: 'attribute_not_exists(SK)',
      }),
    )
    return product
  }

  async update(product: Product): Promise<Product> {
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: this.toItem(product),
      }),
    )
    return product
  }

  async delete(tenantId: string, productId: string): Promise<void> {
    await this.doc.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { PK: tenantPk(tenantId), SK: productSk(productId) },
      }),
    )
  }

  private toItem(product: Product) {
    return {
      PK: tenantPk(product.tenantId),
      SK: productSk(product.id),
      entityType: 'PRODUCT',
      ...product,
    }
  }

  private fromItem(item: Record<string, unknown>): Product {
    return {
      id: item.id as string,
      tenantId: item.tenantId as string,
      name: item.name as string,
      description: item.description as string,
      price: item.price as number,
      category: item.category as string,
      imageUrls: (item.imageUrls as string[]) ?? [],
      createdAt: item.createdAt as string,
      updatedAt: item.updatedAt as string,
    }
  }
}

export function createDocClient() {
  return DynamoDBDocumentClient.from(new DynamoDBClient({}))
}
