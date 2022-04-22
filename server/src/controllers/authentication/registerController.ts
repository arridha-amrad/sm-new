import { Request, Response } from 'express';
import { createUser, findUser } from '../../services/UserServices';
import argon2 from 'argon2';
import sendEmail from '../../services/MailServices';
import { registerSuccess } from '../../templates/Messages';
import { registerValidator } from './authFieldValidator';
import { createToken } from '../../services/JwtServices';
import { createConfirmationEmail } from '../../templates/MailTemplates';

export default async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const { errors, valid } = registerValidator({
    email,
    password,
    username,
  });
  if (!valid) {
    return res.status(400).json(errors);
  }
  try {
    const isEmailRegistered = await findUser({ email });
    if (isEmailRegistered) {
      return res.status(400).send('Email has been registered');
    }
    const isUsernameRegistered = await findUser({ username });
    if (isUsernameRegistered) {
      return res.status(400).send('Username has been registered');
    }
    const hashedPassword = await argon2.hash(password!);
    const newUser = await createUser({
      email,
      username,
      password: hashedPassword,
      strategy: 'default',
      requiredAuthAction: 'emailVerification',
    });
    if (newUser) {
      const emailToken = await createToken(newUser.id, 'link');
      if (emailToken) {
        const emailContent = createConfirmationEmail(
          newUser.username,
          emailToken
        );
        await sendEmail(email, emailContent);
        return res.status(201).json({ message: registerSuccess(email) });
      }
    }
    return res.status(400).send('Create user failure');
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
