import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from './group/Card';

interface UserData {
  id: string;
  username: string;
}

const GroupView: React.FC = () => {
  const { groupCode } = useParams();
  const [data, setData] = React.useState<UserData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/groups/${groupCode}/students`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <div>
      {data.map((user) => (
        <Card onClick={() => navigate(`/docent/view/${user.id}`)} key={user.id}>
          <p>{user.username}</p>
        </Card>
      ))}
    </div>
  );
};

export default GroupView;
