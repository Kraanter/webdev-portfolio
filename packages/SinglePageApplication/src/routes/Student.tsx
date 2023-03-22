import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useStorage } from '../util/storage';

const Student: React.FC = () => {
  // connect to socket.io
  const [connected, setConnected] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [getSession] = useStorage('session', '', 'session');
  const socket = io('/', {
    path: '/browser-streamer',
    withCredentials: true,
    extraHeaders: {
      student_token: getSession(),
    },
    autoConnect: false,
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
      setConnected(true);
    });

    socket.on('stream', (data: string) => {
      setImageSrc(data);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      setConnected(false);
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  return (
    <div>
      <h1>Student</h1>
      <p>Session: {connected ? 'Connected' : 'Disconnected'}</p>
      <div className="w-full h-full">
        <img
          src={imageSrc}
          alt="stream"
          className="w-full h-full object-cover"
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            setImageSrc(target.src);
          }}
        />
      </div>
    </div>
  );
};

export default Student;
