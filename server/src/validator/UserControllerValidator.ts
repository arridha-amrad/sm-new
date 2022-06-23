import { IFieldError, IValidationResult } from '../types/FieldErrorTypes';
import { IRegisterDTO } from '../types/UserControllerTypes';

class UserControllerValidator {
  private emailRegEx =
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

  register(data: IRegisterDTO): IValidationResult {
    const { email, password, username } = data;

    let errors: IFieldError[] = [];
    if (username.trim() === '') {
      errors = [
        ...errors,
        {
          field: 'username',
          message: 'username is required',
        },
      ];
      // errors.username = 'Username is required';
    } else if (username.length <= 5) {
      errors = [
        ...errors,
        {
          field: 'username',
          message: 'username is too short',
        },
      ];
    } else if (username.includes(' ')) {
      errors = [
        ...errors,
        {
          field: 'username',
          message: "username can't contain space",
        },
      ];
    }
    if (email.trim() === '') {
      errors = [
        ...errors,
        {
          field: 'email',
          message: 'email is required',
        },
      ];
    } else if (!email.match(this.emailRegEx)) {
      errors = [
        ...errors,
        {
          field: 'email',
          message: 'email is not valid',
        },
      ];
    }

    if (password?.length === 0) {
      errors = [
        ...errors,
        {
          field: 'password',
          message: 'Password is required',
        },
      ];
    }
    return {
      errors,
      valid: errors.length <= 0,
    };
  }

  resetPasswordValidator(password: string): IValidationResult {
    let errors: IFieldError[] = [];
    if (password.length === 0) {
      errors = [
        ...errors,
        {
          field: 'password',
          message: 'please input a valid password',
        },
      ];
    }
    return {
      errors,
      valid: errors.length <= 0,
    };
  }
}

export default new UserControllerValidator();
