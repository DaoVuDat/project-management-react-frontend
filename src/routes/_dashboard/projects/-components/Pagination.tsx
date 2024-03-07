import {getRouteApi, Link} from '@tanstack/react-router';
import {HiArrowLongLeft, HiArrowLongRight} from 'react-icons/hi2';
import {Table} from '@tanstack/react-table';
import {Project} from '@/services/api/projects.ts';
import {clsx} from 'clsx';
import _ from 'lodash';
import {ReactElement} from 'react';

// UTILS
const routeApi = getRouteApi('/_dashboard/projects/');

interface PaginationProps {
  currentPath: string;
  table: Table<Project>;
}

export function Pagination({currentPath, table}: PaginationProps) {
  const searchParams = routeApi.useSearch();
  // const navigate = useNavigate({from: currentPath});

  const pageCount = table.getPageCount();
  const {
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageIndex,
  } = table;

  // NOTE: onClick on Link Component for temporary (for client pagination, and we use Link for server pagination)
  return (
    <nav className="mt-16 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <Link
          disabled={!getCanPreviousPage()}
          to={currentPath}
          search={{
            ...searchParams,
            pageIndex: searchParams.pageIndex! - 1,
          }}
          onClick={() => getCanPreviousPage() && previousPage()}
          className={clsx(
            'group inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500',
            {
              'hover:border-secondary-text hover:text-secondary-text':
                getCanPreviousPage(),
              'cursor-not-allowed': !getCanPreviousPage(),
            },
          )}>
          <HiArrowLongLeft
            className={clsx('mr-3 h-5 w-5 text-gray-400', {
              'group-hover:text-secondary-text': getCanPreviousPage(),
            })}
            aria-hidden="true"
          />
          Previous
        </Link>
      </div>
      <div className="hidden md:-mt-px md:flex">
        <Link
          key="to-first"
          to={currentPath}
          search={{
            ...searchParams,
            pageIndex: 1,
          }}
          onClick={() => setPageIndex(0)}
          className={clsx(
            'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium',
            {
              'border-secondary-text text-secondary-text':
                searchParams.pageIndex === 1,
              'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700':
                searchParams.pageIndex !== 1,
            },
          )}>
          1
        </Link>

        {SetupMiddlePagination(
          pageCount,
          searchParams.pageIndex!,
          (e,idx) => (
            <Link
              to={currentPath}
              search={{
                ...searchParams,
                pageIndex: e,
              }}
              key={idx}
              onClick={() => setPageIndex(e - 1)}
              className={clsx(
                'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium',
                {
                  'border-secondary-text text-secondary-text':
                    searchParams.pageIndex === e,
                  'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700':
                    searchParams.pageIndex !== e,
                },
              )}>
              {e}
            </Link>
          ),
          (idx) => (
            <span key={idx} className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
              ...
            </span>
          ),
        )}

        {pageCount > 1 && <Link
          key="to-end"
          to={currentPath}
          search={{
            ...searchParams,
            pageIndex: pageCount,
          }}
          onClick={() => setPageIndex(pageCount - 1)}
          className={clsx(
            'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium',
            {
              'border-secondary-text text-secondary-text':
                searchParams.pageIndex === pageCount,
              'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700':
                searchParams.pageIndex !== pageCount,
            },
          )}>
          {pageCount}
        </Link>}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Link
          disabled={!getCanNextPage()}
          to={currentPath}
          search={{
            ...searchParams,
            pageIndex: searchParams.pageIndex! + 1,
          }}
          onClick={() => getCanNextPage() && nextPage()}
          className={clsx(
            'group inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500',
            {
              'hover:border-secondary-text hover:text-secondary-text':
                getCanNextPage(),
              'cursor-not-allowed': !getCanNextPage(),
            },
          )}>
          Next
          <HiArrowLongRight
            className={clsx('ml-3 h-5 w-5 text-gray-400', {
              'group-hover:text-secondary-text': getCanNextPage(),
            })}
            aria-hidden="true"
          />
        </Link>
      </div>
    </nav>
  );
}

function SetupMiddlePagination(
  pageCount: number,
  currentPage: number,
  element: (e: number, idx: number) => ReactElement,
  dotElement: (idx: number) => ReactElement,
) {
  if (pageCount < 3) return;
  else if (pageCount < 6) return _.range(2, pageCount).map((e, idx) => element(e, idx));
  else {
    let arrPagination = _.range(currentPage - 1, currentPage + 2).map((e, idx) => element(e, idx));
    if (currentPage < 3) {
      arrPagination = _.range(2, 5).map((e, idx) => element(e, idx));
    }
    if (currentPage > pageCount - 2) {
      arrPagination = _.range(pageCount - 3, pageCount).map((e, idx) => element(e, idx));
    }

    if (currentPage - 1 > 2) {
      arrPagination = [dotElement(Math.random()), ...arrPagination];
    }
    if (currentPage + 1 < pageCount - 1) {
      arrPagination = [...arrPagination, dotElement(Math.random())];
    }
    return arrPagination;
  }
}
