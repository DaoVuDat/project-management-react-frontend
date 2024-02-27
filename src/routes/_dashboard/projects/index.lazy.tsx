import {createLazyFileRoute} from '@tanstack/react-router';
import {SearchBar} from '@/routes/_dashboard/projects/-components/SearchBar.tsx';
import {Projects} from '@/routes/_dashboard/projects/-components/Projects.tsx';
import { useProjectFilterStore } from '@/store/projectsFilterStore.tsx';

export const Route = createLazyFileRoute('/_dashboard/projects/')({
  component: ProjectsRoute,
});

function ProjectsRoute() {
  const {projectFilters, removeProjectFilter} = useProjectFilterStore(s => ({
    projectFilters: s.projectFilters,
    removeProjectFilter: s.removeProjectFilter
  }));

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <SearchBar />
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-text">
            Add project
          </button>
        </div>
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

      <Projects />
    </div>
  );
}
