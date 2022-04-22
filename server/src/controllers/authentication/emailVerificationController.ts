import { Request, Response } from 'express';
import { verifyToken } from '../../services/JwtServices';
import {
  findUserById,
  findUserByIdAndUpdate,
} from '../../services/UserServices';

export default async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const userId = await verifyToken(token, 'link');
    if (userId) {
      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).send('<p>User not found</p>');
      }
      if (user?.isVerified) {
        return res.status(200).send('<p>Your email has been verified</p>');
      }
      if (user && user.requiredAuthAction === 'emailVerification') {
        await findUserByIdAndUpdate(
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
    } else {
      return res.status(200).send('<p>Verification failed</p>');
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
