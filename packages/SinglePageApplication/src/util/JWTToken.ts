import { useStorage } from './storage';

export const useJWT = () => {
  const [jwt, setJWT] = useStorage('jwt', '', 'session');

  return { jwt, setJWT };
};
