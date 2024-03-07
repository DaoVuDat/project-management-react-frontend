import { wretchClientWithRefresh } from '@/services/wretchClient.ts';
import {Payment} from './payment';

export type ProjectStatus = 'registering'| 'progressing'| 'finished'

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
	return await wretchClientWithRefresh
    .auth(`Bearer ${accessToken}`)
    .query({
      returnPayment: true,
    })
    .get(`/project/${id}`)
    .json<{project: Project}>();
}

export interface ProjectCreate {
	user_id: string
	name: string
	description: string
	price?: string | null | undefined
	status: ProjectStatus
	start_time?: string | null | undefined
	end_time?: string | null | undefined
}

export const createProject = async (accessToken: string, projectCreate: ProjectCreate) => {
	return await wretchClientWithRefresh
		.auth(`Bearer ${accessToken}`)
		.post(projectCreate, `/project`)
		.json<Project>()
}
export interface ProjectUpdate {
	name: string
	description: string
	price?: string | null | undefined
	status: ProjectStatus
	start_time?: string | null | undefined
	end_time?: string | null | undefined
}

export const updateProjectById = async (accessToken: string, projectId: string, projectUpdate: ProjectUpdate) => {
	return await wretchClientWithRefresh
		.auth(`Bearer ${accessToken}`)
		.patch(projectUpdate, `/project/${projectId}`)
		.json<Project>()
}

