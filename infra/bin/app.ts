#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { CatalogStack } from '../lib/catalog-stack'
import { GitHubOidcStack } from '../lib/github-oidc-stack'

const app = new cdk.App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'us-east-2',
}

new CatalogStack(app, 'CatalogStack', {
  env,
  description: 'Multi-tenant product catalog (API + data + web hosting)',
})

new GitHubOidcStack(app, 'GitHubOidcStack', {
  env,
  description: 'OIDC provider + IAM role for GitHub Actions deploy',
})
