import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'INIT_COMPLETE'; user: User | null }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT_COMPLETE':
      return {
        ...state,
        user: action.user,
        isAuthenticated: action.user !== null,
        isLoading: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true })
      .then(res => {
        dispatch({ type: 'INIT_COMPLETE', user: res.data });
      })
      .catch(() => {
        dispatch({ type: 'INIT_COMPLETE', user: null });
      });
  }, []);

  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_FAILURE' });
    await axios.post('/api/auth/login', { username, password }, { withCredentials: true });
    const userRes = await axios.get('/api/auth/me', { withCredentials: true });
    dispatch({ type: 'LOGIN_SUCCESS', user: userRes.data });
  };

  const register = async (username: string, email: string, password: string) => {
    dispatch({ type: 'LOGIN_FAILURE' });
    await axios.post('/api/auth/register', { username, email, password }, { withCredentials: true });
    const userRes = await axios.get('/api/auth/me', { withCredentials: true });
    dispatch({ type: 'LOGIN_SUCCESS', user: userRes.data });
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

