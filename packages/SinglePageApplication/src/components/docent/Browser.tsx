import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { docentSocket as socket } from '../../util/websocket';

const Browser = () => {
  const params = useParams();
  const { userId } = params;
  const navigator = useNavigate();

  const [image, setImage] = React.useState('');

  const timeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    console.log('connectasdf', userId);
    if (!userId) return;
    console.log('connect', userId);
    setImage('');
    socket.emit('join', { token: userId });
    socket.emit('view', { id: userId });
    socket.on('change', ({ userId: changeId, type }) => {
      if (userId === changeId) {
        if (type === 'connect') setTimeout(connect, 4500);
        if (type === 'disconnect' && !timeout) navigator('/docent', { replace: true });
      }
    });
    socket.on('image_view', ({ img }) => {
      if (timeout.current) clearTimeout(timeout.current);
      setImage('data:image/jpeg;base64,' + img);
      timeout.current = setTimeout(() => {
        console.log('timeout');
        setImage('');
      }, 3000);
    });
  };

  useEffect(() => {
    socket.connect();
    socket.on('connected', () => {
      console.log('connected');
      connect();
    });
  }, []);

  if (!image)
    return (
      <>
        <div
          style={{ borderTopColor: 'transparent' }}
          className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"
        ></div>
      </>
    );
  return <img className="w-full max-h-screen" src={image}></img>;
};

export default Browser;
