import { GroupData } from '@showcase/restapi/types';
import React from 'react';
import Card from './Card';

const GroupCard: React.FC<GroupData> = ({ code, name, online = 0 }) => {
  return (
    <Card className="border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-900 mb-5 break-words px-4 max-w-full text-center">{name}</h1>
      <h2 className="text-xl font-bold text-gray-900">
        <span className="font-mono text-red-500">Code: </span>
        {code}
      </h2>
      <h3 className="text-xl font-bold text-gray-900">
        <span className="font-mono text-orange-400">Online: </span>
        {online}
      </h3>
    </Card>
  );
};

export default GroupCard;
