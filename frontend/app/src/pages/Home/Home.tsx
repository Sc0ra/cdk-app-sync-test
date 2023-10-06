import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

import { Title } from 'components';

const GET_DEMO = gql`
  query GetDemo($id: String!) {
    getDemo(id: $id) {
      id
      version
    }
  }
`;

const CREATE_DEMO = gql`
  mutation AddTodo($version: String!) {
    createDemo(input: { version: $version }) {
      id
      version
    }
  }
`;

const DEMO_CREATED_SUBSCRIPTION = gql`
  subscription OnDemoCreated {
    onDemoCreated {
      id
      version
    }
  }
`;

interface Demo {
  id: string;
  version: string;
}

const Home = (): JSX.Element => {
  const { data: getDemoResult } = useQuery<Demo>(GET_DEMO, {
    variables: { id: 'ba8a129b-f564-4a8f-b566-96e7f37896a3' },
  });

  const [createDemo] = useMutation<Demo>(CREATE_DEMO);

  const { data: demoCreated } = useSubscription<Demo>(
    DEMO_CREATED_SUBSCRIPTION,
    {},
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignContent="center"
      textAlign="center"
      height="100vh"
      maxWidth="100%"
    >
      <Title />
      <Button
        onClick={() => {
          void createDemo({ variables: { version: '1.4.0' } });
        }}
      >
        Create Demo
      </Button>
      <Box marginTop={6}>
        {JSON.stringify({
          getDemoResult,
        })}
      </Box>
      <Box marginTop={6}>
        {JSON.stringify({
          demoCreated,
        })}
      </Box>
    </Box>
  );
};

export default Home;
