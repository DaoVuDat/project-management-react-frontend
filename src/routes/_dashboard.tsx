import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import {HiBars3, HiXMark} from 'react-icons/hi2';
import {Disclosure, Menu, Transition} from '@headlessui/react';
import Logo from '@/assets/images/logo-trackpro4-orange.svg';
import {clsx} from 'clsx';
import {Fragment} from 'react';
import {useAuthStore} from '@/store/authStore.tsx';

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
  beforeLoad: ({location}) => {
    const authStore = useAuthStore.getState();

    if (authStore.accessToken.length < 1) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
});

function DashboardLayout () {
  const removeUser = useAuthStore((store) => store.removeUser);
  const navigate = useNavigate({from: Route.fullPath});

  const logout = async () => {
    removeUser();
    await navigate({to: '/login'});
  };

  return (
    <>
      <Disclosure
        as="nav"
        className="bg-white shadow">
        {({open}) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="h-10 w-auto"
                      src={Logo}
                      alt="Track Pro"
                    />
                  </div>
                  <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                    <Link
                      to="/"
                      activeProps={{
                        className: clsx('border-secondary text-gray-900'),
                      }}
                      inactiveProps={{
                        className: clsx(
                          'border-transparent hover:border-gray-300 hover:text-gray-700',
                        ),
                      }}
                      className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500">
                      Dashboard
                    </Link>
                    <Link
                      to="/projects"
                      activeProps={{
                        className: clsx('border-secondary text-gray-900'),
                      }}
                      inactiveProps={{
                        className: clsx(
                          'border-transparent hover:border-gray-300 hover:text-gray-700',
                        ),
                      }}
                      className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 ">
                      Projects
                    </Link>
                    <Link
                      to="/projects/$id"
                      params={{id: '123'}}
                      activeProps={{
                        className: clsx('border-secondary text-gray-900'),
                      }}
                      inactiveProps={{
                        className: clsx(
                          'border-transparent hover:border-gray-300 hover:text-gray-700',
                        ),
                      }}
                      className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 ">
                      Project 123
                    </Link>
                    <Link
                      to="/profile"
                      activeProps={{
                        className: clsx('border-secondary text-gray-900'),
                      }}
                      inactiveProps={{
                        className: clsx(
                          'border-transparent hover:border-gray-300 hover:text-gray-700',
                        ),
                      }}
                      className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 ">
                      Profile
                    </Link>
                  </div>
                </div>
                <div className="flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <HiXMark
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <HiBars3
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:ml-4 lg:flex lg:items-center">
                  {/*<button*/}
                  {/*  type="button"*/}
                  {/*  className="focus:ring-secondary flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2">*/}
                  {/*  <span className="sr-only">View notifications</span>*/}
                  {/*  <HiOutlineBell*/}
                  {/*    className="h-6 w-6"*/}
                  {/*    aria-hidden="true"*/}
                  {/*  />*/}
                  {/*</button>*/}

                  {/* Profile dropdown */}
                  <Menu
                    as="div"
                    className="relative ml-4 flex-shrink-0">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-2 text-base font-medium text-gray-800">
                          Tim Cook
                          <p className="text-sm font-medium text-gray-500">
                            tom@example.com
                          </p>
                        </div>

                        <hr />
                        <Menu.Item>
                          {({active}) => (
                            <Link
                              to="/settings"
                              className={clsx(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700',
                              )}>
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <button
                              onClick={logout}
                              className={clsx(
                                active ? 'bg-gray-100' : '',
                                'block w-full px-4 py-2 text-start text-sm text-gray-700',
                              )}>
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            {/*MOBILE Panel*/}
            <Disclosure.Panel className="lg:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
                <Disclosure.Button
                  as={Link}
                  to="/"
                  activeProps={{
                    className:
                      'border-secondary bg-secondary-light text-secondary-text',
                  }}
                  inactiveProps={{
                    className:
                      'hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                  }}
                  className="block border-l-4  py-2 pl-3 pr-4 text-base font-medium ">
                  Dashboard
                </Disclosure.Button>

                <Disclosure.Button
                  as={Link}
                  to="projects"
                  activeProps={{
                    className:
                      'border-secondary bg-secondary-light text-secondary-text',
                  }}
                  inactiveProps={{
                    className:
                      'hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 border-transparent',
                  }}
                  className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium text-gray-600 ">
                  Projects
                </Disclosure.Button>
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      Tom Cook
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      tom@example.com
                    </div>
                  </div>
                  {/*<button*/}
                  {/*  type="button"*/}
                  {/*  className="focus:ring-secondary ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2">*/}
                  {/*  <span className="sr-only">View notifications</span>*/}
                  {/*  <HiOutlineBell*/}
                  {/*    className="h-6 w-6"*/}
                  {/*    aria-hidden="true"*/}
                  {/*  />*/}
                  {/*</button>*/}
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to={'/profile'}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                    Your Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    href={'/settings'}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                    Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    onClick={logout}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
};


