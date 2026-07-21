# Multi-tenant product catalog

Vue 3 + AWS serverless CRUD for the Biky technical test.

## Structure

```
apps/web              SPA (Vue 3, Pinia, TanStack Query, Tailwind)
packages/domain       Entities and ports
packages/application  Use cases + seed
packages/shared       Zod DTOs
packages/api          Lambda handler + adapters (+ local dev API)
infra                 AWS CDK (TypeScript)
```

## Local development (before AWS deploy)

Terminal 1 — API in memory (Dynamo/S3 simulated):

```bash
npm install
npm run dev:api
```

Terminal 2 — frontend:

```bash
cp apps/web/.env.example apps/web/.env
# VITE_API_URL=http://localhost:3000
npm run dev
```

Open http://127.0.0.1:5173 — three seeded brands, CRUD, images, filters, cookie.

## AWS deploy (Biky account)

Region: **us-east-2** (IAM de la cuenta restringe otras regiones; CloudFront está permitido).

1. Auth local (never commit keys), e.g. `aws login` or profile:

   ```bash
   export AWS_REGION=us-east-2 AWS_DEFAULT_REGION=us-east-2
   aws sts get-caller-identity
   ```

2. First deploy (placeholder SPA is ok):

   ```bash
   npm run build
   cd infra
   npx cdk bootstrap aws://$CDK_DEFAULT_ACCOUNT/us-east-2   # if needed
   npx cdk deploy CatalogStack --require-approval never
   ```

3. Note outputs `ApiUrl`, `WebUrl`, `ImagesCdnUrl`. Rebuild + republish SPA:

   ```bash
   VITE_API_URL=<ApiUrl> npm run build -w @catalog/web
   cd infra && npx cdk deploy CatalogStack --require-approval never
   ```

## Technical decisions

| Topic | Choice |
|--------|--------|
| Multi-tenant | DynamoDB single-table `PK=TENANT#id`, `SK=META` / `PRODUCT#id` |
| Images | Presigned PUT → private S3; GET via CloudFront OAC |
| Cookie | `catalog_tenant`, `SameSite=Lax`, `Secure` in prod; not HttpOnly (SPA reads preference) |
| Extras | Pinia + TanStack Query, Tailwind tokens, client filters, Vitest, basic a11y |

## Scale (100k products)

Client-side filters → API query params; GSI on category; cursor pagination; optional OpenSearch.

## Scripts

- `npm run dev` / `npm run dev:api` — local UI + API
- `npm run build` — production SPA
- `npm run test` — Vitest (web)
- `npm run cdk -- synth` — from infra workspace
- `npm run verify:publish` — ensure no Cursor/AI paths are tracked before push
