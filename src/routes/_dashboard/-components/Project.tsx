import {getProjectById} from '@/services/api/projects.tsx';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useAuthStore} from '@/store/authStore.tsx';
import {formatMoney} from '@/utils/money.ts';
import {StatusPayment} from '@/components/status/StatusPayment.tsx';
import {formatDateWithText} from '@/utils/date.ts';
import {Link} from '@tanstack/react-router';
import {CiEdit} from 'react-icons/ci';
import {StatusProject} from '@/components/status/StatusProject.tsx';

interface ProjectProps {
  mode: 'edit' | 'view';
  id: string;
}

export function Project({mode, id}: ProjectProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const {data} = useSuspenseQuery({
    queryKey: ['project', id],
    queryFn: () => {
      return getProjectById(accessToken, id);
    },
  });
  const project = data.project;
  console.log(mode)
  // calculate accumulate price from payment history
  const totalPayment = project.payment.reduce((prev, cur) => {
    return prev + cur.amount;
  }, 0);

  return (
    <>
      <main>
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Project Detail */}
          <div className="relative -mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-3xl font-semibold leading-9 text-gray-900 max-w-60 sm:max-w-sm lg:max-w-md text-wrap">
              {project.project_name}
            </h2>
            <div className="absolute top-8 right-8 sm:top-8 xl:top-16 xl:right-16">
              <StatusProject status={project.status} />
            </div>

            <h2 className="mt-6 text-md leading-6 text-gray-700">
              <span className="text-gray-500">Owner:</span> {project.username}
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
              <div className="mt-6 sm:mt-0 sm:pl-4">
                <dt className="inline text-gray-500">Finish on:</dt>{' '}
                <dd className="inline text-gray-700">
                  <time dateTime={project.end_time}>
                    {formatDateWithText(project.end_time)}
                  </time>
                </dd>
              </div>

              <div className="md:col-span-2 mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                <dt className="font-semibold text-gray-900">Description</dt>
                <div className="mt-1">{project.description}</div>
              </div>
            </dl>

            <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
              {/*Edit button*/}
              <div>
                <Link
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
        </div>
      </main>
    </>
  );
}
