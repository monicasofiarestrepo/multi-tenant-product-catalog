/** Imágenes de seed alineadas a categoría / tipo de producto */

const Q = 'auto=format&fit=crop&w=1200&q=80'

const CAR_BY_KIND = {
  suv: [
    `https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?${Q}`,
    `https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?${Q}`,
    `https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?${Q}`,
    `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?${Q}`,
  ],
  sedan: [
    `https://images.unsplash.com/photo-1617531653635-4b0e357c091b?${Q}`,
    `https://images.unsplash.com/photo-1555215695-3004980ad54e?${Q}`,
    `https://images.unsplash.com/photo-1503376780353-7e6692767b70?${Q}`,
    `https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?${Q}`,
  ],
  sport: [
    `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?${Q}`,
    `https://images.unsplash.com/photo-1544636331-e26879cd4d9b?${Q}`,
    `https://images.unsplash.com/photo-1502877338535-766e1452684a?${Q}`,
    `https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?${Q}`,
  ],
  electric: [
    `https://images.unsplash.com/photo-1617788138017-80ad40651399?${Q}`,
    `https://images.unsplash.com/photo-1619767886558-efdc259cde1a?${Q}`,
    `https://images.unsplash.com/photo-1632245889029-e406faaa34cd?${Q}`,
    `https://images.unsplash.com/photo-1568074532099-1e0dc3206a74?${Q}`,
  ],
  offroad: [
    `https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?${Q}`,
    `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?${Q}`,
    `https://images.unsplash.com/photo-1517672651691-24622a91b550?${Q}`,
    `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?${Q}`,
  ],
  pickup: [
    `https://images.unsplash.com/photo-1563720223185-11003d516935?${Q}`,
    `https://images.unsplash.com/photo-1542282088-fe8426682b8f?${Q}`,
    `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?${Q}`,
  ],
  van: [
    `https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?${Q}`,
    `https://images.unsplash.com/photo-1489824904134-891ab64532f1?${Q}`,
  ],
  convertible: [
    `https://images.unsplash.com/photo-1485291571150-772bcfc10da5?${Q}`,
    `https://images.unsplash.com/photo-1550355291-bbee04a92027?${Q}`,
  ],
  hatch: [
    `https://images.unsplash.com/photo-1549399542-7e3f8b79c341?${Q}`,
    `https://images.unsplash.com/photo-1511919884226-fd3cad34687c?${Q}`,
  ],
  wagon: [
    `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?${Q}`,
    `https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?${Q}`,
  ],
  hybrid: [
    `https://images.unsplash.com/photo-1617469767053-d3b523a0b982?${Q}`,
    `https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?${Q}`,
  ],
}

const BIKE_BY_KIND = {
  ruta: [
    `https://images.unsplash.com/photo-1485965120184-e220f721d03e?${Q}`,
    `https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?${Q}`,
  ],
  mtb: [
    `https://images.unsplash.com/photo-1571068316344-75bc76f77890?${Q}`,
    `https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?${Q}`,
    `https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?${Q}`,
  ],
  ebike: [
    `https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?${Q}`,
    `https://images.unsplash.com/photo-1616401784845-180882ba9ba8?${Q}`,
  ],
  gravel: [
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${Q}`,
    `https://images.unsplash.com/photo-1485965120184-e220f721d03e?${Q}`,
  ],
  kids: [
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${Q}`,
  ],
}

const SAAS_BY_KIND = {
  platform: [
    `https://images.unsplash.com/photo-1556761175-5973dc0f32e7?${Q}`,
    `https://images.unsplash.com/photo-1552664730-d307ca884978?${Q}`,
  ],
  chat: [
    `https://images.unsplash.com/photo-1553877522-43269d4ea984?${Q}`,
    `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?${Q}`,
  ],
  analytics: [
    `https://images.unsplash.com/photo-1460925895917-afdab827c52f?${Q}`,
    `https://images.unsplash.com/photo-1551288049-bebda4e38f71?${Q}`,
  ],
  ai: [
    `https://images.unsplash.com/photo-1677442136019-21780ecad995?${Q}`,
    `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?${Q}`,
  ],
  onboarding: [
    `https://images.unsplash.com/photo-1551434678-e076c223a692?${Q}`,
    `https://images.unsplash.com/photo-1524178232363-1fb2b075b655?${Q}`,
  ],
  module: [
    `https://images.unsplash.com/photo-1553877522-43269d4ea984?${Q}`,
    `https://images.unsplash.com/photo-1460925895917-afdab827c52f?${Q}`,
  ],
}

const cursors = new Map()

function hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function pickFromPool(poolKey, pool, stableKey) {
  const i = hash(stableKey) % pool.length
  return pool[i]
}

function carKind(category) {
  const c = category.toLowerCase()
  if (c.includes('suv')) return 'suv'
  if (c.includes('crossover')) return 'suv'
  if (c.includes('sedán') || c === 'sedan') return 'sedan'
  if (c.includes('deportivo') || c.includes('gran turismo')) return 'sport'
  if (c.includes('eléctrico') || c.includes('electrico')) return 'electric'
  if (c.includes('roadster') || c.includes('convertible')) return 'convertible'
  if (c.includes('off-road') || c.includes('off road')) return 'offroad'
  if (c.includes('pickup')) return 'pickup'
  if (c.includes('minivan')) return 'van'
  if (c.includes('hatchback')) return 'hatch'
  if (c.includes('wagon')) return 'wagon'
  if (c.includes('híbrido') || c.includes('hibrido')) return 'hybrid'
  return 'sedan'
}

function bikeKind(category) {
  const c = category.toLowerCase()
  if (c.includes('ruta')) return 'ruta'
  if (c.includes('montaña') || c.includes('montana')) return 'mtb'
  if (c.includes('e-bike') || c.includes('ebike')) return 'ebike'
  if (c.includes('gravel')) return 'gravel'
  if (c.includes('niños') || c.includes('ninos')) return 'kids'
  return 'mtb'
}

function saasKind(category, name) {
  const n = name.toLowerCase()
  const c = category.toLowerCase()
  if (c.includes('onboarding')) return 'onboarding'
  if (c.includes('analytics') || n.includes('métricas') || n.includes('csat') || n.includes('sentimientos'))
    return 'analytics'
  if (c.includes('ia') || n.includes('biky') || n.includes('autopilot')) return 'ai'
  if (n.includes('omnicanal') || n.includes('chat') || n.includes('multiagente')) return 'chat'
  if (c.includes('plataforma') || c.includes('suite') || c.includes('suscripción')) return 'platform'
  if (c.includes('módulo') || c.includes('modulo')) return 'module'
  return 'platform'
}

export function resolveSeedImageUrl({ tenantSlug, category, name, imageUrl }) {
  if (imageUrl) return imageUrl

  const stableKey = `${tenantSlug}:${name}:${category}`
  let pool
  let kind

  if (tenantSlug === 'bikystore') {
    kind = bikeKind(category)
    pool = BIKE_BY_KIND[kind] ?? BIKE_BY_KIND.mtb
  } else if (tenantSlug === 'biky' || tenantSlug === 'keybe') {
    kind = saasKind(category, name)
    pool = SAAS_BY_KIND[kind] ?? SAAS_BY_KIND.platform
  } else {
    kind = carKind(category)
    pool = CAR_BY_KIND[kind] ?? CAR_BY_KIND.sedan
  }

  const poolKey = `${tenantSlug}:${kind}`
  cursors.set(poolKey, (cursors.get(poolKey) ?? 0) + 1)
  return pickFromPool(poolKey, pool, stableKey)
}
