import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';

interface BoulderShinesIACStackProps extends cdk.StackProps {
  aws_env: {
    AWS_DEFAULT_SG: string;
    AWS_CLUSTER_ARN: string;
    AWS_VPC_ID: string;
    AWS_ALB_LISTENER_ARN: string;
  };
  svc_env: {
    OPENWEATHERMAP_API_KEY: string;
  };
}

export class BoulderShinesIACStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BoulderShinesIACStackProps) {
    super(scope, id, props);

    const bshFargateService = new ecs.FargateService(this, 'bsh-service', {
      assignPublicIp: true,

      desiredCount: 1,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 1,
        },
      ],
      taskDefinition: new ecs.FargateTaskDefinition(
        this,
        'bsh-task-definition',
        {
          taskRole: iam.Role.fromRoleName(
            this,
            'jh-ecs-task-definition-role',
            'jh-ecs-task-definition-role'
          ),
          executionRole: iam.Role.fromRoleName(
            this,
            'jh-ecs-task-execution-role',
            'jh-ecs-task-execution-role'
          ),
        }
      ),
      cluster: ecs.Cluster.fromClusterAttributes(this, 'jh-imported-cluster', {
        securityGroups: [
          ec2.SecurityGroup.fromSecurityGroupId(
            this,
            'imported-default-sg',
            props.aws_env.AWS_DEFAULT_SG
          ),
        ],
        clusterName: 'jh-e1-ecs-cluster',
        clusterArn: props.aws_env.AWS_CLUSTER_ARN,
        vpc: ec2.Vpc.fromLookup(this, 'jh-imported-vpc', {
          vpcId: props.aws_env.AWS_VPC_ID,
        }),
      }),
      enableExecuteCommand: true,
    });

    const frontendContainer = bshFargateService.taskDefinition.addContainer(
      'bsh-container-fe',
      {
        portMappings: [{ containerPort: 3000, hostPort: 3000 }],
        image: ecs.ContainerImage.fromAsset('../frontend'),
        logging: new ecs.AwsLogDriver({
          streamPrefix: 'bsh-container-fe',
          logRetention: logs.RetentionDays.FIVE_DAYS,
        }),
      }
    );

    const backendContainer = bshFargateService.taskDefinition.addContainer(
      'bsh-container-be',
      {
        portMappings: [{ containerPort: 8080, hostPort: 8080 }],
        image: ecs.ContainerImage.fromAsset('../jokes-api'),
        logging: new ecs.AwsLogDriver({
          streamPrefix: 'bsh-container-be',
          logRetention: logs.RetentionDays.FIVE_DAYS,
        }),
        environment: {
          ...props.svc_env,
        },
      }
    );

    const importedALBListener = elbv2.ApplicationListener.fromLookup(
      this,
      'imported-https-listener',
      {
        listenerArn: props.aws_env.AWS_ALB_LISTENER_ARN,
      }
    );

    const backendTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      'bsh-be-tg',
      {
        port: 8080,
        protocol: elbv2.ApplicationProtocol.HTTP,
        targets: [
          bshFargateService.loadBalancerTarget({
            containerName: backendContainer.containerName,
          }),
        ],
        vpc: ec2.Vpc.fromLookup(this, 'jh-imported-vpc-tg-be', {
          vpcId: props.aws_env.AWS_VPC_ID,
        }),
        healthCheck: {
          path: '/healthcheck',
          unhealthyThresholdCount: 2,
          healthyHttpCodes: '200',
          healthyThresholdCount: 5,
          interval: cdk.Duration.seconds(30),
          port: '8080',
          timeout: cdk.Duration.seconds(10),
        },
      }
    );

    const frontendTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      'bsh-fe-tg',
      {
        port: 3000,
        protocol: elbv2.ApplicationProtocol.HTTP,
        targets: [
          bshFargateService.loadBalancerTarget({
            containerName: frontendContainer.containerName,
          }),
        ],
        vpc: ec2.Vpc.fromLookup(this, 'jh-imported-vpc-tg-fe', {
          vpcId: props.aws_env.AWS_VPC_ID,
        }),
        healthCheck: {
          path: '/api/healthcheck',
          unhealthyThresholdCount: 2,
          healthyHttpCodes: '200',
          healthyThresholdCount: 5,
          interval: cdk.Duration.seconds(30),
          port: '3000',
          timeout: cdk.Duration.seconds(10),
        },
      }
    );

    importedALBListener.addTargetGroups('bsh-listener-tg-be', {
      targetGroups: [backendTargetGroup],
      priority: 60,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['data.bertramcappuccino.com']),
        elbv2.ListenerCondition.pathPatterns([
          '/joke',
          '/websocket-endpoint',
          '/healthcheck',
        ]),
      ],
    });

    importedALBListener.addTargetGroups('bsh-listener-tg-fe', {
      targetGroups: [frontendTargetGroup],
      priority: 70,
      conditions: [
        elbv2.ListenerCondition.hostHeaders([
          'www.bertramcappuccino.com',
          'bertramcappuccino.com',
        ]),
      ],
    });
  }
}
