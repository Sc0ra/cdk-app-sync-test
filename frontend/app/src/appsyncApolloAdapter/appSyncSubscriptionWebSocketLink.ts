import { WebSocketLink } from '@apollo/link-ws';

import { UUIDOperationIdSubscriptionClient } from '../UUIDOperationIdSubscriptionClient';
import { createAppSyncAuthorizedWebSocket } from './appSyncAuthorizedWebSocket';
import { createAppSyncGraphQLOperationAdapter } from './appSyncGraphQLOperationAdapter';
import { cacheWithAsyncRefresh } from './asyncUtils';

const APPSYNC_MAX_CONNECTION_TIMEOUT_MILLISECONDS = 5 * 60 * 1000;

export const createAppSyncSubscriptionWebsocketLink = async ({
  appSyncApiUrl,
  getJwtToken,
}: {
  appSyncApiUrl: string;
  getJwtToken: () => Promise<string>;
}): Promise<WebSocketLink> => {
  const appSyncApiHost = new URL(appSyncApiUrl).host;
  const getAppSyncAuthorizationInfo = async () => ({
    host: appSyncApiHost,
    'x-api-key': await getJwtToken(),
  });

  return new WebSocketLink(
    new UUIDOperationIdSubscriptionClient(
      `wss://${appSyncApiHost.replace(
        'appsync-api',
        'appsync-realtime-api',
      )}/graphql`,
      {
        timeout: APPSYNC_MAX_CONNECTION_TIMEOUT_MILLISECONDS,
        reconnect: true,
        lazy: true,
      },
      // We want to avoid expired authorization information being used but SubscriptionClient synchronously
      // instantiates websockets (on connection/reconnection) so the best we can do is schedule an async refresh
      // and suffer failed connection attempts until a fresh token has been retrieved
      createAppSyncAuthorizedWebSocket(
        await cacheWithAsyncRefresh(getAppSyncAuthorizationInfo),
      ),
    ).use([createAppSyncGraphQLOperationAdapter(getAppSyncAuthorizationInfo)]),
  );
};
