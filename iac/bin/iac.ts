#!/usr/bin/env node
import 'source-map-support/register';

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
//
import * as cdk from 'aws-cdk-lib';
import { BoulderShinesIACStack } from '../lib/boulder-shines-iac';

const app = new cdk.App();

const {
  AWS_ALB_LISTENER_ARN,
  AWS_CLUSTER_ARN,
  AWS_DEFAULT_SG,
  AWS_VPC_ID,
  CDK_DEFAULT_ACCOUNT,
  CDK_DEFAULT_REGION,
  OPENWEATHERMAP_API_KEY,
} = process.env;

if (!AWS_ALB_LISTENER_ARN) {
  throw new Error('AWS_ALB_LISTENER_ARN env is not defined!');
}

if (!AWS_CLUSTER_ARN) {
  throw new Error('AWS_CLUSTER_ARN env is not defined!');
}

if (!AWS_DEFAULT_SG) {
  throw new Error('AWS_DEFAULT_SG env is not defined!');
}

if (!AWS_VPC_ID) {
  throw new Error('AWS_VPC_ID env is not defined!');
}

if (!CDK_DEFAULT_ACCOUNT) {
  throw new Error('CDK_DEFAULT_ACCOUNT env is not defined!');
}

if (!CDK_DEFAULT_REGION) {
  throw new Error('CDK_DEFAULT_REGION env is not defined!');
}

if (!OPENWEATHERMAP_API_KEY) {
  throw new Error('OPENWEATHERMAP_API_KEY env is not defined!');
}

new BoulderShinesIACStack(app, 'bsh-stack', {
  env: {
    account: CDK_DEFAULT_ACCOUNT,
    region: CDK_DEFAULT_REGION,
  },
  aws_env: {
    AWS_ALB_LISTENER_ARN,
    AWS_CLUSTER_ARN,
    AWS_DEFAULT_SG,
    AWS_VPC_ID,
  },
  svc_env: {
    OPENWEATHERMAP_API_KEY,
  },
});