/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Context, DynamoDBGetItemRequest, util } from '@aws-appsync/utils';

import { Demo, QueryGetDemoArgs } from '../types/appsync';

export function request(
  ctx: Context<QueryGetDemoArgs>,
): DynamoDBGetItemRequest {
  return {
    operation: 'GetItem',
    key: {
      PK: util.dynamodb.toDynamoDB(`DEMO#${ctx.args.id}`),
      SK: util.dynamodb.toDynamoDB(`DEMO#${ctx.args.id}`),
    },
  };
}

export function response(
  ctx: Context<QueryGetDemoArgs, object, object, object, Demo>,
) {
  return ctx.result;
}
