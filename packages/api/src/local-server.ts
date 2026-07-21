import { createServer } from 'node:http'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { handler } from './handlers/api'
import { memoryImages } from './adapters/memory-store'

process.env.LOCAL_IN_MEMORY = '1'
process.env.CORS_ORIGIN = '*'

const PORT = Number(process.env.PORT ?? 3000)

function toEvent(req: import('node:http').IncomingMessage, body: string, path: string): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: '$default',
    rawPath: path,
    rawQueryString: '',
    headers: Object.fromEntries(
      Object.entries(req.headers).map(([k, v]) => [k, String(v ?? '')]),
    ),
    requestContext: {
      accountId: 'local',
      apiId: 'local',
      domainName: 'localhost',
      domainPrefix: 'local',
      http: {
        method: req.method ?? 'GET',
        path,
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: req.headers['user-agent'] ?? '',
      },
      requestId: 'local',
      routeKey: '$default',
      stage: '$default',
      time: new Date().toISOString(),
      timeEpoch: Date.now(),
    },
    isBase64Encoded: false,
    body: body || undefined,
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const body = Buffer.concat(chunks).toString('utf8')

  if (url.pathname.startsWith('/media/upload/')) {
    const key = decodeURIComponent(url.pathname.replace('/media/upload/', ''))
    memoryImages.registerUpload(key, Buffer.from(body))
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*' })
    res.end()
    return
  }

  if (url.pathname.startsWith('/media/') && req.method === 'GET') {
    const key = decodeURIComponent(url.pathname.replace('/media/', ''))
    const obj = memoryImages.getObject(key)
    if (!obj) {
      res.writeHead(404)
      res.end()
      return
    }
    res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Access-Control-Allow-Origin': '*' })
    res.end(obj)
    return
  }

  const event = toEvent(req, body, url.pathname)
  const result = await handler(event)
  const status = result.statusCode ?? 200
  const hdrs = result.headers ?? {}
  res.writeHead(status, hdrs)
  res.end(result.body ?? '')
}).listen(PORT, () => {
  console.log(`Local API http://localhost:${PORT}`)
})
