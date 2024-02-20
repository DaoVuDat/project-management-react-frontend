import {createRootRouteWithContext, Outlet} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/router-devtools';
import {QueryClient} from '@tanstack/react-query';
import {AuthContext} from '@/context/authContext.tsx';

interface RootRouteContext {
  queryClient: QueryClient;
  authContext: AuthContext;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => '404 Not Found',
});
