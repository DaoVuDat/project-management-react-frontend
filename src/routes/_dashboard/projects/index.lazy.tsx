import {createLazyFileRoute} from '@tanstack/react-router';

const ProjectsRoute = () => {
  return <div>index</div>;
};

export const Route = createLazyFileRoute('/_dashboard/projects/')({
  component: ProjectsRoute,
});
