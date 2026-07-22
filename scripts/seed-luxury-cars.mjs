#!/usr/bin/env node
/**
 * Seeds luxury cars + Bike House, Biky, Keybe; removes Acme products.
 * Usage: node scripts/seed-luxury-cars.mjs
 */
import { BRANDS, PRODUCTS_BY_BRAND } from './luxury-cars-data.mjs'
import {
  BIKEHOUSE_PRODUCTS,
  BIKY_PRODUCTS,
  EXTRA_BRANDS,
  KEYBE_PRODUCTS,
} from './extra-brands-data.mjs'
import { resolveSeedImageUrl } from './product-images.mjs'

const API_BASE = (
  process.env.API_BASE ??
  'https://ynnkakaim7.execute-api.us-east-2.amazonaws.com'
).replace(/\/$/, '')

const REMOVE_TENANT_IDS = ['acme', 'keybe-demo']

const FIX_IMAGES = process.env.FIX_IMAGES === '1'

const PRODUCTS = {
  ...PRODUCTS_BY_BRAND,
  bikystore: BIKEHOUSE_PRODUCTS,
  biky: BIKY_PRODUCTS,
  keybe: KEYBE_PRODUCTS,
}

const ALL_BRANDS = [...BRANDS, ...EXTRA_BRANDS]

function seedImageUrl(tenantId, item) {
  return resolveSeedImageUrl({
    tenantSlug: tenantId,
    category: item.category,
    name: item.name,
    imageUrl: item.imageUrl,
  })
}

async function api(path, init) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  let body = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }
  if (!res.ok) {
    const msg = body?.error?.message ?? res.statusText
    const err = new Error(`${init?.method ?? 'GET'} ${path} → ${res.status}: ${msg}`)
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}

async function ensureTenant(brand) {
  try {
    const created = await api('/tenants', {
      method: 'POST',
      body: JSON.stringify({ name: brand.name, slug: brand.slug }),
    })
    console.log(`  ✅ marca creada: ${created.id}`)
    return created
  } catch (e) {
    if (e.status === 409) {
      console.log(`  ↷ marca ya existe: ${brand.slug}`)
      return { id: brand.slug, name: brand.name, slug: brand.slug }
    }
    throw e
  }
}

async function downloadJpeg(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'catalog-seed/1.0' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`download ${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 1000) throw new Error(`image too small (${buf.length})`)
  if (buf.length > 5 * 1024 * 1024) throw new Error(`image too large (${buf.length})`)
  return buf
}

async function attachImage(tenantId, productId, item) {
  const sourceUrl = seedImageUrl(tenantId, item)
  let bytes
  let lastErr
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      bytes = await downloadJpeg(sourceUrl)
      lastErr = null
      break
    } catch (e) {
      lastErr = e
      console.warn(`    ⚠️ imagen falló (${e.message}), reintento…`)
    }
  }
  if (!bytes) throw lastErr ?? new Error('no image')

  const presign = await api(
    `/tenants/${tenantId}/products/${productId}/image-upload`,
    {
      method: 'POST',
      body: JSON.stringify({ contentType: 'image/jpeg', fileName: 'product.jpg' }),
    },
  )

  const put = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: bytes,
  })
  if (!put.ok) {
    const t = await put.text().catch(() => '')
    throw new Error(`S3 PUT ${put.status}: ${t.slice(0, 120)}`)
  }

  await api(`/tenants/${tenantId}/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ imageUrls: [presign.publicUrl] }),
  })
  return presign.publicUrl
}

async function seedBrand(brand) {
  console.log(`\n🏷  ${brand.name}`)
  await ensureTenant(brand)
  const tenantId = brand.slug

  const existing = await api(`/tenants/${tenantId}/products`)
  const byName = new Set(existing.map((p) => p.name))

  const items = PRODUCTS[brand.slug] ?? []
  for (const item of items) {
    if (byName.has(item.name)) {
      const found = existing.find((p) => p.name === item.name)
      if (found?.imageUrls?.length && !FIX_IMAGES) {
        console.log(`  ↷ ya existe con imagen: ${item.name}`)
        continue
      }
      if (found) {
        console.log(
          FIX_IMAGES ? `  🔄 actualiza imagen: ${item.name}` : `  🖼  añade imagen a: ${item.name}`,
        )
        await attachImage(tenantId, found.id, item)
        console.log(`  ✅ imagen OK`)
        continue
      }
    }

    console.log(`  + ${item.name}`)
    const product = await api(`/tenants/${tenantId}/products`, {
      method: 'POST',
      body: JSON.stringify({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
      }),
    })
    await attachImage(tenantId, product.id, item)
    console.log(`  ✅ creado + imagen`)
  }
}

async function wipeTenantProducts(tenantId) {
  console.log(`\n🗑  eliminando productos de ${tenantId}…`)
  let products = []
  try {
    products = await api(`/tenants/${tenantId}/products`)
  } catch (e) {
    if (e.status === 404) {
      console.log(`  ↷ tenant no encontrado`)
      return
    }
    throw e
  }
  for (const p of products) {
    await api(`/tenants/${tenantId}/products/${p.id}`, { method: 'DELETE' })
    console.log(`  ✅ borrado: ${p.name}`)
  }
  if (!products.length) console.log(`  (sin productos)`)
  console.log(
    `  ℹ️  El registro de marca "${tenantId}" puede seguir en DynamoDB (no hay DELETE /tenants). Si aún aparece en el selector vacío, bórralo en consola: PK=TENANT#${tenantId} SK=META`,
  )
}

/** Quita el Marlin seed viejo sin imagen / nombre corto */
async function cleanupBikeHouseLegacy() {
  const products = await api('/tenants/bikystore/products')
  for (const p of products) {
    if (p.name === 'Trek Marlin 7' && (!p.imageUrls || p.imageUrls.length === 0)) {
      await api(`/tenants/bikystore/products/${p.id}`, { method: 'DELETE' })
      console.log(`  🗑  legacy borrado: ${p.name} (${p.id})`)
    }
  }
}

async function main() {
  console.log(`API: ${API_BASE}`)
  if (FIX_IMAGES) console.log('Modo: FIX_IMAGES=1 (reemplaza imágenes de productos seed)')
  const tenants = await api('/tenants')
  console.log(`Tenants actuales: ${tenants.map((t) => t.id).join(', ') || '(ninguno)'}`)

  for (const id of REMOVE_TENANT_IDS) {
    await wipeTenantProducts(id)
  }

  console.log('\n🧹 Bike House legacy…')
  await cleanupBikeHouseLegacy()

  for (const brand of ALL_BRANDS) {
    await seedBrand(brand)
  }

  console.log('\n—— resumen ——')
  for (const brand of ALL_BRANDS) {
    const products = await api(`/tenants/${brand.slug}/products`)
    const withImg = products.filter((p) => p.imageUrls?.length > 0).length
    console.log(
      `${brand.name}: ${products.length} productos (${withImg} con imagen)`,
    )
  }
  console.log('\nListo.')
}

main().catch((e) => {
  console.error('\n❌', e.message)
  if (e.body) console.error(JSON.stringify(e.body, null, 2))
  process.exit(1)
})
