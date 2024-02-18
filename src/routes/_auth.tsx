import {createFileRoute, Outlet} from '@tanstack/react-router';
import Logo from '@/assets/images/logo-trackpro4-orange.svg';

const AuthLayout = () => {
  return (
    <section className="flex">
      <div className="hidden h-screen flex-col items-center justify-center bg-slate-200 lg:flex lg:w-2/5">
        <div className="h-auto w-80">
          <img
            className="h-full w-full"
            src={Logo}
            alt="logo"
          />
        </div>
        {/*<p>Detail</p>*/}
      </div>
      <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-gray-800 lg:w-3/5">
        <Outlet />
      </div>
    </section>
  );
};

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
