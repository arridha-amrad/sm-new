/* eslint-disable no-unused-vars */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    DB_URI: string;
    SERVER_ORIGIN: string;
    CLIENT_ORIGIN: string;
    COOKIE_ACC_TOKEN: string;
    COOKIE_REFRESH_TOKEN: string;
    GOOGLE_OAUTH_REDIRECT_URL: string;
    GOOGLE_OAUTH_CLIENT_ID: string;
    GOOGLE_OAUTH_CLIENT_SECRET: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_NAME: string;
    MONGO_DB_ATLAS_URI: string;
  }
}
