import { LoginResponse } from '@showcase/restapi/types';
import { LoginFormData } from '../components/login/Fields';
import { useUser } from '../hooks/storage';

const API_ENDPOINT = '/api';

/**
 * Login the user
 * @param formData
 * @returns true if login was successful
 */
export async function login(formData: LoginFormData): Promise<boolean> {
  const [, setUser, removeUser] = await useUser();
  const response = await fetch(API_ENDPOINT + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const { token, user } = (await response.json()) as LoginResponse;

  if (token) {
    console.log('reponse', token, user);
    setUser(user);
    return true;
  }
  removeUser();
  return false;
}
