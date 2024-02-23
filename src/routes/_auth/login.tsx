import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as Form from '@radix-ui/react-form';
import {loginUser} from '@/services/api/auth.ts';
import { useAuthStore } from '@/store/authStore.tsx';

export const Route = createFileRoute('/_auth/login')({
  component: LoginRoute,
  validateSearch: (search: Record<string, unknown>): {redirect: string | undefined} => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
});

const schema = z.object({
  username: z.string().min(8).max(20),
  password: z.string(),
});

type SchemeType = z.infer<typeof schema>;

function LoginRoute () {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SchemeType>({
    resolver: zodResolver(schema),
  });

  const setUser = useAuthStore(s => s.setUser);

  const {redirect} = Route.useSearch()

  const navigate = useNavigate({from: Route.fullPath});


  const onSubmit = handleSubmit(async (inputData: SchemeType) => {
    try {
      const data = await loginUser(inputData);
      setUser(data.user_id, data.role, data.access_token);
      await navigate({to: redirect || "/"});
    } catch (err) {
      console.log('err', err);
    }
  });

  return (
    <>
      <div className="w-full max-w-md space-y-4 p-4">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
          Sign in to your account
        </h1>
        <Form.Root
          onSubmit={onSubmit}
          className="space-y-4 md:space-y-8">
          <Controller
            name="username"
            control={control}
            render={({field}) => (
              <Form.Field {...field}>
                <Form.Label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Your username
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    placeholder="Username"
                    required
                  />
                </Form.Control>
                {errors.username && (
                  <p className="pt-2 text-red-700 dark:text-red-400 sm:text-sm">
                    {errors.username.message}
                  </p>
                )}
              </Form.Field>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({field}) => (
              <Form.Field {...field}>
                <Form.Label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </Form.Label>
                <Form.FormControl asChild>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </Form.FormControl>
                {errors.password && (
                  <p className="pt-2 text-red-700 dark:text-red-400 sm:text-sm">
                    {errors.password.message}
                  </p>
                )}
              </Form.Field>
            )}
          />
          <Form.Submit asChild>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-800">
              Log in to your account
            </button>
          </Form.Submit>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{' '}
            <Link
              to="/signup"
              search={{
                redirect: redirect || undefined
              }}
              className="font-medium text-primary-600 hover:underline dark:text-primary-500">
              Sign up
            </Link>
          </p>
        </Form.Root>
      </div>
    </>
  );
};




