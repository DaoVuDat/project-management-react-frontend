import {HiOutlineSearch, HiChevronDown} from 'react-icons/hi';
import { Popover, Transition } from '@headlessui/react';
import { useProjectFilterStore, filterList } from '@/store/projectsFilterStore.tsx';
import { Fragment } from 'react';

export function SearchBar() {
  const {projectFilters, removeProjectFilter, addProjectFilter} = useProjectFilterStore(s => ({
    projectFilters: s.projectFilters,
    removeProjectFilter: s.removeProjectFilter,
    addProjectFilter: s.addProjectFilter
  }));

  return (
    <div className="flex text-base font-semibold leading-6">
      <div className="w-full rounded-l-md border border-r-0 border-gray-400 px-1 py-0.5 has-[:focus]:border-secondary sm:w-64">
        <input
          placeholder="Search"
          type="text"
          className="form-input w-full border-0 text-sm font-normal outline-none ring-0 focus:outline-0 focus:ring-0"
        />
      </div>
      <button className="flex w-20 items-center justify-center rounded-r-md border border-gray-400 focus:border focus:border-secondary sm:w-12">
        <HiOutlineSearch />
      </button>
      <div className="ml-8 flex items-center justify-center">
        <div className="flow-root">
          <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">

              <Popover className="relative inline-block px-4 text-left">
                <Popover.Button className="group inline-flex focus:outline-none justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span>Filters</span>
                  {/*{sectionIdx === 0 ? (*/}
                  {/*  <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">*/}
                  {/*          1*/}
                  {/*        </span>*/}
                  {/*) : null}*/}
                  <HiChevronDown
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <form className="space-y-4">
                      {filterList.map((filterData) => (
                        <div key={filterData.mode} className="flex items-center">
                          <input
                            id={`filter-${filterData.mode}`}
                            defaultValue={filterData.mode}
                            type="checkbox"
                            defaultChecked={!!projectFilters.find(projectFilter => projectFilter.mode === filterData.mode)}
                            onChange={(e) => {
                              console.log(e.target.checked)
                              if(!e.target.checked) {
                                removeProjectFilter(filterData)
                              } else {
                                addProjectFilter(filterData)
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-secondary-text focus:ring-secondary"
                          />
                          <label
                            htmlFor={`filter-${filterData.mode}`}
                            className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            {filterData.label}
                          </label>
                        </div>
                      ))}
                    </form>
                  </Popover.Panel>
                </Transition>
              </Popover>
          </Popover.Group>
        </div>
      </div>
    </div>
  );
}
