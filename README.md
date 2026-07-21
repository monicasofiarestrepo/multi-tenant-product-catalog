# Multi-tenant product catalog

Small full-stack app for the Biky technical test: a product catalog with images, several brands (tenants), and a Vue SPA that talks to a real serverless API on AWS. Nothing is mocked in production — reload the page or open the public URL and you see the same data.

## What’s live

| | URL |
|--|-----|
| Frontend | https://daq2o95hh6swe.cloudfront.net |
| API | https://ynnkakaim7.execute-api.us-east-2.amazonaws.com |

Region: **us-east-2** (this AWS account only allows that region for most services; CloudFront is fine).

## Repo layout

```
apps/web              Vue 3 SPA (Pinia, TanStack Query, Tailwind)
packages/domain       Entities and ports (no AWS types)
packages/application  Use cases + seed brands
packages/shared       Zod DTOs
packages/api          Lambda handler + Dynamo/S3 adapters
infra                 AWS CDK (TypeScript)
```

## Run it locally

You need two terminals. The API can run in memory (no AWS required for day-to-day UI work).

```bash
npm install
npm run dev:api
```

In another terminal:

```bash
cp apps/web/.env.example apps/web/.env
# keeps VITE_API_URL=http://localhost:3000
npm run dev
```

Open http://127.0.0.1:5173 — you should get three seeded brands, CRUD, images (local), filters, and a tenant cookie.

## Deploy automático (push a `main`)

Cada push a `main` (o un run manual del workflow) dispara GitHub Actions:

1. Asume un rol IAM vía **OIDC** (no hay access keys en el repo ni en secrets).
2. Lee `ApiUrl` del stack `CatalogStack` ya desplegado.
3. Build del SPA con esa URL.
4. `cdk deploy CatalogStack` en `us-east-2` (Lambda, API, DynamoDB, S3, CloudFront).

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Una sola vez (bootstrap CI)

Esto solo hace falta la primera vez, o si cambias la cuenta AWS / el rol.

1. Con sesión AWS local (`aws login` o profile), despliega el stack OIDC:

   ```bash
   export AWS_REGION=us-east-2 AWS_DEFAULT_REGION=us-east-2
   cd infra
   npx cdk deploy GitHubOidcStack --require-approval never
   ```

2. Copia el output `GitHubDeployRoleArn`.

3. En el repo de GitHub → **Settings → Secrets and variables → Actions → Variables**, crea:

   | Variable | Valor |
   |----------|--------|
   | `AWS_ACCOUNT_ID` | `266176113590` |
   | `AWS_DEPLOY_ROLE_ARN` | el ARN del paso anterior |

4. El siguiente push a `main` (o **Actions → Deploy to AWS → Run workflow**) debería desplegar solo.

El trust del rol está limitado a  
`repo:monicasofiarestrepo/multi-tenant-product-catalog:ref:refs/heads/main`.

### Deploy manual (sin CI)

Si aún no tienes Actions configurado:

```bash
export AWS_REGION=us-east-2 AWS_DEFAULT_REGION=us-east-2
npm run build
cd infra
npx cdk deploy CatalogStack --require-approval never

# luego, con la ApiUrl del output:
VITE_API_URL=<ApiUrl> npm run build -w @catalog/web
cd infra && npx cdk deploy CatalogStack --require-approval never
```

Nunca subas credenciales AWS al repo. Usa perfil local / `aws login` / OIDC en CI.

## Decisiones rápidas

Multi-tenant va en una sola tabla DynamoDB (`PK=TENANT#id`, productos bajo el mismo tenant). Las imágenes se suben con URL firmada a un bucket privado y se sirven por CloudFront (OAC). La cookie `catalog_tenant` recuerda la marca (`SameSite=Lax`, `Secure` en prod; no es HttpOnly porque el SPA la lee).

Extras: Pinia + TanStack Query, filtros en cliente, Vitest, a11y básica.

Si el catálogo creciera a ~100k productos: filtros en API, GSI por categoría, paginación por cursor, y quizá OpenSearch.

## Scripts

- `npm run dev` / `npm run dev:api` — UI + API local
- `npm run build` — SPA de producción
- `npm run test` — Vitest (web)
- `npm run cdk -- synth` — desde el workspace infra
