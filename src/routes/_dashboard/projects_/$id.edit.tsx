import { createFileRoute } from '@tanstack/react-router';
import { Project } from '@/routes/_dashboard/-components/Project.tsx';

export const Route = createFileRoute("/_dashboard/projects/$id/edit")({
	component: () => {
		return <Project mode='edit' />
	}
})