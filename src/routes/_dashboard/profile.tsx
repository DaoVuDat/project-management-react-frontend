import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import {HiUserCircle} from 'react-icons/hi2';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuthStore} from '@/store/authStore.tsx';
import {
  getProfileUser,
  ProfileResponse,
  ProfileUpdate,
  updateProfileUser,
} from '@/services/api/profile.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/_dashboard/profile')({
  component: ProfileRoute,
  loader: async ({context}) => {
    // get userId in local storage from authStore
    const userId = useAuthStore.getState().userId;
    const accessToken = useAuthStore.getState().accessToken;

    // use react query to fetch data
    const queryClient = context.queryClient;

    return await queryClient.ensureQueryData({
      queryKey: ['profile', userId],
      queryFn: () => {
        return getProfileUser(accessToken, userId);
      },
    });
  },
  pendingComponent: () => {
    return <p>LOADING PENDING</p>;
  },
});

// https://github.com/colinhacks/zod/issues/387
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string(),
  about: z.string(),
  profileImage: z.nullable(
    z
      .instanceof(FileList)
      .refine((files) => files.length > 0, 'Image is required.')
      .refine(
        (files) => files[0].size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`,
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files[0].type),
        '.jpg, .jpeg, .png and .webp files are accepted.',
      ),
  ),
});

type SchemaType = z.infer<typeof schema>;

function ProfileRoute() {
  const {profile} = Route.useLoaderData();

  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient()
  const router = useRouter()

  const navigate = useNavigate({from: Route.fullPath});

  const mutation = useMutation<ProfileResponse, Error, ProfileUpdate>({
    mutationFn: (data) => {
      return updateProfileUser(profile.user_id, accessToken, data);
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["profile", profile.user_id]
      })
      router.invalidate()
    }
  });

  const {
    register,
    handleSubmit,
    formState: {errors, isDirty},
  } = useForm<SchemaType>({
    defaultValues: {
      about: profile.about,
      lastName: profile.last_name,
      profileImage: null,
      firstName: profile.first_name,
      phoneNumber: profile.phone_number,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((formData: SchemaType) => {
    // process pre-sign url for image to get image url
    console.log(formData);
    if (!isDirty) {
      return;
    }
    const imageUrl = 'https://test-image-url.com';

    const dataUpdate: ProfileUpdate = {
      about: formData.about,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phoneNumber,
      image_url: imageUrl,
    };
    mutation.mutate(dataUpdate);
  });

  const onCancel = async () => {
    await navigate({to: '/'});
  };



  return (
    <main>
      {mutation.isPending && <p>Updating profile...</p>}
      {mutation.isSuccess && <p>Updated profile</p>}
      {mutation.isError && <p>{mutation.error.message}</p>}
      <form onSubmit={onSubmit}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Personal information.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register('firstName')}
                    id="firstName"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register('lastName')}
                    id="lastName"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-3 sm:col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    {...register('about')}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                    defaultValue={''}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about yourself.
                </p>
              </div>

              <div className="col-span-3 sm:col-span-full">
                <div className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </div>
                <div className="mt-2 flex items-center gap-x-3">
                  <HiUserCircle
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <label
                    className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    htmlFor="profileImage">
                    Change
                  </label>
                  <input
                    id="profileImage"
                    type="file"
                    {...register('profileImage')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={onCancel}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
            Save
          </button>
        </div>
        {errors.profileImage && errors.profileImage.message}
      </form>
    </main>
  );
}
