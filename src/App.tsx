import {createRouter, RouterProvider} from '@tanstack/react-router';
import {routeTree} from '@/routeTree.gen.ts';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useAuth} from '@/context/authContext.tsx';

// create query client
const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
    authContext: undefined!,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const authContext = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{authContext, queryClient}}
      />
    </QueryClientProvider>
  );
}

export default App;
