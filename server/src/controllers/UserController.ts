import { Request, Response } from 'express';
import argon2 from 'argon2';

import UserServices from '../services/UserServices';
import MailServices from '../services/MailServices';
import { IRegisterDTO } from '../types/UserControllerTypes';
import UserControllerValidator from '../validator/UserControllerValidator';
import JwtServices from '../services/JwtServices';
import Helpers from '../utils/Helpers';
import config from '../config';

class UserController {
  async register(req: Request, res: Response) {
    const { email, username, password } = req.body as IRegisterDTO;
    // validate user input
    const { errors, valid } = UserControllerValidator.register({
      email,
      password,
      username,
    });
    if (!valid) {
      return res.status(400).send(errors);
    }
    try {
      // is username or email has been registered ?
      const isEmailRegistered = await UserServices.findUser({ email });
      if (isEmailRegistered) {
        return res.status(400).send('Email has been registered');
      }
      const isUsernameRegistered = await UserServices.findUser({
        username,
      });
      if (isUsernameRegistered) {
        return res.status(400).send('Username has been registered');
      }
      // store user
      const hashedPassword = await argon2.hash(password!);
      const newUser = await UserServices.createUser({
        email,
        username,
        password: hashedPassword,
        strategy: 'default',
        requiredAuthAction: 'emailVerification',
      });
      const emailToken = await JwtServices.createToken(newUser.id, 'link');
      const emailContent = MailServices.composeEmail(
        newUser.username,
        emailToken,
        'email confirmation'
      );
      await MailServices.sendEmail(email, emailContent);
      return res.status(201).json({
        message: `An email has been sent to ${email}, please follow the instruction to verify your account.`,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const email = req.body.email as string;
    if (email.trim() === '') {
      return res.status(400).send('Email is required');
    }
    try {
      const user = await UserServices.findUser({ email });
      if (!user) {
        return res.sendStatus(404);
      }
      if (!user.isVerified) {
        return res.status(400).send('Please verify your email');
      }
      if (user.strategy !== 'default') {
        return res
          .status(400)
          .send('Your account is created with different strategy');
      }
      user.requiredAuthAction = 'resetPassword';
      await user.save();
      const token = await JwtServices.createToken(user.id, 'link');
      const emailContent = MailServices.composeEmail(
        user.username,
        token,
        'reset password'
      );
      await MailServices.sendEmail(email, emailContent);
      return res.status(200).json({
        message: `An email has been sent to ${email}. Please follow the instructions to reset your password.`,
      });
    } catch (err) {
      console.log('forgotPassword : ', err);
      return res.sendStatus(500);
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { password } = req.body;
    const { token } = req.params;
    const { errors, valid } =
      UserControllerValidator.resetPasswordValidator(password);
    if (!valid) {
      return res.status(400).json(errors);
    }
    try {
      const userId = await JwtServices.verifyToken(token, 'link');
      const user = await UserServices.findUserById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      if (user.requiredAuthAction !== 'resetPassword') {
        return res.status(400).json({ message: 'Action is not granted' });
      }
      await UserServices.findUserByIdAndUpdate(user.id, {
        $set: {
          password: await argon2.hash(password),
          requiredAuthAction: 'none',
          refreshTokens: [],
        },
      });
      // return
      return res.status(200).json({
        message:
          'Congratulations! Your password have changed successfully. Now you can login with your new password.',
      });
    } catch (err) {
      console.log('confirmEmail errors : ', err);
      return res.sendStatus(500);
    }
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = Helpers.getRefreshTokenFromCookie(req);

    if (!refreshToken) {
      return res.status(403).send('ref token was not included');
    }
    try {
      const userId = await JwtServices.verifyToken(refreshToken, 'refresh');
      const user = await UserServices.findUser({
        refreshTokens: refreshToken,
      });
      // Refresh Token reuse detected
      if (!user) {
        const hackedUser = await UserServices.findUserById(userId!);
        if (hackedUser) {
          hackedUser.refreshTokens = [];
          await hackedUser.save();
        }
        return res.status(403).send('reuse detected');
      }
      const newRefreshTokens = user.refreshTokens.filter(
        (rt) => rt !== refreshToken
      );
      const newRefreshToken = await JwtServices.createToken(user.id, 'refresh');
      const newAuthToken = await JwtServices.createToken(user.id, 'auth');
      user.refreshTokens = [...newRefreshTokens, newRefreshToken];
      await user.save();
      return res
        .status(200)
        .cookie(
          config.refCookieName,
          `Bearer ${newRefreshToken}`,
          Helpers.setCookieOptions
        )
        .json({ token: `Bearer ${newAuthToken}` });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async me(req: Request, res: Response) {
    const userId = Helpers.getUserIdFromAccToken(req);
    try {
      const user = await UserServices.findUserById(
        userId,
        '_id username email avatarURL fullName'
      );
      if (!user) {
        return res.status(404).send('User not found');
      }
      return res.status(200).json({ user });
    } catch (err) {
      return res.sendStatus(500);
    }
  }

  async searchUser(req: Request, res: Response) {
    const username = req.query.username as string;
    try {
      const users = await UserServices.findUsers({
        username: { $regex: username, $options: 'i' },
      });
      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async emailVerification(req: Request, res: Response) {
    const { token } = req.params;
    try {
      const userId = await JwtServices.verifyToken(token, 'link');
      const user = await UserServices.findUserById(userId);
      if (!user) {
        return res.status(404).send('<p>User not found</p>');
      }
      if (user?.isVerified) {
        return res.status(200).send('<p>Your email has been verified</p>');
      }
      if (user && user.requiredAuthAction === 'emailVerification') {
        await UserServices.findUserByIdAndUpdate(
          user.id!,
          {
            isVerified: true,
            requiredAuthAction: 'none',
          },
          { new: true }
        );
        return res
          .status(200)
          .send(
            `<p>Verification Successful</p> <a href=${process.env.CLIENT_ORIGIN}/login>Click here to login</a>`
          );
      }
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new UserController();
