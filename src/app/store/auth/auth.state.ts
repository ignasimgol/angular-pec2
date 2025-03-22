export interface AuthState {
    userId: string | null;
    accessToken: string | null;
    isAuthenticated: boolean;
  }
  
  export const initialAuthState: AuthState = {
    userId: null,
    accessToken: null,
    isAuthenticated: false,
  };