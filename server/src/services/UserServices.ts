import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IUser } from '../types/ModelTypes';
import UserModel from '../models/UserModel';
import { AnyKeys } from 'mongoose';

class UserServices {
  async findUser(query: FilterQuery<IUser>) {
    try {
      return UserModel.findOne(query);
    } catch (err) {
      throw new Error(err);
    }
  }

  async createUser(user: AnyKeys<IUser>) {
    try {
      const newUser = new UserModel(user);
      return newUser.save();
    } catch (err) {
      throw new Error(err);
    }
  }

  async removeRefreshToken(refreshToken: string) {
    try {
      const user = await this.findUser({ refreshTokens: refreshToken });
      if (user) {
        const filteredToken = user.refreshTokens.filter(
          (rt) => rt !== refreshToken
        );
        user.refreshTokens = filteredToken;
        await user.save();
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserById(userId: string, selects?: string) {
    try {
      return UserModel.findById(userId).select(selects);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserByIdAndUpdate(
    id: string,
    update: UpdateQuery<IUser>,
    options?: QueryOptions | null
  ) {
    try {
      return UserModel.findByIdAndUpdate(id, update, {
        new: true,
        ...options,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUsers(filter: FilterQuery<IUser>) {
    try {
      return UserModel.find(filter).select('_id username avatarURL fullName');
    } catch (err) {
      throw new Error(err);
    }
  }
}
export default new UserServices();
