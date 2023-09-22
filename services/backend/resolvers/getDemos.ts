/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Context, DynamoDBScanRequest } from '@aws-appsync/utils';

import { Demo } from 'types/appsync';

export function request(): DynamoDBScanRequest {
  return {
    operation: 'Scan',
  };
}

export function response(
  ctx: Context<object, object, object, object, { items: Array<Demo> }>,
) {
  return ctx.result.items;
}
