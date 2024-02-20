import {createLazyFileRoute} from '@tanstack/react-router';

const ProjectRoute = () => {
  const data = Route.useLoaderData();
  return <div>Project ID - {data}</div>;
};

export const Route = createLazyFileRoute('/_dashboard/projects/$id')({
  component: ProjectRoute,
});
