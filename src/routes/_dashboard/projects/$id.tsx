import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/projects/$id')({
  validateSearch: () => ({}),
  loader: ({params}) => params.id,
});
