import { wretchClientWithRefresh } from '@/services/wretchClient.ts';

export type ProjectStatus = 'registering'| 'progressing'| 'finished'

interface Payment {
	id: number,
	amount: number
	created_at: string
}

export interface Project {
	id: string
	user_id: string
	username: string
	project_name: string
	description: string
	price: number,
	status: ProjectStatus,
	start_time: string,
	end_time: string,
	payment: Payment[]
}

export interface ProjectsResponse {
	projects: Project[]
}

export const getProjects = async (accessToken: string, uid: string | undefined, returnPayment: boolean = false) => {
	return await wretchClientWithRefresh
		.auth(`Bearer ${accessToken}`)
		.query({
			by_uid: uid,
			returnPayment,
		})
		.get("/project")
		.json<ProjectsResponse>()
}

export const getProjectById = async (accessToken: string, id: string) => {
	console.log("getProjectById",id)

	return await wretchClientWithRefresh
		.auth(`Bearer ${accessToken}`)
		.query({
			returnPayment: true,
		})
		.get(`/project/${id}`)
		.json<Project>()
}