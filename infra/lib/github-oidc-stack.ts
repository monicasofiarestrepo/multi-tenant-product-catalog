import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

const GITHUB_OWNER = 'monicasofiarestrepo'
const GITHUB_REPO = 'multi-tenant-product-catalog'
const GITHUB_REPOSITORY = `${GITHUB_OWNER}/${GITHUB_REPO}`

export class GitHubOidcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const provider = new iam.OpenIdConnectProvider(this, 'GitHubOidc', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })

    const deployRole = new iam.Role(this, 'GitHubCatalogDeployRole', {
      roleName: 'GitHubCatalogDeployRole',
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:repository': GITHUB_REPOSITORY,
          'token.actions.githubusercontent.com:ref': 'refs/heads/main',
        },
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:${GITHUB_REPOSITORY}:*`,
        },
      }),
      description: 'GitHub Actions deploy for CatalogStack (main only)',
      maxSessionDuration: cdk.Duration.hours(1),
    })

    // CDK deployer needs broad write in this test account/region
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CdkDeployUsEast2',
        effect: iam.Effect.ALLOW,
        actions: ['*'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'aws:RequestedRegion': 'us-east-2',
          },
        },
      }),
    )

    // IAM + CloudFront are global / not region-scoped the same way
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'GlobalServicesForCdk',
        effect: iam.Effect.ALLOW,
        actions: [
          'iam:*',
          'sts:GetCallerIdentity',
          'cloudfront:*',
          'ssm:GetParameter',
          'ssm:GetParameters',
        ],
        resources: ['*'],
      }),
    )

    new cdk.CfnOutput(this, 'GitHubDeployRoleArn', {
      value: deployRole.roleArn,
      description: 'Set as GitHub Actions variable AWS_DEPLOY_ROLE_ARN',
    })
  }
}
