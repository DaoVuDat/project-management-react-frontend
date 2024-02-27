import { create } from 'zustand';

type Mode = 'project_name' | 'username' | 'status' | 'price';

interface Filter {
	label: string;
	mode: Mode;
}

export const filterList: Filter[] = [
	{label: 'Project Name', mode: 'project_name'},
	{label: 'Owner', mode: 'username'},
	{label: 'Status', mode: 'status'},
	{label: 'Price', mode: 'price'},
];

interface ProjectFilterState {
	projectFilters: Filter[]
}


interface ProjectFilterAction {
	addProjectFilter: (filter: Filter) => void,
	removeProjectFilter: (filter: Filter) => void,
}

export type ProjectFilterStore = ProjectFilterState & ProjectFilterAction 

const initialState: ProjectFilterState = {
	projectFilters: []
}

export const useProjectFilterStore = create<ProjectFilterStore>()((set) => ({
	...initialState,
	addProjectFilter: (filter) => {
		set((state) => ({
      projectFilters: [...state.projectFilters, filter]
    }));
	},
	removeProjectFilter: (filter) => {
		set((state) => ({
			projectFilters: state.projectFilters.filter(filterState => filterState.mode !== filter.mode)
		}))
	}
}));