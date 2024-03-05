import {wretchClientWithRefresh} from '@/services/wretchClient.ts';

export type AccountRole = 'admin' | 'client';

export type AccountStatus = 'pending' | 'activated';

export interface Account {
  user_id: string;
  username: string;
  type: AccountRole;
  status: AccountStatus;
}

export interface AccountsResponse {
  accounts: Account[];
}

export interface AccountsResponseWithProfile {
  accounts: (Account & {
    first_name: string;
    last_name: string;
  })[];
}

export const getAllAccountWithProfile = async (accessToken: string) =>
  await wretchClientWithRefresh
    .auth(`Bearer ${accessToken}`)
    .query({
      profile: true,
    })
    .get('/account')
		.json<AccountsResponseWithProfile>();

export const getAllAccount = async (accessToken: string) =>
	await wretchClientWithRefresh
		.auth(`Bearer ${accessToken}`)
		.get('/account')
		.json<AccountsResponse>();
