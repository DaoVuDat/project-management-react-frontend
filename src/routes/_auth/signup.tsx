import {createFileRoute, Link, useNavigate} from '@tanstack/react-router';
import * as Form from '@radix-ui/react-form';
import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { SignUpUser, signUpUser } from '@/services/api/auth.ts';
import {useAuthStore} from '@/store/authStore.tsx';

export const Route = createFileRoute('/_auth/signup')({
  component: SignUpRoute,
  validateSearch: (
    search: Record<string, unknown>,
  ): {redirect: string | undefined} => {
    return {
      redirect: (search.redirect as string) || undefined,
    };
  },
});

const schema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    username: z.string().min(8).max(20),
    password: z.string(),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({
        message: 'You must accept Terms and Conditions',
      }),
    }),
  })
  .refine(({password, confirmPassword}) => confirmPassword === password, {
    message: 'The password and confirm password must match',
    path: ['password'],
  });

type SignUpSchemaType = z.infer<typeof schema>;

function SignUpRoute () {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(schema),
  });

  const setUser = useAuthStore((store) => store.setUser);
  const navigate = useNavigate({from: Route.fullPath});

  const {redirect} = Route.useSearch();

  const onSubmit = handleSubmit(async (inputData: SignUpSchemaType) => {
    try {
      const signUpDate: SignUpUser = {
        first_name: inputData.firstName,
        last_name: inputData.lastName,
        password: inputData.password,
        username: inputData.username,
        confirmed_password: inputData.confirmPassword
      }
      const data = await signUpUser(signUpDate);
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
          Create an account
        </h1>
        <Form.Root
          onSubmit={onSubmit}
          className="space-y-4 md:space-y-8">
          <div className="justify-between space-y-4 md:flex md:space-x-4 md:space-y-0">
            <Controller
              name="firstName"
              control={control}
              render={({field}) => (
                <Form.Field
                  {...field}
                  className="w-full">
                  <Form.Label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your First Name
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      placeholder="First Name"
                      required
                    />
                  </Form.Control>
                  {errors.firstName && (
                    <p className="pt-2 text-red-700 dark:text-red-400 sm:text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </Form.Field>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({field}) => (
                <Form.Field
                  {...field}
                  className="w-full">
                  <Form.Label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your Last Name
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      placeholder="Last Name"
                      required
                    />
                  </Form.Control>
                  {errors.lastName && (
                    <p className="pt-2 text-red-700 dark:text-red-400 sm:text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </Form.Field>
              )}
            />
          </div>

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
          <Controller
            control={control}
            name="confirmPassword"
            render={({field}) => (
              <Form.Field {...field}>
                <Form.Label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Confirm Password
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
          <Controller
            name="terms"
            control={control}
            render={({field}) => (
              <Form.Field {...field}>
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-light text-gray-500 dark:text-gray-300">
                      I accept the{' '}
                      <Link
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        target="_blank"
                        to="https://www.google.com">
                        Terms and Conditions
                      </Link>
                    </label>
                    {errors.terms && (
                      <p className="pt-2 text-red-700 dark:text-red-400 sm:text-sm">
                        {errors.terms.message}
                      </p>
                    )}
                  </div>
                </div>
              </Form.Field>
            )}
          />
          <Form.Submit asChild>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-800">
              Create an account
            </button>
          </Form.Submit>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              search={{
                redirect: redirect || undefined,
              }}
              className="font-medium text-primary-600 hover:underline dark:text-primary-500">
              Login here
            </Link>
          </p>
        </Form.Root>
      </div>
    </>
  );
};

