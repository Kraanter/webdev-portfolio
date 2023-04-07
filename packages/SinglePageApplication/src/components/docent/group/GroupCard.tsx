import { GroupData } from '@showcase/restapi/types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Card from './Card';

const GroupCard: React.FC<GroupData & { socket: Socket }> = ({ code, name, online = 0, socket }) => {
  const [numOnline, setNumOnline] = useState(online);
  const navigator = useNavigate();

  useEffect(() => {
    socket.emit('join', { token: code });
    socket.on('change', (data: string) => {
      if (data === code) getNumOnline();
    });
    getNumOnline();
  }, []);

  const getNumOnline = () => {
    fetch(`/api/groups/${code}`)
      .then((res) => res.json())
      .then((data) => setNumOnline(data.online));
  };

  return (
    <Card className="border border-gray-200" onClick={() => navigator(`/docent/group/${code}`)}>
      <h1 className="text-4xl font-bold text-gray-900 mb-5 break-words px-4 max-w-full text-center">{name}</h1>
      <h2 className="text-xl font-bold text-gray-900">
        <span className="font-mono text-red-500">Code: </span>
        {code}
      </h2>
      <h3 className="text-xl font-bold text-gray-900">
        <span className="font-mono text-orange-400">Online: </span>
        {numOnline}
      </h3>
    </Card>
  );
};

export default GroupCard;
