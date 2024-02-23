import { wretchClientWithRefresh } from '@/services/authClient.ts';

export interface ProfileResponse {
	profile: {
		user_id: string,
		first_name: string,
		last_name: string,
		image_url: string,
		about: string,
		phone_number: string
	}
}


export interface ProfileUpdate {
	image_url: string,
	about: string,
	phone_number: string,
	first_name: string,
	last_name: string
}

export const getProfileUser = async (accessToken :string, userId : string) => {
	return await wretchClientWithRefresh
		.auth(`Bearer ${accessToken}`)
		.get(`/profile/${userId}`)
		.json<ProfileResponse>();
};

export const updateProfileUser = async (userId: string, accessToken: string, profileUpdate :ProfileUpdate) => {
	return await wretchClientWithRefresh
		.auth(`Bearer ${accessToken}`)
		.patch(profileUpdate, `/profile/${userId}`)
		.json<ProfileResponse>();
};