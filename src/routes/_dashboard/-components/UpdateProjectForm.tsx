import { z } from 'zod';
import { Project as ProjectType, ProjectStatus, ProjectUpdate, updateProjectById } from '@/services/api/projects.ts';
import { useAuthStore } from '@/store/authStore.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';
import { ToastLoadingId } from '@/components/toast/Toast.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ControlledSelect } from '@/components/select/ControlledSelect.tsx';
import _ from 'lodash';
import { CommaInput } from '@/components/inputNumberWithComma/CommaInput.tsx';
import { clsx } from 'clsx';

const schema = z.object({
	name: z.string().min(10),
	description: z.string().min(10),
	status: z.custom<ProjectStatus>(),
	start_time: z.string().nullish(),
	end_time: z.string().nullish(),
	price: z
		.string()
		.refine(
			(val) => (val ? Number(val) >= 1_000_000 : null),
			'Price must be large than 1,000,000',
		)
		.nullish(),
});

type SchemaType = z.infer<typeof schema>;

interface UpdateProjectFormProps {
	onClose: () => void;
	project: ProjectType;
}

export function UpdateProjectForm({onClose, project}: UpdateProjectFormProps) {
	const accessToken = useAuthStore((s) => s.accessToken);
	const queryClient = useQueryClient();
	const router = useRouter();

	const {mutate, isPending} = useMutation<ProjectType, Error, ProjectUpdate>({
		mutationFn: (data) => {
			return updateProjectById(accessToken, project.id, data);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['project', project.id],
			});
			toast.dismiss(ToastLoadingId);
			toast.success(`Update project ${project.id} successfully.`);
			router.invalidate();
		},
		onMutate: () => {
			toast.loading(`Updating project ${project.id}...`, {
				id: ToastLoadingId,
			});
		},
		onError: () => {
			toast.dismiss(ToastLoadingId);
			toast.error(`Fail to update project ${project.id}.`);
		},
	});

	const {
		handleSubmit,
		control,
		register,
		formState: {isDirty},
	} = useForm<SchemaType>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: project.project_name,
			description: project.description,
			status: project.status,
			start_time: project.start_time
				? format(project.start_time, 'yyyy-MM-dd')
				: '',
			end_time: project.end_time ? format(project.end_time, 'yyyy-MM-dd') : '',
			price: (project.price * 1_000_000).toString(),
		},
	});

	const onSubmit = handleSubmit((formData) => {
		// is Dirty -> update and map to ProjectUpdate
		if (isDirty) {
			const projectUpdate: ProjectUpdate = {
				name: formData.name,
				description: formData.description,
				status: formData.status,
				start_time: formData.start_time
					? new Date(formData.start_time).toISOString()
					: undefined,
				end_time: formData.end_time
					? new Date(formData.end_time).toISOString()
					: undefined,
				price: formData.price
					? formData.price.substring(0, formData.price.length - 6)
					: undefined,
			};

			mutate(projectUpdate)
		}

		onClose();
	});

	return (
		<>
			<form
				onSubmit={onSubmit}
				className="mt-4 border-t border-gray-300 py-4">
				<div className="mb-4">
					<label
						htmlFor="name"
						className="text-sm font-medium leading-6">
						Name
					</label>
					<input
						type="text"
						{...register('name')}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="description"
						className="text-sm font-medium leading-6">
						Description
					</label>
					<textarea
						{...register('description')}
						rows={4}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"></textarea>
				</div>

				<div className="mb-4">
					<ControlledSelect<SchemaType>
						control={control}
						defaultValue={project.status}
						name="status"
						label="Status"
						data={['registering', 'progressing', 'finished'].map(v => ({
							value: v,
							displayName: _.capitalize(v)
						}))}
					/>
				</div>

				<div className="sm:flex sm:space-x-4">
					<div className="mb-4 flex-1">
						<label
							htmlFor="start_time"
							className="text-sm font-medium leading-6">
							Start on
						</label>
						<input
							type="date"
							{...register('start_time')}
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
						/>
					</div>
					<div className="mb-4 flex-1">
						<label
							htmlFor="end_time"
							className="text-sm font-medium leading-6">
							Finish on
						</label>
						<input
							type="date"
							{...register('end_time')}
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div className="mb-4">
					<label
						htmlFor="price"
						className="text-sm font-medium leading-6">
						Price
					</label>
					{/*<input type='number' {...register('price')} className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6'/>*/}
					<CommaInput
						name="price"
						control={control}
					/>
				</div>

				<div className="mt-4 text-end">
					<button
						type="submit"
						className={clsx(
							'rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  focus-visible:outline-secondary ',
							{
								'bg-secondary hover:bg-secondary-text ': !isPending,
								'cursor-not-allowed bg-slate-400': isPending,
							},
						)}>
						Update
					</button>
				</div>
			</form>
		</>
	);
}
