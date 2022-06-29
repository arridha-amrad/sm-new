import { User } from '../features/authentication/IAuthentication';

const likeHelpers = (users: User[], authenticatedUser: User) => {
  const newArray = [];
  for (let i = 0; i < users.length; i++) {
    if (i > 0 && i + 1 !== users.length) {
      newArray.push(', ');
    }
    const username =
      users[i].username === authenticatedUser?.username
        ? 'you'
        : users[i].username;
    if (i === 3 && users.length > 4) {
      newArray.push(`${users.length - 4} others`);
      break;
    }
    newArray.push(username);
  }
  if (users.length !== 1) {
    if (users.length > 4) {
      newArray.splice(newArray.length - 2, 1, ' & ');
    } else {
      newArray.splice(newArray.length - 1, 0, ' & ');
    }
  }
  return newArray.join('');
};

export default likeHelpers;
