import {createLazyFileRoute} from '@tanstack/react-router';
import {SearchBar} from '@/routes/_dashboard/projects/-components/SearchBar.tsx';
import {Projects} from '@/routes/_dashboard/projects/-components/Projects.tsx';
import { useProjectFilterStore } from '@/store/projectsFilterStore.tsx';
import { useRouterState } from '@tanstack/react-router';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { clsx } from 'clsx';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  Project,
  ProjectStatus,
  ProjectCreate,
  createProject,
} from '@/services/api/projects.tsx';
import { toast } from 'react-hot-toast';
import { ToastLoadingId } from '@/components/toast/Toast.tsx';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore.tsx';
import { ControlledSelect } from '@/components/select/ControlledSelect.tsx';
import { CommaInput } from '@/components/inputNumberWithComma/CommaInput.tsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAllAccountWithProfile } from '@/services/api/account.ts';
import _ from 'lodash';

export const Route = createLazyFileRoute('/_dashboard/projects/')({
  component: ProjectsRoute,
});


function ProjectsRoute() {
  const [isOpenedAddProjectModal, setIsOpenedAddProjectModal] =useState<boolean>(false)
  const {projectFilters, removeProjectFilter} = useProjectFilterStore(s => ({
    projectFilters: s.projectFilters,
    removeProjectFilter: s.removeProjectFilter
  }));

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const role = useAuthStore(s => s.role)


  return (
    <div>
      <AddProjectModal open={isOpenedAddProjectModal} setOpen={setIsOpenedAddProjectModal} />
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <SearchBar />
        </div>
        {role === 'admin' && <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsOpenedAddProjectModal(true)}
            type="button"
            className="block rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-text">
            Add project
          </button>
        </div>}

      </div>

      {/* Active filters */}
      <div className="mt-4 rounded-md bg-gray-100">
        <div className="mx-auto max-w-7xl px-5 py-3 sm:flex sm:items-center ">
          <h3 className="text-sm font-medium text-gray-500">
            Filters
            <span className="sr-only">, active</span>
          </h3>

          <div
            aria-hidden="true"
            className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
          />

          <div className="mt-2 sm:ml-4 sm:mt-0">
            <div className="-m-1 min-h-[36px] flex flex-wrap items-center">
              {projectFilters.map((activeFilter) => (
                <span
                  key={activeFilter.mode}
                  className="h-9 m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                  <span>{activeFilter.label}</span>
                  <button
                    onClick={() => removeProjectFilter(activeFilter)}
                    type="button"
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500">
                    <span className="sr-only">
                      Remove filter for {activeFilter.mode}
                    </span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8">
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Projects currentPath={currentPath}/>
    </div>
  );
}


const routeApi = getRouteApi('/_dashboard/projects/');

const PROJECT_OWNER = "Select Project's Owner"

// Create Project Form Component
const schema = z.object({
  user_id: z.string().refine((val) => val !== PROJECT_OWNER),
  name: z.string().min(5),
  description: z.string().min(5),
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


interface AddProjectModalProps {
  open: boolean
  setOpen: React.Dispatch<boolean>
}

function AddProjectModal({open, setOpen}: AddProjectModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((s) => s.accessToken);
  const searchParams = routeApi.useSearch();

  const {data} = useSuspenseQuery({
    queryKey: ['accounts'],
    queryFn: () => getAllAccountWithProfile(accessToken)
  })

  const accountsWithProfile = data.accounts

  const {mutate, isPending} = useMutation<Project,Error, ProjectCreate>({
    mutationFn: (data) => {
      return createProject(accessToken, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', {
          byUid: searchParams.byUid,
          returnPayment: searchParams.returnPayment,
        }],
      });
      toast.dismiss(ToastLoadingId);
      toast.success(`Created a new project successfully.`);
      router.invalidate();
    },
    onMutate: () => {
      toast.loading(`Creating a new project...`, {
        id: ToastLoadingId,
      });
    },
    onError: () => {
      toast.dismiss(ToastLoadingId);
      toast.error(`Failed to create a new project.`);
    },
  })

  const {
    handleSubmit,
    control,
    register,
    formState: {isDirty},
    reset
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      user_id: PROJECT_OWNER,
      name: "",
      description: "",
      status: 'registering',
      start_time: '',
      end_time: '',
      price: '1000000',
    },
  });


  const onSubmit = handleSubmit((formData) => {
    console.log(formData)
    // is Dirty -> update and map to ProjectUpdate
    if (isDirty){
      const projectCreate: ProjectCreate = {
        user_id: formData.user_id, // load user_id
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

      mutate(projectCreate)
      reset()
    }

    setOpen(false);
  });

  return <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={setOpen}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0">
        <div className="fixed inset-0 bg-black/25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                <form onSubmit={onSubmit} className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                  <div className="h-0 flex-1 overflow-y-auto">
                    <div className="bg-secondary-text px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">
                          New Project
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-secondary-text text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <HiXMark className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="divide-y divide-gray-200 px-4 sm:px-6">
                        <div className="space-y-6 pb-5 pt-6">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Name
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                {...register('name')}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-text sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                  {...register('description')}
                                  rows={4}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-text sm:text-sm sm:leading-6"
                                />
                            </div>
                          </div>

                          <div className="mb-4">
                            <ControlledSelect<SchemaType>
                              control={control}
                              name="user_id"
                              label="Owner"
                              defaultValue={PROJECT_OWNER}
                              data={accountsWithProfile.map(v => ({
                                value: v.user_id,
                                displayName: `${_.capitalize(v.first_name)} ${_.startCase(v.last_name)} - ${v.username}`
                              }))}
                            />
                          </div>

                          <div className="mb-4">
                            <ControlledSelect<SchemaType>
                              defaultValue={'registering'}
                              control={control}
                              name="status"
                              label="Status"
                              data={['registering', 'progressing', 'finished'].map(v => ({
                              value: v,
                              displayName: _.capitalize(v)
                            }))}
                            />
                          </div>


                            <div className="mb-4 flex-1">
                              <label
                                htmlFor="start_time"
                                className="text-sm font-medium leading-6">
                                Start on
                              </label>
                              <input
                                type="date"
                                {...register('start_time')}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
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
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                              />
                            </div>


                          <div className="mb-4">
                            <label
                              htmlFor="price"
                              className="text-sm font-medium leading-6 mb-2">
                              Price
                            </label>
                            {/*<input type='number' {...register('price')} className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6'/>*/}
                            <CommaInput
                              className="mt-2"
                              name="price"
                              control={control}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 justify-end px-4 py-4">
                    <button
                      type="button"
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={clsx(
                        'ml-4 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  focus-visible:outline-secondary ',
                        {
                          'bg-secondary hover:bg-secondary-text ': !isPending,
                          'cursor-not-allowed bg-slate-400': isPending,
                        },
                      )}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
}