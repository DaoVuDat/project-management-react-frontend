import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string;
  userId: string;
  role: 'admin' | 'client' | '';
}

interface AuthAction {
  setUser: (userId: AuthState['userId'], role: AuthState['role'], accessToken: AuthState['accessToken']) => void;
  removeUser: () => void;
}

export type AuthStore = AuthState & AuthAction;

const initialState: AuthState = {
  userId: '',
  role: '',
  accessToken: ''
}
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist((set) => ({
      ...initialState,
      setUser: (userId, role, accessToken) =>
        set(
          () => ({
            userId,
            role,
            accessToken
          }),
          false,
          'setUser',
        ),
      removeUser: () =>
        set(
          () => ({
            ...initialState
          }),
          false,
          'removeUser',
        ),
    }), {name: 'authState'}),
    {name: 'authSlice'},
  ),
);
