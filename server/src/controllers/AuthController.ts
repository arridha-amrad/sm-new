import { Request, Response } from 'express';
import RefTokenServices from '../services/RefTokenServices';
import UserServices from '../services/UserServices';
import { ILoginDTO } from '../types/AuthControllerTypes';
import Helpers from '../utils/Helpers';
import AuthControllerValidator from '../validator/AuthControllerValidator';
import argon from 'argon2';
import JwtServices from '../services/JwtServices';
import config from '../config';

class AuthController {
  async login(req: Request, res: Response) {
    const currentRefToken = Helpers.getRefreshTokenFromCookie(req);
    if (currentRefToken) {
      await RefTokenServices.removeRefreshToken(currentRefToken);
    }
    const { identity, password } = req.body as ILoginDTO;
    const { valid, errors } = AuthControllerValidator.loginValidator({
      identity,
      password,
    });
    if (!valid) {
      return res.status(400).json(errors);
    }
    try {
      const user = await UserServices.findUser(
        identity.includes('@') ? { email: identity } : { username: identity }
      );
      if (!user) {
        return res.status(404).send('User not found');
      }
      if (!user.isVerified) {
        return res.status(400).send('Please verify your email before login');
      }
      if (user && user.strategy !== 'default') {
        return res
          .status(400)
          .send('This account is registered with different strategy');
      }
      const isMatch = await argon.verify(user.password!, password!);
      if (!isMatch) {
        return res.status(400).send('Password not match');
      }
      const authToken = await JwtServices.createToken(user.id, 'auth');
      const refreshToken = await JwtServices.createToken(user.id, 'refresh');
      user.refreshTokens.push(refreshToken);
      await user.save();
      const bearerAuthToken = `Bearer ${authToken}`;
      const bearerRefToken = `Bearer ${refreshToken}`;
      return res
        .status(200)
        .cookie(config.refCookieName, bearerRefToken, Helpers.setCookieOptions)
        .json({
          accessToken: bearerAuthToken,
        });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server Error');
    }
  }
  async googleOAuth(req: Request, res: Response) {
    // get the code from qs
    const code = req.query.code as string;
    try {
      // get the id and accessToken with the code
      const { access_token, id_token } = await Helpers.getGoogleOAuthTokens({
        code,
      });
      // get user with tokens
      const googleUser = await Helpers.getGoogleUser(id_token, access_token);
      if (!googleUser.verified_email) {
        res.status(403).json({ message: 'Google account is not verified' });
      }
      const user = await UserServices.findUser({ email: googleUser.email });

      if (user && user.strategy !== 'google') {
        return res.redirect(
          `${process.env.CLIENT_ORIGIN}/login?e=` +
            encodeURIComponent(
              'Another user has been registered with this email'
            )
        );
      }

      const { email, family_name, given_name, name } = googleUser;
      let myUser;
      if (!user) {
        const newUser = await UserServices.createUser({
          requiredAuthAction: 'none',
          email,
          fullName: `${given_name} ${family_name}`,
          username: name.split(' ').join(''),
          isVerified: true,
          strategy: 'google',
          refreshTokens: [],
        });
        myUser = newUser;
      } else {
        myUser = user;
      }
      const refreshToken = await JwtServices.createToken(myUser.id, 'refresh');
      if (refreshToken) {
        myUser.refreshTokens.push(refreshToken);
        await myUser.save();

        const bearerRefToken = `Bearer ${refreshToken}`;

        res.cookie(
          config.refCookieName,
          bearerRefToken,
          Helpers.setCookieOptions
        );
        res.redirect(config.clientOrigin);
      }
    } catch (err) {
      console.log(err);
      res.redirect(`${process.env.CLIENT_ORIGIN}/login`);
    }
  }
  async logout(req: Request, res: Response) {
    const refreshToken = Helpers.getRefreshTokenFromCookie(req);
    try {
      const user = await UserServices.findUser({ refreshTokens: refreshToken });
      if (user) {
        const refreshTokens = user.refreshTokens.filter(
          (rt) => rt !== refreshToken
        );
        user.refreshTokens = refreshTokens;
        await user.save();
      }
      res.clearCookie(config.refCookieName);
      return res.send('logout successfully');
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  }
}

export default new AuthController();
