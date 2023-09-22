import { Stack, StackProps } from 'aws-cdk-lib';
import {
  AppsyncFunction,
  AuthorizationType,
  Code,
  Definition,
  FieldLogLevel,
  FunctionRuntime,
  GraphqlApi,
  Resolver,
} from 'aws-cdk-lib/aws-appsync';
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import path from 'path';

import { bundleAppSyncResolver } from './helpers';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const cloudWatchLogsRole = new Role(this, 'CloudWatchLogsRole', {
      roleName: 'CloudWatchLogsRole',
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppSyncPushToCloudWatchLogs',
        ),
      ],
    });

    const api = new GraphqlApi(this, 'Api', {
      name: 'demo',
      definition: Definition.fromFile(
        path.join(__dirname, '../schema.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
        role: cloudWatchLogsRole,
      },
      xrayEnabled: true,
    });

    const demoTable = new TableV2(this, 'DemoTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING,
      },
    });

    const demoDS = api.addDynamoDbDataSource('demoDataSource', demoTable);

    const defaultPipelineCode = Code.fromInline(`
    // The before step
    export function request(...args) {
      return {}
    }

    // The after step
    export function response(ctx) {
      return ctx.prev.result
    }
  `);

    const getDemo = new AppsyncFunction(this, 'GetDemo', {
      api,
      name: 'getDemo',
      dataSource: demoDS,
      code: bundleAppSyncResolver(
        path.join(__dirname, '../resolvers/getDemo.ts'),
      ),
      runtime: FunctionRuntime.JS_1_0_0,
    });

    new Resolver(this, 'QueryGetDemoResolver', {
      api,
      typeName: 'Query',
      fieldName: 'getDemo',
      code: defaultPipelineCode,
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getDemo],
    });

    const createDemo = new AppsyncFunction(this, 'CreateDemo', {
      api,
      name: 'createDemo',
      dataSource: demoDS,
      code: bundleAppSyncResolver(
        path.join(__dirname, '../resolvers/createDemo.ts'),
      ),
      runtime: FunctionRuntime.JS_1_0_0,
    });

    new Resolver(this, 'MutationCreateDemoResolver', {
      api,
      typeName: 'Mutation',
      fieldName: 'createDemo',
      code: defaultPipelineCode,
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createDemo],
    });

    const getDemos = new AppsyncFunction(this, 'GetDemos', {
      api,
      name: 'getDemos',
      dataSource: demoDS,
      code: bundleAppSyncResolver(
        path.join(__dirname, '../resolvers/getDemos.ts'),
      ),
      runtime: FunctionRuntime.JS_1_0_0,
    });

    new Resolver(this, 'QueryGetDemosResolver', {
      api,
      typeName: 'Query',
      fieldName: 'getDemos',
      code: defaultPipelineCode,
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getDemos],
    });
  }
}
