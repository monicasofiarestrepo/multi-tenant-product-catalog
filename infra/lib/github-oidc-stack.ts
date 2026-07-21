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

    // AWS-recommended trust: aud + repo-scoped sub (no ref/repository — missing claims deny assume)
    const deployRole = new iam.Role(this, 'GitHubCatalogDeployRole', {
      roleName: 'GitHubCatalogDeployRole',
      assumedBy: new iam.FederatedPrincipal(
        provider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${GITHUB_REPOSITORY}:*`,
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      description: 'GitHub Actions deploy for CatalogStack',
      maxSessionDuration: cdk.Duration.hours(1),
    })

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
