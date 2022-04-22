export interface IUserModel {
  fullName?: string;
  username: string;
  strategy: 'default' | 'google';
  email: string;
  password?: string;
  requiredAuthAction: 'none' | 'emailVerification' | 'resetPassword';
  refreshTokens: string[];
  avatarURL: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
