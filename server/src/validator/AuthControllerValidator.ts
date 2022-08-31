import { ILoginDTO } from '../types/AuthControllerTypes';
import { IFieldError, IValidationResult } from '../types/FieldErrorTypes';

class AuthControllerValidator {
  loginValidator = ({ identity, password }: ILoginDTO): IValidationResult => {
    let errors: IFieldError[] = [];
    if (identity.trim() === '') {
      errors = [
        ...errors,
        {
          field: 'identity',
          message: 'please input your email or username',
        },
      ];
    }
    if (password?.length === 0) {
      errors = [
        ...errors,
        {
          field: 'password',
          message: 'password is required',
        },
      ];
    }
    return {
      errors,
      valid: errors.length <= 0,
    };
  };
}

export default new AuthControllerValidator();
