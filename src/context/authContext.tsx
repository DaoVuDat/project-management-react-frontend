import {
  useReducer,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
} from 'react';

export interface AuthContext {
  isAuthenticated: boolean;
  authState: AuthState;
  dispatch: Dispatch<AuthAction>;
}

interface AuthState {
  userId?: string;
  role?: string;
}

enum AuthActionType {
  SET_USER,
  REMOVE_USER,
}

interface AuthAction {
  type: AuthActionType;
  payload?: AuthState;
}

const AuthContext = createContext<AuthContext | null>(null);

const authReducer = (state: AuthState = {}, action: AuthAction) => {
  const {type, payload} = action;
  switch (type) {
    case AuthActionType.SET_USER:
      return {
        role: payload?.role,
        userId: payload?.userId,
      };
    case AuthActionType.REMOVE_USER:
      return {
        role: undefined,
        userId: undefined,
      };
    default:
      return state;
  }
};

export function AuthProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(authReducer, {
    userId: undefined,
    role: undefined,
  });
  const isAuthenticated = !!state.userId;
  return (
    <AuthContext.Provider value={{isAuthenticated, authState: state, dispatch}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
