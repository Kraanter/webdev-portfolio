import { AuthRepsonse } from '@showcase/restapi/types';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { useStorage } from '../util/storage';
import EmptyWrapper from './wrappers/EmptyLayout';
import StudentWrapper from './wrappers/StudentWrapper';

interface StudentRouteGuardProps {
  nonAuthenticated?: boolean;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ nonAuthenticated = false }) => {
  const [, setSession] = useStorage('session_token', '', 'session');

  const { data, isLoading, error } = useSWR('/api/student/auth', fetcher('POST'));
  const responseData = data as AuthRepsonse;
  const isAuthenticated = !!responseData?.authenticated;

  if (isAuthenticated) setSession(responseData.decoded.token);
  if (error) return <div>Error</div>;
  if (isLoading) return <div></div>;
  if (isAuthenticated === nonAuthenticated) return <Navigate to={nonAuthenticated ? '/student' : '/student/login'} />;

  const Wrapper = nonAuthenticated ? EmptyWrapper : StudentWrapper;

  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};

export default StudentRouteGuard;
