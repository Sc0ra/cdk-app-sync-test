import { ApolloLink, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/link-context';

export const createAppSyncHttpLink = ({ appSyncApiUrl, getJwtToken }) => {
  const authorizationHeaderLink = setContext(
    async (request, previousContext) => ({
      ...previousContext,
      headers: {
        ...previousContext.headers,
        'x-api-key': await getJwtToken(),
      },
    }),
  );

  return ApolloLink.concat(
    authorizationHeaderLink,
    new HttpLink({ uri: appSyncApiUrl }),
  );
};
