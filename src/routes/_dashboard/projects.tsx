import {createFileRoute, Outlet} from '@tanstack/react-router';



export const Route = createFileRoute('/_dashboard/projects')({
  component: ProjectsRoute,

});
function ProjectsRoute() {
  return (
    <>
      <Outlet />
    </>
  );
}
