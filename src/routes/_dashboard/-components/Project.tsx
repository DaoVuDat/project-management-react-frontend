import { getProjectById } from '@/services/api/projects.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore.tsx';

interface ProjectProps {
	mode: 'edit' | 'view',
	id: string
}

export function Project({mode, id}: ProjectProps) {
	const accessToken = useAuthStore((s) => s.accessToken);
	const {data} = useSuspenseQuery({
		queryKey: ['project', id],
		queryFn: () => {
			return getProjectById(accessToken, id);
		},
	});

	console.log(data)

	return <div>Project - {mode} - {id}</div>
}