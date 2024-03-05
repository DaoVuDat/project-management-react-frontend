import {wretchClient} from '@/services/wretchClient.ts';
import { AccountRole } from '@/services/api/account.ts';

export interface AuthResponse {
  access_token: string;
  user_id: string;
  role: AccountRole | '';
}

export interface SignUpUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export const signUpUser = async (user: SignUpUser) => {
  return await wretchClient.url('/signup').post(user).json<AuthResponse>();
};

export const loginUser = async (user: LoginUser) => {
  return await wretchClient.post(user, '/login').json<AuthResponse>();
};
