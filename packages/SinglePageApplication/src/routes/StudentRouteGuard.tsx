import { AuthRepsonse } from '@showcase/restapi/types';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { useStorage } from '../util/storage';
import StudentWrapper from './wrappers/StudentWrapper';

interface StudentRouteGuardProps {
  nonAuthenticated?: boolean;
  logout?: boolean;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ nonAuthenticated = false, logout = false }) => {
  const [, setSession, removeSession] = useStorage('session_token', '', 'session');

  if (logout) {
    removeSession();
  } else {
    const { data, isLoading, error } = useSWR('/api/student/auth', fetcher('POST'));
    const responseData = data as AuthRepsonse;
    const isAuthenticated = !!responseData?.authenticated;

    console.log(isAuthenticated, nonAuthenticated, responseData);
    if (isAuthenticated) setSession(responseData.decoded.token);

    if (error) return <div>Error</div>;
    if (isLoading) return <div></div>;
    if (isAuthenticated === !nonAuthenticated)
      return <Navigate to={!nonAuthenticated ? '/student/login' : '/student'} />;
  }

  return (
    <StudentWrapper>
      <Outlet />
    </StudentWrapper>
  );
};

export default StudentRouteGuard;
