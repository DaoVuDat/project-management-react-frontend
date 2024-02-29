import {createLazyFileRoute, Link} from '@tanstack/react-router';
import { Project } from '@/routes/_dashboard/-components/Project.tsx';

export const Route = createLazyFileRoute('/_dashboard/projects/$id')({
  component: ProjectRoute,
});

function ProjectRoute() {
  // const data = Route.useLoaderData();
  return (
    <div>
      <Project mode='view'/>
      <Link
        to={'/projects/$id/edit'}
        params={{id: Route.useParams().id}}>
        Edit
      </Link>
    </div>
  );
}
