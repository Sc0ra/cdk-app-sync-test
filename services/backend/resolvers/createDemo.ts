/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';

import { createItem } from 'lib/helpers';

import { Demo, MutationCreateDemoArgs } from '../types/appsync';

export function request(
  ctx: Context<MutationCreateDemoArgs>,
): DynamoDBPutItemRequest {
  const item = createItem(ctx.args.input);

  const id = util.autoId();

  return {
    operation: 'PutItem',
    key: {
      PK: util.dynamodb.toDynamoDB(`DEMO#${id}`),
      SK: util.dynamodb.toDynamoDB(`DEMO#${id}`),
    },
    attributeValues: util.dynamodb.toMapValues({
      id,
      ...item,
    }),
  };
}

export function response(
  ctx: Context<MutationCreateDemoArgs, object, object, object, Demo>,
) {
  return ctx.result;
}
