import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { docentSocket as socket } from '../../util/websocket';

const Browser = () => {
  const params = useParams();
  const { userId } = params;

  const [image, setImage] = React.useState('');

  useEffect(() => {
    socket.connect();
    socket.on('connected', () => {
      console.log('connected');
      if (userId) socket.emit('view', { id: userId });
    });
    socket.on('image_view', ({ img }) => {
      setImage('data:image/jpeg;base64,' + img);
    });
  }, []);

  return <img className="w-full max-h-screen" src={image}></img>;
};

export default Browser;
