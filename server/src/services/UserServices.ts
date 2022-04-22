import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IUserModel } from '../models/user/IUserModel';
import UserModel from '../models/user/UserModel';
import { AnyKeys } from 'mongoose';

export const createUser = async (user: AnyKeys<IUserModel>) => {
  const newUser = new UserModel(user);
  return newUser.save();
};

export const findUserByUsernameOrEmail = async (usernameOrEmail: string) => {
  return UserModel.findOne(
    usernameOrEmail.includes('@')
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
  );
};

export const findUserById = async (userId: string, selects?: string) => {
  return UserModel.findById(userId).select(selects);
};

export const findUserByIdAndUpdate = async (
  id: string,
  update: UpdateQuery<IUserModel>,
  options?: QueryOptions | null
) => {
  return UserModel.findByIdAndUpdate(id, update, {
    new: true,
  });
};

export const findUser = async (query: FilterQuery<IUserModel>) => {
  return UserModel.findOne(query);
};

export const findUsers = async (filter: FilterQuery<IUserModel>) => {
  return UserModel.find(filter).select('_id username avatarURL fullName');
};

export const removeRefreshToken = async (refreshToken: string) => {
  const user = await findUser({ refreshTokens: refreshToken });
  if (user) {
    const filteredToken = user.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    user.refreshTokens = filteredToken;
    await user.save();
  }
};
