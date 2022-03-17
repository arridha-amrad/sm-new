export interface RegisterDTO {
  email: string;
  username: string;
  password: string;
}

export interface LoginDTO {
  identity: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatarURL: string;
  fullName?: string;
}

export interface AuthState {
  loginUser: User | null;
  isLoadingAuth: boolean;
}
