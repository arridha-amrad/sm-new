import UserServices from './UserServices';

class RefTokenServices {
  async removeRefreshToken(refreshToken: string) {
    try {
      const user = await UserServices.findUser({ refreshTokens: refreshToken });
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
}

export default new RefTokenServices();
