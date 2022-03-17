import { Request, Response } from 'express';
import { verifyTokenLink } from '../../services/JwtServices';
import { findUser, findUserByIdAndUpdate } from '../../services/UserServices';
import generateCode from '../../utils/CodeGenerator';

export default async (req: Request, res: Response) => {
  const { token } = req.params;

  const payload = await verifyTokenLink(token);

  const user = await findUser({ email: payload.email });

  if (user?.isVerified) {
    return res.status(200).send('<p>Your email has been verified</p>');
  }

  if (user && user.requiredAuthAction === 'emailVerification') {
    await findUserByIdAndUpdate(
      user.id!,
      {
        jwtVersion: await generateCode(),
        isActive: true,
        isLogin: true,
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
  } else {
    return res.status(200).send('<p>Verification failed</p>');
  }
};
