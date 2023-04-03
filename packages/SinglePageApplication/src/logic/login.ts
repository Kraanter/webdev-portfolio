import { LoginRequest, StudentLoginRequest, UserData } from '@showcase/restapi/types';
import { fetcher } from '../api/fetcher';
import { useStorage } from '../util/storage';

const API_ENDPOINT = '/api';

export async function fetchUser(type: 'login' | 'register', formData: LoginRequest) {
  const [, setUser, removeUser] = useStorage<UserData | undefined>('user', undefined, 'session');
  const response = await fetch(API_ENDPOINT + '/' + type, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const { token, user } = await response.json();

  if (token) {
    console.log('reponse', token, user);
    setUser(user);
    return true;
  }
  removeUser();
  return false;
}

export async function fetchStudent(studentFormData: StudentLoginRequest) {
  const [, , removeUser] = useStorage<UserData | undefined>('session', undefined, 'session');
  const response = await fetch(API_ENDPOINT + '/student/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentFormData),
  });

  const { authenticated, decoded, message } = (await response.json()) as {
    authenticated: boolean;
    decoded: UserData;
    message?: string;
  };

  if (!authenticated) {
    removeUser();
    return message ?? 'Internal Server Error';
  }
  console.log('reponse', decoded);
  return !!authenticated;
}

export async function logoutUser() {
  const [, , removeUser] = useStorage<UserData | undefined>('user', undefined, 'session');
  const [, , removeToken] = useStorage<string | undefined>('token', undefined, 'session');
  const response = await fetcher('GET')(API_ENDPOINT + '/logout');

  if (response.status === 200) {
    removeUser();
    removeToken();
  }
}
