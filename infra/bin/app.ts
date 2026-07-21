#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { CatalogStack } from '../lib/catalog-stack'

const app = new cdk.App()

new CatalogStack(app, 'CatalogStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-2',
  },
  description: 'Multi-tenant product catalog (API + data + web hosting)',
})
