import {createRouter, RouterProvider} from '@tanstack/react-router';
import {routeTree} from '@/routeTree.gen.ts';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


// create query client
const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{queryClient}}
      />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
