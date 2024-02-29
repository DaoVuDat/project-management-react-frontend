import {parseISO} from 'date-fns';
import {clsx} from 'clsx';
import _ from 'lodash';
import {formatMoney} from '@/utils/money.ts';
import {getRouteApi, useNavigate} from '@tanstack/react-router';
import {useAuthStore} from '@/store/authStore.tsx';
import {useSuspenseQuery} from '@tanstack/react-query';
import {getProjects, Project} from '@/services/api/projects.tsx';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {Pagination} from './Pagination';

// PPOJECTS COLUMNS
const columnHelper = createColumnHelper<Project>();

const projectColumns = [
  columnHelper.accessor(
    (row) => ({
      description: row.description,
      projectName: row.project_name,
    }),
    {
      id: 'project_name',
      header: () => 'Project Name',
      cell: (info) => (
        <>
          <div className="font-medium text-gray-900">
            {info.getValue().projectName}
          </div>
          <div className="mt-1 text-gray-500">
            {info.getValue().description}
          </div>
        </>
      ),
    },
  ),
  columnHelper.accessor('username', {
    header: () => 'Owner',
    cell: (info) => <div className="text-gray-900">{info.getValue()}</div>,
  }),
  columnHelper.accessor('start_time', {
    header: () => 'Start Time',
    cell: (info) => {
      const time = info.getValue()
        ? parseISO(info.getValue()).toLocaleDateString('vi', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'Undefined';

      return <div className="text-gray-900">{time}</div>;
    },
  }),
  columnHelper.accessor('end_time', {
    header: () => 'End Time',
    cell: (info) => {
      const time = info.getValue()
        ? parseISO(info.getValue()).toLocaleDateString('vi', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'Undefined';

      return <div className="text-gray-900">{time}</div>;
    },
  }),
  columnHelper.accessor('status', {
    header: () => 'Status',
    cell: (info) => (
      <span
        className={clsx(
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset',
          info.getValue() === 'finished' &&
            ' bg-green-50 text-green-700 ring-green-600/20',
          info.getValue() === 'progressing' &&
            ' bg-yellow-50 text-yellow-700 ring-yellow-600/20',
          info.getValue() === 'registering' &&
            ' bg-red-50 text-red-700 ring-red-600/20',
        )}>
        {_.capitalize(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor('price', {
    header: () => 'Price',
    cell: (info) => formatMoney(info.getValue()),
  }),
];

// UTILS
const routeApi = getRouteApi('/_dashboard/projects/');


// COMPONENT
interface ProjectsProps {
  currentPath: string
}

export function Projects({currentPath}: ProjectsProps) {
  // Tanstack Query
  const searchParams = routeApi.useSearch();
  const accessToken = useAuthStore((s) => s.accessToken);
  const {data} = useSuspenseQuery({
    queryKey: [
      'projects',
      {
        byUid: searchParams.byUid,
        returnPayment: searchParams.returnPayment,
      },
    ],
    queryFn: () => {
      return getProjects(
        accessToken,
        searchParams.byUid,
        searchParams.returnPayment,
      );
    },
  });

  const projects = data.projects;

  // Tanstack Table
  const table = useReactTable({
    data: projects,
    columns: projectColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: searchParams.pageSize,
        pageIndex: searchParams.pageIndex! - 1,
      },
    },
  });

  const navigate = useNavigate({from: currentPath});

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, idx) => (
                      <th
                        scope="col"
                        className={clsx(
                          'text-left text-sm font-semibold text-gray-900',
                          {
                            'py-3.5 pl-4 pr-3  sm:pl-6': idx == 0,
                            'px-3 py-3.5': idx != 0,
                          },
                        )}
                        key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer hover:bg-slate-200"
                    onClick={async () =>
                      await navigate({
                        to: '/projects/$id',
                        params: {
                          id: row.original.id,
                        },
                      })
                    }>
                    {row.getVisibleCells().map((cell, idx) => (
                      <td
                        key={cell.id}
                        className={clsx('whitespace-nowrap text-sm', {
                          'py-5 pl-4 pr-3 sm:pl-6': idx === 0,
                          'px-3 py-5': idx !== 0,
                        })}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/*Pagination Component*/}
          <Pagination
            currentPath={currentPath}
            table={table}
          />
        </div>
      </div>
    </div>
  );
}
