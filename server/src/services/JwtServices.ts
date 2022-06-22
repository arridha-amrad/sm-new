import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { NextFunction, Request, Response } from 'express';

const publicKey = fs.readFileSync('keys/public.pem', 'utf-8');
const privateKey = fs.readFileSync('keys/private.pem', 'utf-8');

type TokenTypes = 'link' | 'auth' | 'refresh';

class JwtServices {
  async createToken(userId: string, type: TokenTypes): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { userId },
        privateKey,
        {
          algorithm: 'RS256',
          expiresIn: type === 'link' ? '1d' : type === 'auth' ? '2h' : '1d',
        },
        (err, token) => {
          if (err) {
            reject(new Error(`Failure on creating token : ${err.message}`));
          }
          resolve(token as string);
        }
      );
    });
  }

  async verifyToken(token: string, type: TokenTypes): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ['RS256'],
          maxAge: type === 'link' ? '1d' : type === 'auth' ? '2h' : '1d',
        },
        (err, payload) => {
          if (err) {
            reject(new Error(`token verification error : ${err.message}`));
          }
          const { userId } = payload as { userId: string };
          resolve(userId);
        }
      );
    });
  }

  async verifyAuthToken(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers['authorization'];
    if (bearerToken) {
      const token = bearerToken.split(' ')[1];
      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ['RS256'],
          maxAge: '2h',
        },
        (err, payload) => {
          if (err && err.message === 'jwt expired') {
            return res.status(403).send('token expired');
          }
          const { userId } = payload as { userId: string };
          req.app.locals.userId = userId;
          next();
        }
      );
    }
  }
}

export default new JwtServices();
