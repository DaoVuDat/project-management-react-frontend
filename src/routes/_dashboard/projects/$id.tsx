import {createFileRoute} from '@tanstack/react-router';
import {useAuthStore} from '@/store/authStore.tsx';
import {getProjectById} from '@/services/api/projects.tsx';
import {GlobalLoading} from '@/components/loading/globalLoading.tsx';

export const Route = createFileRoute('/_dashboard/projects/$id')({
  loader: async ({params, context}) => {
    const accessToken = useAuthStore.getState().accessToken;
    const queryClient = context.queryClient;

    const projectId = params.id;

    try {
      await queryClient.ensureQueryData({
        queryKey: ['project', projectId],
        queryFn: () => {
          return getProjectById(accessToken, projectId);
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
  pendingComponent: () => {
    return (
      <div className="absolute left-1/2 top-1/2 z-50 w-64 -translate-x-1/2 -translate-y-1/2">
        <GlobalLoading />
      </div>
    );
  },
});
