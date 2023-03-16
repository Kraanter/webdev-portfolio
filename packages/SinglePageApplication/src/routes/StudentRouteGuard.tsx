import React from 'react';
import { Outlet } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import Login from '../components/student/login/Login';
import StudentWrapper from './wrappers/StudentWrapper';

const StudentRouteGuard: React.FC = () => {
  const { data, isLoading, error } = useSWR('/api/student/login', fetcher('POST'));

  if (error) return <div>Error</div>;
  if (isLoading) return <div></div>;
  if (!data?.authenticated) return <Login />;

  return (
    <StudentWrapper>
      <Outlet />
    </StudentWrapper>
  );
};

export default StudentRouteGuard;
