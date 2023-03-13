
export enum ErrorMessages {
  Empty = '',
  FillAll = 'Vul alle velden in',
  ValidEmail = 'Vul een geldig e-mailadres in',
  UsernameLength = 'Gebruikersnaam moet tussen de 3 karakters lang zijn',
  PasswordLength = 'Wachtwoord moet tussen de 12 en 128 karakters lang zijn',
  PasswordMatch = 'Wachtwoorden komen niet overeen'
}

export function isValidationError(error: Error): error is ValidationError {
  return error.name === 'ValidationError';
}

export function checkForValidationError(error: Error): ErrorMessages | null {
  if (isValidationError(error)) {
    return error.getError();
  }
  return null;
}

export function checkForm(name: string, password: string, password2?: string, isRegister = false) {
  try {
    nameCheck(name);
    passwordCheck(password, password2, isRegister);
  } catch (error: any) {
    return checkForValidationError(error);
  }
  return null;
}

// validation error
export class ValidationError extends Error {
  error: ErrorMessages;
  constructor(error: ErrorMessages) {
    super(error);
    this.name = 'ValidationError';
    this.error = error;
  }

  getError() {
    return this.error;
  }
}

export const nameCheck = (username: string) => {
  if (!username) {
    throw new ValidationError(ErrorMessages.Empty);
  }

  if (username.length < 3 && username.length > 128) {
    throw new ValidationError(ErrorMessages.UsernameLength);
  }
};

export const emailCheck = (email: string) => {
  if (!email) {
    throw new ValidationError(ErrorMessages.FillAll);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError(ErrorMessages.ValidEmail);
  }
};

export const passwordCheck = (password: string, password2?: string, isRegister = false) => {
  if (!password) {
    throw new ValidationError(ErrorMessages.Empty);
  }

  password = password.replace(/\s/g, ' ').trim();
  if (isRegister && password2) {
    password2 = password2.replace(/\s/g, ' ').trim();
  }

  if (password.length < 12 || password.length > 128) {
    throw new ValidationError(ErrorMessages.PasswordLength);
  }
  if (isRegister && password !== password2) {
    throw new ValidationError(ErrorMessages.PasswordMatch);
  }
};