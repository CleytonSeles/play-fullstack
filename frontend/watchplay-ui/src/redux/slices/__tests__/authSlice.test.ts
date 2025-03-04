import authReducer, { login, logout } from '../authSlice';
import { AuthState } from '../authSlice'; // Corrigir importação
import { configureStore } from '@reduxjs/toolkit';

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do service
jest.mock('../../../services/authService', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('Auth Slice', () => {
  let initialState: AuthState;

  beforeEach(() => {
    initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
    localStorageMock.clear();
  });

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('should handle logout', () => {
    const state = authReducer(
      {
        ...initialState,
        user: { id: '1', username: 'test', email: 'test@example.com' },
        token: 'token',
        isAuthenticated: true,
      },
      logout()
    );

    expect(state).toEqual({
      ...initialState,
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('should set isLoading to true during login pending', () => {
    const state = authReducer(
      initialState,
      { type: login.pending.type }
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should set authentication data on login fulfilled', () => {
    const user = { id: '1', username: 'test', email: 'test@example.com' };
    const token = 'test-token';

    const state = authReducer(
      { ...initialState, isLoading: true },
      {
        type: login.fulfilled.type,
        payload: { user, access_token: token },
      }
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      isAuthenticated: true,
      user,
      token,
    });
  });

  it('should set error on login rejected', () => {
    const state = authReducer(
      { ...initialState, isLoading: true },
      {
        type: login.rejected.type,
        payload: 'Invalid credentials',
      }
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Invalid credentials',
    });
  });
});