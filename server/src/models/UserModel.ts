import { Model, Schema, model } from 'mongoose';
import { IUserModel } from '../types/ModelTypes';

const UserSchema = new Schema<IUserModel, Model<IUserModel>>(
  {
    fullName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatarURL: {
      type: String,
      default:
        'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
    },
    password: String,
    strategy: {
      type: String,
      required: true,
      enum: ['default', 'google'],
    },
    requiredAuthAction: {
      type: String,
      enum: ['none', 'emailVerification', 'resetPassword'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: [String],
  },
  { timestamps: true }
);

const UserModel = model<IUserModel>('User', UserSchema);

export default UserModel;
