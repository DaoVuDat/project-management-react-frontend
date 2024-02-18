import {createLazyFileRoute, Link} from '@tanstack/react-router';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as Form from '@radix-ui/react-form';

const schema = z.object({
  username: z.string().min(8).max(20),
  password: z.string(),
  // .regex(
  //   new RegExp(
  //     '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$',
  //   ),
  // ),
});

type SchemeType = z.infer<typeof schema>;

const LoginRoute = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SchemeType>({
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit((data: SchemeType) => {
    console.log(data);
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
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    placeholder="Username"
                    required
                  />
                </Form.Control>
                {errors.username && (
                  <p className="pt-2 text-red-400 sm:text-sm">
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
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </Form.FormControl>
                {errors.password && (
                  <p className="pt-2 text-red-400 sm:text-sm">
                    {errors.password.message}
                  </p>
                )}
              </Form.Field>
            )}
          />
          <Form.Submit asChild>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
              Create an account
            </button>
          </Form.Submit>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{' '}
            <Link
              to="/signup"
              className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </Form.Root>
      </div>
    </>
  );
};

export const Route = createLazyFileRoute('/_auth/login')({
  component: LoginRoute,
});
