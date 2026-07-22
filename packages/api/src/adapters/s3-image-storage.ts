import { randomUUID } from 'node:crypto'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { ImageStorage } from '@catalog/domain'
import { MAX_IMAGE_BYTES } from '@catalog/shared'

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export class S3ImageStorage implements ImageStorage {
  constructor(
    private readonly s3: S3Client,
    private readonly bucket: string,
    private readonly cdnBaseUrl: string,
  ) {}

  async createUploadUrl(params: {
    tenantId: string
    productId: string
    contentType: string
    contentLength: number
    fileName?: string
  }) {
    const ext = EXT[params.contentType]
    if (!ext) throw new Error('Unsupported content type')
    if (params.contentLength > MAX_IMAGE_BYTES) {
      throw new Error('File too large')
    }
    const key = `tenants/${params.tenantId}/products/${params.productId}/${randomUUID()}.${ext}`
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: params.contentType,
    })
    const uploadUrl = await getSignedUrl(this.s3, cmd, {
      expiresIn: 900,
      unhoistableHeaders: new Set(['content-type']),
    })
    const publicUrl = `${this.cdnBaseUrl.replace(/\/$/, '')}/${key}`
    return { uploadUrl, publicUrl, key }
  }

  async deleteByKey(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    )
  }

  keysFromUrls(urls: string[]): string[] {
    const base = this.cdnBaseUrl.replace(/\/$/, '')
    return urls
      .map((u) => (u.startsWith(base + '/') ? u.slice(base.length + 1) : null))
      .filter((k): k is string => Boolean(k))
  }

  static maxBytes() {
    return MAX_IMAGE_BYTES
  }
}

export function createS3Client() {
  return new S3Client({})
}
