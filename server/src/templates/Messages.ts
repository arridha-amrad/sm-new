const emailVerified = (username: string): string =>
  `Welcome ${username}! Your email verification is successful. You can login with your account.`;
const duplicateData = (data: string): string =>
  `Failed. ${data} has been registered.`;
const invalidPassword = 'Invalid password';
const userNotFound = 'user not found';
const emailNotVerified = 'please verify your email';

export {
  duplicateData,
  invalidPassword,
  userNotFound,
  emailNotVerified,
  emailVerified,
};
