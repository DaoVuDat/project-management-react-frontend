import { createLazyFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { Project } from '@/routes/_dashboard/-components/Project.tsx';

const routeApi = getRouteApi("/_dashboard/projects/$id")

export const Route = createLazyFileRoute('/_dashboard/projects/$id')({
  component: ProjectRoute,
});

function ProjectRoute() {
  // const data = Route.useLoaderData();
  const {id} = routeApi.useParams()

  return (
    <div>
      <Project mode='view' id={id}/>

    </div>
  );
}
