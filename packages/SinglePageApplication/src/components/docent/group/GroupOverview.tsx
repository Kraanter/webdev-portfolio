import { GroupData, UserData } from '@showcase/restapi/types';
import React from 'react';
import { useStorage } from '../../../util/storage';
import { docentSocket as socket } from '../../../util/websocket';
import AddGroupCard from './AddGroupCard';
import GroupCard from './GroupCard';

const GroupOverview: React.FC = () => {
  const [groups, setGroups] = React.useState<GroupData[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [getUser] = useStorage<UserData | undefined>('user', undefined, 'session');
  const user = getUser();
  const isAdmin = user?.id === 1;

  React.useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.on('connected', () => {
        setIsConnected(true);
      });
    } else {
      setIsConnected(true);
    }
  }, []);

  React.useEffect(() => {
    if (isConnected) {
      console.log('connected');
      fetch('/api/groups')
        .then((res) => res.json())
        .then((data) => setGroups(data));

      socket.on('change', (type: string) => {
        if (type === 'group') {
          fetch('/api/groups')
            .then((res) => res.json())
            .then((data) => setGroups(data));
        }
      });
    }
  }, [isConnected]);

  const addGroup = (group: GroupData) => {
    setGroups((groups) => [...groups, group]);
  };

  const createRemoveCurrent = (code: string) => () => {
    console.log('remove', code);
    fetch(`/api/groups/${code}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === code) {
          setGroups((groups) => groups.filter((group) => group.code !== code));
        }
      });
  };

  return (
    <div className="grid grid-cols-1 justify-items-center sm:grid-cols-flow-group gap-6 w-full">
      {groups &&
        groups.map((group, i) => (
          <GroupCard
            key={i}
            {...group}
            socket={socket}
            isAdmin={isAdmin}
            removeCurrent={createRemoveCurrent(group.code)}
          />
        ))}
      {!isAdmin && <AddGroupCard addGroup={addGroup} />}
    </div>
  );
};

export default GroupOverview;
