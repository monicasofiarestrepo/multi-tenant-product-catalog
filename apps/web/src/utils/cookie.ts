const NAME = 'catalog_tenant'
const MAX_AGE = 60 * 60 * 24 * 30

export function getTenantCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]!) : null
}

export function setTenantCookie(tenantId: string) {
  const secure = import.meta.env.PROD ? '; Secure' : ''
  document.cookie = `${NAME}=${encodeURIComponent(tenantId)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`
}
