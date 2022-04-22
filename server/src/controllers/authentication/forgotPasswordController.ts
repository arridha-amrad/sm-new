import { Request, Response } from 'express';
import { createToken } from '../../services/JwtServices';
import sendEmail from '../../services/MailServices';
import { findUser } from '../../services/UserServices';
import { createResetPasswordEmail } from '../../templates/MailTemplates';
import { emailNotVerified, forgotPassword } from '../../templates/Messages';
import { forgotPasswordValidator } from './authFieldValidator';

export default async (req: Request, res: Response) => {
  const { email } = req.body;
  const { errors, valid } = forgotPasswordValidator(email);
  if (!valid) {
    return res.status(400).json(errors);
  }
  try {
    const user = await findUser({ email });
    if (!user) {
      return res.sendStatus(404);
    }
    if (!user.isVerified) {
      return res.status(400).send(emailNotVerified);
    }
    if (user.strategy !== 'default') {
      return res
        .status(400)
        .send('Your account is created with different strategy');
    }
    user.requiredAuthAction = 'resetPassword';
    await user.save();
    const token = await createToken(user.id, 'link');
    if (token) {
      const emailContent = createResetPasswordEmail(user.username, token);
      await sendEmail(email, emailContent);
      return res.status(200).json({ message: forgotPassword(email) });
    }
  } catch (err) {
    console.log('forgotPassword : ', err);
    return res.sendStatus(500);
  }
};
