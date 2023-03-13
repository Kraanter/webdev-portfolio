import { useStorage } from './storage';

export const useJWT = () => {
  const [jwt, setJWT] = useStorage('jwt', '', 'local');

  return { jwt, setJWT };
};
