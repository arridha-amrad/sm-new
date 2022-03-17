import { Request, Response } from 'express';
import { verifyTokenLink } from '../../services/JwtServices';
import { findUser, findUserByIdAndUpdate } from '../../services/UserServices';
import generateCode from '../../utils/CodeGenerator';
import argon2 from 'argon2';
import { resetPassword } from '../../templates/Message';
import { resetPasswordValidator } from './authFieldValidator';

export default async (req: Request, res: Response) => {
  const { password } = req.body;
  const { token } = req.params;
  const { errors, valid } = resetPasswordValidator(password);
  if (!valid) {
    return res.status(400).json(errors);
  }
  try {
    const payload = await verifyTokenLink(token);
    const user = await findUser({ email: payload.email });
    if (user) {
      if (user.requiredAuthAction !== 'resetPassword') {
        return res.status(400).json({ message: 'Action is not granted' });
      }

      // update user's jwtVersion, password, requiredAuthAction
      await findUserByIdAndUpdate(user.id, {
        jwtVersion: await generateCode(),
        requiredAuthAction: 'none',
        password: await argon2.hash(password),
      });

      // return
      return res.status(200).json({ message: resetPassword });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.log('confirmEmail errors : ', err);
    return res.sendStatus(500);
  }
};
