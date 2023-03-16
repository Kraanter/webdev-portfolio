import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStorage } from '../util/storage';
import StudentWrapper from './wrappers/StudentWrapper';

const StudentRouteGuard: React.FC = () => {
  const [getSession] = useStorage('session', '', 'session');

  if (!getSession()) return <Navigate replace to="/student/login" />;

  return (
    <StudentWrapper>
      <Outlet />
    </StudentWrapper>
  );
};

export default StudentRouteGuard;
