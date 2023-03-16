import { GroupData } from '@showcase/restapi/types';
import React from 'react';
import AddGroupCard from './AddGroupCard';
import GroupCard from './GroupCard';

const GroupOverview: React.FC = () => {
  const [groups, setGroups] = React.useState<GroupData[]>([]);

  React.useEffect(() => {
    fetch('/api/groups')
      .then((res) => res.json())
      .then((data) => setGroups(data));
  }, []);

  const addGroup = (group: GroupData) => {
    setGroups((groups) => [...groups, group]);
  };

  return (
    <div className="grid grid-cols-1 justify-items-center sm:grid-cols-flow-group gap-6 w-full">
      {groups && groups.map((group, i) => <GroupCard key={i} {...group} />)}
      <AddGroupCard addGroup={addGroup} />
    </div>
  );
};

export default GroupOverview;
