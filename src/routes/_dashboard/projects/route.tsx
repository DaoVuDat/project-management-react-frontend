import {createFileRoute, Outlet} from '@tanstack/react-router';

const ProjectsRoute = () => {
  return (
    <>
      <div>Projects Route</div>
      <Outlet />
    </>
  );
};

export const Route = createFileRoute('/_dashboard/projects')({
  component: ProjectsRoute,
});
