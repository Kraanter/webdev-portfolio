import { io } from 'socket.io-client';

const PATH = '/browser-streamer/';

export const socket = io('/', {
  path: PATH,
  autoConnect: false,
  withCredentials: true,
});

export const docentSocket = io('/', {
  path: PATH,
  autoConnect: false,
  withCredentials: true,
  extraHeaders: {
    'x-role': 'docent',
  },
});
