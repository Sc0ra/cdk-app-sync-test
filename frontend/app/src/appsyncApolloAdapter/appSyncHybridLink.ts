import { ApolloLink, DocumentNode } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import { createAppSyncHttpLink } from './appSyncHttpLink';
import { createAppSyncSubscriptionWebsocketLink } from './appSyncSubscriptionWebSocketLink';

export const createAppSyncHybridLink = async ({
  appSyncApiUrl,
  getJwtToken,
}: {
  appSyncApiUrl: string;
  getJwtToken: () => Promise<string>;
}): Promise<ApolloLink> =>
  ApolloLink.split(
    isSubscriptionOperation,
    await createAppSyncSubscriptionWebsocketLink({
      appSyncApiUrl,
      getJwtToken,
    }),
    createAppSyncHttpLink({ appSyncApiUrl, getJwtToken }),
  );

const isSubscriptionOperation = ({ query }: { query: DocumentNode }) => {
  const { kind, operation } = getMainDefinition(query);

  return kind === 'OperationDefinition' && operation === 'subscription';
};
