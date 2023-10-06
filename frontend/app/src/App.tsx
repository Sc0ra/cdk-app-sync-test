import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { IntlProvider } from 'react-intl';

import { flattenMessages } from 'services/i18n';
import { muiTheme } from 'theme';
import { frFRMessages } from 'translations';

import AppRoutes from './AppRoutes';
import { createAppSyncHybridLink } from './appsyncApolloAdapter/appSyncHybridLink';

const intlMessages = flattenMessages(frFRMessages);

export const createAppSyncApolloClient = async ({
  appSyncApiUrl,
  getJwtToken,
  cacheConfig,
  connectToDevTools,
}: {
  appSyncApiUrl: string;
  getJwtToken: () => Promise<string>;
  cacheConfig: Record<string, unknown>;
  connectToDevTools: boolean;
}): Promise<ApolloClient<NormalizedCacheObject>> =>
  new ApolloClient({
    link: await createAppSyncHybridLink({
      appSyncApiUrl,
      getJwtToken,
    }),
    cache: new InMemoryCache(cacheConfig),
    connectToDevTools,
  });

const client = await createAppSyncApolloClient({
  appSyncApiUrl:
    'https://ucfrr4am6rfj7cg5mb2n57jzdq.appsync-api.eu-west-1.amazonaws.com/graphql',
  getJwtToken: () => Promise.resolve('da2-ftz2saux2jhv3mvx4pa7g5wi7q'),
  cacheConfig: {},
  connectToDevTools: true,
});

const App = (): JSX.Element => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={muiTheme}>
        <IntlProvider locale="fr-FR" messages={intlMessages}>
          <CssBaseline />
          <AppRoutes />
        </IntlProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
