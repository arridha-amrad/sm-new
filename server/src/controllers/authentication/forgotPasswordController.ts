import { Request, Response } from 'express';
import { createEmailLinkToken } from '../../services/JwtServices';
import sendEmail from '../../services/MailServices';
import { findUser } from '../../services/UserServices';
import { resetPasswordRequest } from '../../templates/MailTemplates';
import { emailNotVerified, forgotPassword } from '../../templates/Message';
import { forgotPasswordValidator } from './authFieldValidator';

export default async (req: Request, res: Response) => {
  const { email } = req.body;
  const { errors, valid } = forgotPasswordValidator(email);
  if (!valid) {
    return res.status(400).json(errors);
  }
  try {
    // get user
    const user = await findUser({ email });
    if (!user) {
      return res.sendStatus(404);
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: emailNotVerified });
    }
    user.requiredAuthAction = 'resetPassword';
    await user.save();
    const token = await createEmailLinkToken(email);
    if (token) {
      await sendEmail(email, resetPasswordRequest(user.username, token));
      return res.status(200).json({ message: forgotPassword(email) });
    }
    return;
  } catch (err) {
    console.log('forgotPassword : ', err);
    return res.sendStatus(500);
  }
};
