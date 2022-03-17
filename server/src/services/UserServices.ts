import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IUserModel } from '../models/user/IUserModel';
import UserModel from '../models/user/UserModel';

export const createUser = async (user: IUserModel): Promise<IUserModel> => {
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
  return UserModel.findByIdAndUpdate(id, update, options);
};

export const findUser = async (query: FilterQuery<IUserModel>) => {
  return UserModel.findOne(query);
};
