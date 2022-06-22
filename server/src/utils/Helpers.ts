import axios from 'axios';
import { CookieOptions, Request } from 'express';
import qs from 'qs';
import {
  GoogleTokensResult,
  GoogleUserResult,
} from '../types/AuthControllerTypes';

class Helpers {
  setCookieOptions: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  getRefreshTokenFromCookie = (req: Request) => {
    const bearerToken = req.cookies.refreshToken as string | undefined;
    if (bearerToken) {
      return bearerToken.split(' ')[1];
    }
  };

  getUserIdFromAccToken = (req: Request) => {
    return req.app.locals.userId as string;
  };

  getGoogleUser = async (
    id_token: string,
    access_token: string
  ): Promise<GoogleUserResult> => {
    try {
      const res = await axios.get<GoogleUserResult>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      console.log(err);
      throw new Error(err.message);
    }
  };

  async getGoogleOAuthTokens({
    code,
  }: {
    code: string;
  }): Promise<GoogleTokensResult> {
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
      code,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
      grant_type: 'authorization_code',
    };

    try {
      const res = await axios.post<GoogleTokensResult>(
        url,
        qs.stringify(values),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return res.data;
    } catch (error: any) {
      console.error('myError', error.response.data.error);
      console.error(error, 'Failed to fetch Google Oauth Tokens');
      throw new Error(error.message);
    }
  }
}

export default new Helpers();
