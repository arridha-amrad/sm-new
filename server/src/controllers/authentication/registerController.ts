import { Request, Response } from 'express';
import { createUser, findUser } from '../../services/UserServices';
import argon2 from 'argon2';
import sendEmail from '../../services/MailServices';
import { emailConfirmation } from '../../templates/MailTemplates';
import { registerSuccess } from '../../templates/Message';
import { createEmailLinkToken } from '../../services/JwtServices';
import { registerValidator } from './authFieldValidator';

export default async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const { errors, valid } = registerValidator({
    email,
    password,
    username,
  });
  if (!valid) {
    return res.status(400).send(errors);
  }
  try {
    // email and username must be unique
    const isEmailRegistered = await findUser({ email });
    if (isEmailRegistered) {
      return res.status(400).send('Email has been registered');
    }
    const isUsernameRegistered = await findUser({ username });
    if (isUsernameRegistered) {
      return res.status(400).send('Username has been registered');
    }

    // hash the input password & create new user
    const hashedPassword = await argon2.hash(password!);

    const newUser = await createUser({
      email,
      username,
      password: hashedPassword,
      strategy: 'default',
      requiredAuthAction: 'emailVerification',
    });

    if (newUser) {
      const emailToken = await createEmailLinkToken(email);

      await sendEmail(email, emailConfirmation(username, emailToken!));

      return res.status(201).json({ message: registerSuccess(email) });
    }
    return res.status(400).send('Create user failure');
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
