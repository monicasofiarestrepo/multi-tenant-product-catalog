#!/usr/bin/env node
/**
 * Borra productos vía API y opcionalmente el META del tenant en DynamoDB.
 * Usage: node scripts/remove-tenant.mjs keybe-demo
 * Env: API_BASE, TABLE_NAME, AWS_REGION (default us-east-2)
 */
import { execSync } from 'node:child_process'

const tenantId = process.argv[2]
if (!tenantId) {
  console.error('Usage: node scripts/remove-tenant.mjs <tenant-id>')
  process.exit(1)
}

const API_BASE = (
  process.env.API_BASE ??
  'https://ynnkakaim7.execute-api.us-east-2.amazonaws.com'
).replace(/\/$/, '')

const REGION = process.env.AWS_REGION ?? 'us-east-2'

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
    throw err
  }
  return body
}

function deleteTenantMeta(tableName) {
  execSync(
    `aws dynamodb delete-item --region ${REGION} --table-name ${tableName} --key '{"PK":{"S":"TENANT#${tenantId}"},"SK":{"S":"META"}}'`,
    { stdio: 'inherit' },
  )
}

async function main() {
  console.log(`API: ${API_BASE}`)
  console.log(`Tenant: ${tenantId}`)

  let products = []
  try {
    products = await api(`/tenants/${tenantId}/products`)
  } catch (e) {
    if (e.status === 404) {
      console.log('↷ tenant no encontrado en API (solo META en DB?)')
    } else {
      throw e
    }
  }

  for (const p of products) {
    await api(`/tenants/${tenantId}/products/${p.id}`, { method: 'DELETE' })
    console.log(`✅ producto borrado: ${p.name}`)
  }
  if (!products.length) console.log('(sin productos)')

  const table = process.env.TABLE_NAME
  if (!table) {
    console.log(
      `\nℹ️  Para quitar la marca del selector, borra META en DynamoDB:\n` +
        `   PK=TENANT#${tenantId}  SK=META\n` +
        `   O ejecuta: TABLE_NAME=<tabla> node scripts/remove-tenant.mjs ${tenantId}`,
    )
    return
  }

  try {
    deleteTenantMeta(table)
    console.log(`✅ META borrado en ${table}`)
  } catch (e) {
    console.error(`\n❌ No se pudo borrar META (${e.message}). ¿aws login?`)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('\n❌', e.message)
  process.exit(1)
})
