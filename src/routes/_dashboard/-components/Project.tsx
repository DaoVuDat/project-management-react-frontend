
interface ProjectProps {
	mode: 'edit' | 'view'
}

export function Project({mode}: ProjectProps) {


	return <div>Project - {mode}</div>
}