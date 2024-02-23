import {createLazyFileRoute} from '@tanstack/react-router';
export const Route = createLazyFileRoute('/_dashboard/projects/$id')({
  component: ProjectRoute,
});

function ProjectRoute() {
  const data = Route.useLoaderData();
  return <div>Project ID - {data}</div>;
};

