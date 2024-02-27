import { createLazyFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/api/projects.tsx';
import { useAuthStore } from '@/store/authStore.tsx';
import {  parseISO } from 'date-fns';
import _ from 'lodash';
import { clsx } from 'clsx';
import { formatMoney } from '@/utils/money.ts';

export const Route = createLazyFileRoute('/_dashboard/projects/')({
  component: ProjectsRoute,
});

const routeApi = getRouteApi('/_dashboard/projects/');


function ProjectsRoute() {
  const searchParams = routeApi.useSearch()
  const accessToken = useAuthStore(s => s.accessToken)
  const {data} = useSuspenseQuery({
    queryKey: ["projects", {
      byUid: searchParams.byUid,
      returnPayment: searchParams.returnPayment
    }],
    queryFn: () => {
      return getProjects(accessToken,searchParams.byUid, searchParams.returnPayment)
    }
  })

  const projects = data.projects

  return <div>
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 text-gray-900">Search Bar here</h1>
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          className="block rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-text"
        >
          Add project
        </button>
      </div>
    </div>
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Project Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Owner
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Start Time
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                End Time
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
            {projects.map((project) => {
              const startTime = parseISO(project.start_time).toLocaleDateString("vi", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })

              const endTime = project.end_time ? parseISO(project.end_time).toLocaleDateString("vi", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : "No set"
              return (<tr key={project.id}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-6">
                  <div>
                    <div className="font-medium text-gray-900">{project.project_name}</div>
                    <div className="mt-1 text-gray-500">{project.description}</div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div className="text-gray-900">{project.username}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div className="text-gray-900">{startTime}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div className="text-gray-900">{endTime}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span className={clsx(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset",
                        project.status === "finished" && " bg-green-50 text-green-700 ring-green-600/20",
                        project.status === "progressing" && " bg-yellow-50 text-yellow-700 ring-yellow-600/20",
                        project.status === "registering" && " bg-red-50 text-red-700 ring-red-600/20",
                      )}>
                        {_.capitalize(project.status)}
                      </span>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{`${formatMoney(project.price)}`}</td>
                <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link to="/projects/$id" params={{
                    id: project.id
                  }} className="text-secondary hover:text-secondary-text">
                    Edit<span className="sr-only">, {project.project_name}</span>
                  </Link>
                </td>
              </tr>)
            })}
            </tbody>
          </table>
            </div>
        </div>
      </div>
    </div>
  </div>;
}
