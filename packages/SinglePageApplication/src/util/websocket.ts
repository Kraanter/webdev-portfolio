import { io } from 'socket.io-client';

const URL = '/';
const PATH = '/browser-streamer';

export const socket = io(URL, {
  path: PATH,
  autoConnect: false,
  withCredentials: true,
});
