import {createFileRoute, Outlet, redirect} from '@tanstack/react-router';
import LogoForLight from '@/assets/images/logo-trackpro4-orange.svg';
import LogoForDark from '@/assets/images/logo-trackpro4-orange-dark.svg';
import {usePrefersColorScheme} from '@/hooks/usePrefersColorScheme.ts';
import {useAuthStore} from '@/store/authStore.tsx';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: ({location}) => {
    const authStore = useAuthStore.getState();
    // console.log('userId', authStore);
    console.log(location.href);
    if (authStore.accessToken.length > 1) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function AuthLayout() {
  const mode = usePrefersColorScheme();

  return (
    <section className="flex">
      <div className="hidden min-h-screen flex-col items-center justify-center bg-gray-800 dark:bg-white lg:flex lg:w-2/5">
        <div className="h-auto w-80">
          <img
            className="h-full w-full"
            src={mode === 'dark' ? LogoForLight : LogoForDark}
            alt="logo"
          />
        </div>
        {/*<p>Detail</p>*/}
      </div>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-gray-800 lg:w-3/5">
        <div className="my-10 h-auto w-56 lg:hidden ">
          <img
            className="h-full w-full"
            src={mode === 'dark' ? LogoForDark : LogoForLight}
            alt="logo"
          />
        </div>
        <Outlet />
      </div>
    </section>
  );
}
