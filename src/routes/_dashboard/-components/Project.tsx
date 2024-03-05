import {
  ProjectUpdate,
  getProjectById,
  updateProjectById,
  ProjectStatus,
} from '@/services/api/projects.tsx';
import {useMutation, useSuspenseQuery} from '@tanstack/react-query';
import {useAuthStore} from '@/store/authStore.tsx';
import {formatMoney} from '@/utils/money.ts';
import {StatusPayment} from '@/components/status/StatusPayment.tsx';
import {formatDateWithText} from '@/utils/date.ts';
import {Link, useNavigate, useRouter} from '@tanstack/react-router';
import {CiEdit} from 'react-icons/ci';
import {StatusProject} from '@/components/status/StatusProject.tsx';
import {MdAdd} from 'react-icons/md';
import {OverlayDialog} from '@/components/dialog/OverlayDialog.tsx';
import {useEffect, useState} from 'react';
import {Project as ProjectType} from '@/services/api/projects.tsx';
import {toast} from 'react-hot-toast';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ControlledSelect} from '@/components/select/ControlledSelect.tsx';
import {format} from 'date-fns';
import {clsx} from 'clsx';
import {ToastLoadingId} from '@/components/toast/Toast.tsx';
import {useQueryClient} from '@tanstack/react-query';
import {CommaInput} from '@/components/inputNumberWithComma/CommaInput.tsx';
import _ from 'lodash';

type mode = 'edit' | 'view';

interface ProjectProps {
  fullPath: '/projects/$id/edit' | '/projects/$id';
  mode: mode;
  id: string;
}

export function Project({mode, id, fullPath}: ProjectProps) {
  // set modal
  const [currentMode, setCurrentMode] = useState<mode>(mode);

  const {accessToken, role} = useAuthStore((s) => ({
    accessToken: s.accessToken,
    role: s.role,
  }));
  const {data} = useSuspenseQuery({
    queryKey: ['project', id],
    queryFn: () => {
      return getProjectById(accessToken, id);
    },
  });
  const project = data.project;

  // calculate accumulate price from payment history
  const totalPayment = project.payment.reduce((prev, cur) => {
    return prev + cur.amount;
  }, 0);

  const navigate = useNavigate({
    from: fullPath,
  });

  const onClose = () => {
    setCurrentMode('view');
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (currentMode === 'view') {
      timeoutId = setTimeout(() => {
        navigate({
          to: '/projects/$id',
          params: {
            id: id,
          },
          replace: true,
        })
          .then(() => clearTimeout(timeoutId))
          .catch(console.log);
      }, 300);
    }

    return () => clearTimeout(timeoutId);
  }, [currentMode]);

  return (
    <>
      <main>
        <OverlayDialog
          open={currentMode === 'edit'}
          onClose={onClose}
          titleComponent={<>Update Project</>}
          bodyComponent={
            <UpdateProjectForm
              onClose={onClose}
              project={project}
            />
          }
        />
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Project Detail */}
          <div className="relative -mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="max-w-60 text-wrap text-3xl font-semibold leading-9 text-gray-900 sm:max-w-sm lg:max-w-md">
              {project.project_name}
            </h2>
            <div className="absolute right-8 top-8 sm:top-8 xl:right-16 xl:top-16">
              <StatusProject status={project.status} />
            </div>

            <h2 className="text- mt-2 text-end text-sm leading-6 text-gray-700">
              <i>by {project.username}</i>
            </h2>

            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
              <div className="sm:pr-4">
                <dt className="inline text-gray-500">Start on:</dt>{' '}
                <dd className="inline text-gray-700">
                  <time dateTime={project.start_time}>
                    {formatDateWithText(project.start_time)}
                  </time>
                </dd>
              </div>
              <div className="mt-2 sm:mt-0 sm:pl-4">
                <dt className="inline text-gray-500">Finish on:</dt>{' '}
                <dd className="inline text-gray-700">
                  <time dateTime={project.end_time}>
                    {formatDateWithText(project.end_time)}
                  </time>
                </dd>
              </div>

              <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4 md:col-span-2">
                <dt className="font-semibold text-gray-900">Description</dt>
                <div className="mt-1">{project.description}</div>
              </div>
            </dl>

            <div className="mt-6 flex space-x-4 border-t border-gray-900/5 pt-6 sm:pr-4">
              {/*Edit button*/}
              <div>
                <Link
                  replace={true}
                  className="inline-flex space-x-2 rounded-md border p-2 text-xl"
                  to={'/projects/$id/edit'}
                  params={{id: id}}>
                  <CiEdit /> <span className="text-sm">Edit</span>
                </Link>
              </div>
              {role === 'admin' && (
                <div>
                  <button className="inline-flex space-x-2 rounded-md border p-2 text-xl">
                    <MdAdd /> <span className="text-sm">Add a payment</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Payment History */}
          <div className="lg:col-start-3 lg:row-end-1">
            <h2 className="sr-only">Payment History</h2>
            <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
              <dl className="flex flex-wrap">
                <div className="flex-auto pl-6 pt-6">
                  <dt className="text-sm font-semibold leading-6 text-gray-900">
                    Price
                  </dt>
                  <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                    {formatMoney(project.price)}
                  </dd>
                </div>
                <div className="flex-none self-end px-6 pt-4">
                  <StatusPayment
                    projectPrice={project.price}
                    paymentPaid={totalPayment}
                  />
                </div>
                <div className="mt-6 w-full flex-none border-t border-gray-900/5 ">
                  <dt className=" pl-6 pt-6 text-sm font-semibold leading-6 text-gray-900">
                    Paid
                  </dt>
                  {project.payment.length < 1 ? (
                    <div className="flex w-full flex-none justify-between gap-x-4 px-6 pt-6 text-sm font-medium leading-6 text-gray-900">
                      No record
                    </div>
                  ) : (
                    project.payment.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex w-full flex-none justify-between gap-x-4 px-6 pt-6">
                        <dt className="flex-none text-sm font-medium leading-6 text-gray-900">
                          <span>{formatDateWithText(payment.created_at)}</span>
                        </dt>
                        <dd className="text-sm font-medium leading-6 text-gray-900">
                          {formatMoney(payment.amount)}
                        </dd>
                      </div>
                    ))
                  )}
                </div>
              </dl>
              <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                <p className="flex justify-between text-sm font-semibold leading-6 text-gray-900">
                  <span>Total Paid:</span>
                  <span>{formatMoney(totalPayment)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Update Project Form Component
const schema = z.object({
  name: z.string().min(10),
  description: z.string().min(10),
  status: z.custom<ProjectStatus>(),
  start_time: z.string().nullish(),
  end_time: z.string().nullish(),
  price: z
    .string()
    .refine(
      (val) => (val ? Number(val) >= 1_000_000 : null),
      'Price must be large than 1,000,000',
    )
    .nullish(),
});

type SchemaType = z.infer<typeof schema>;

interface UpdateProjectFormProps {
  onClose: () => void;
  project: ProjectType;
}

function UpdateProjectForm({onClose, project}: UpdateProjectFormProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {mutate, isPending} = useMutation<ProjectType, Error, ProjectUpdate>({
    mutationFn: (data) => {
      return updateProjectById(accessToken, project.id, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', project.id],
      });
      toast.dismiss(ToastLoadingId);
      toast.success(`Update project ${project.id} successfully.`);
      router.invalidate();
    },
    onMutate: () => {
      toast.loading(`Updating project ${project.id}...`, {
        id: ToastLoadingId,
      });
    },
    onError: () => {
      toast.dismiss(ToastLoadingId);
      toast.error(`Fail to update project ${project.id}.`);
    },
  });

  const {
    handleSubmit,
    control,
    register,
    formState: {isDirty},
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: project.project_name,
      description: project.description,
      status: project.status,
      start_time: project.start_time
        ? format(project.start_time, 'yyyy-MM-dd')
        : '',
      end_time: project.end_time ? format(project.end_time, 'yyyy-MM-dd') : '',
      price: (project.price * 1_000_000).toString(),
    },
  });

  const onSubmit = handleSubmit((formData) => {
    // is Dirty -> update and map to ProjectUpdate
    if (isDirty) {
      const projectUpdate: ProjectUpdate = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        start_time: formData.start_time
          ? new Date(formData.start_time).toISOString()
          : undefined,
        end_time: formData.end_time
          ? new Date(formData.end_time).toISOString()
          : undefined,
        price: formData.price
          ? formData.price.substring(0, formData.price.length - 6)
          : undefined,
      };

      mutate(projectUpdate)
    }

    onClose();
  });

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mt-4 border-t border-gray-300 py-4">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-6">
            Name
          </label>
          <input
            type="text"
            {...register('name')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="text-sm font-medium leading-6">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"></textarea>
        </div>

        <div className="mb-4">
          <ControlledSelect<SchemaType>
            control={control}
            defaultValue={project.status}
            name="status"
            label="Status"
            data={['registering', 'progressing', 'finished'].map(v => ({
              value: v,
              displayName: _.capitalize(v)
            }))}
          />
        </div>

        <div className="sm:flex sm:space-x-4">
          <div className="mb-4 flex-1">
            <label
              htmlFor="start_time"
              className="text-sm font-medium leading-6">
              Start on
            </label>
            <input
              type="date"
              {...register('start_time')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mb-4 flex-1">
            <label
              htmlFor="end_time"
              className="text-sm font-medium leading-6">
              Finish on
            </label>
            <input
              type="date"
              {...register('end_time')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="text-sm font-medium leading-6">
            Price
          </label>
          {/*<input type='number' {...register('price')} className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6'/>*/}
          <CommaInput
            name="price"
            control={control}
          />
        </div>

        <div className="mt-4 text-end">
          <button
            type="submit"
            className={clsx(
              'rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  focus-visible:outline-secondary ',
              {
                'bg-secondary hover:bg-secondary-text ': !isPending,
                'cursor-not-allowed bg-slate-400': isPending,
              },
            )}>
            Update
          </button>
        </div>
      </form>
    </>
  );
}
