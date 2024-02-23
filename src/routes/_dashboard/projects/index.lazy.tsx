import {createLazyFileRoute} from '@tanstack/react-router';
export const Route = createLazyFileRoute('/_dashboard/projects/')({
  component: ProjectsRoute,
});

function ProjectsRoute() {
  return <div>index</div>;
};

