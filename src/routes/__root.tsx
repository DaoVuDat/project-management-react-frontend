import {createRootRouteWithContext, Outlet} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/router-devtools';
import {QueryClient} from '@tanstack/react-query';


interface RootRouteContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => 'Page Not Found',
});
