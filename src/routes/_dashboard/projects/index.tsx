import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';
import {useAuthStore} from '@/store/authStore.tsx';
import {getProjects} from '@/services/api/projects.tsx';
import {GlobalLoading} from '@/components/loading/globalLoading.tsx';

const projectsSearchSchema = z.object({
  byUid: z.string().optional(),
  returnPayment: z.boolean().optional(),
});

type ProjectsSearch = {
  returnPayment?: boolean | undefined;
  byUid?: string | undefined;
};

export const Route = createFileRoute('/_dashboard/projects/')({
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => {
    return projectsSearchSchema.parse(search);
  },
  loaderDeps: ({search: {byUid, returnPayment}}) => ({
    byUid: byUid,
    returnPayment: returnPayment,
  }),
  loader: async ({context, deps}) => {
    const accessToken = useAuthStore.getState().accessToken;

    const queryClient = context.queryClient;

    try {
      await queryClient.ensureQueryData({
        queryKey: [
          'projects',
          {
            byUid: deps.byUid,
            returnPayment: deps.returnPayment,
          },
        ],
        queryFn: () => {
          return getProjects(accessToken, deps.byUid, deps.returnPayment);
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
