import {getProjectById} from '@/services/api/projects.ts';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useAuthStore} from '@/store/authStore.tsx';
import {formatMoney} from '@/utils/money.ts';
import {StatusPayment} from '@/components/status/StatusPayment.tsx';
import {formatDateWithText} from '@/utils/date.ts';
import {Link, useNavigate} from '@tanstack/react-router';
import {CiEdit} from 'react-icons/ci';
import {StatusProject} from '@/components/status/StatusProject.tsx';
import {OverlayDialog} from '@/components/dialog/OverlayDialog.tsx';
import {useEffect, useState} from 'react';
import {UpdateProjectForm} from '@/routes/_dashboard/-components/UpdateProjectForm.tsx';
import { AddPaymentForm } from '@/routes/_dashboard/-components/AddPaymentForm.tsx';

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
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-1 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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
          {role === 'admin' && <AddPaymentForm projectId={project.id} userId={project.user_id}/>}
        </div>
      </main>
    </>
  );
}
