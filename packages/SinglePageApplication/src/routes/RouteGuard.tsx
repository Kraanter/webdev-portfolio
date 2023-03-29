import { UserData } from '@showcase/restapi/types';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { useStorage } from '../util/storage';
import DocentLayout from './wrappers/DocentLayout';
import EmptyWrapper from './wrappers/EmptyLayout';

interface RouteGuardProps {
  docent?: boolean;
  nonAuthenticated?: boolean;
  logout?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ nonAuthenticated = false, docent = false, logout = false }) => {
  const [, setUser, removeUser] = useStorage<undefined | UserData>('user', undefined, 'session');

  if (logout) {
    removeUser();
  } else {
    const { data, isLoading, error } = useSWR('/api/auth', fetcher('POST'));
    const isAuthenticated = !!data?.authenticated;
    const user = data?.decoded as UserData;
    console.log(isAuthenticated, nonAuthenticated, data);
    if (user) setUser(user);
    if (error) return <div>Error</div>;
    if (isLoading) return <div></div>;
    if (isAuthenticated === nonAuthenticated) return <Navigate to={nonAuthenticated ? '/docent' : '/login'} />;
  }

  const Wrapper = nonAuthenticated ? EmptyWrapper : DocentLayout;
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};

export default RouteGuard;
