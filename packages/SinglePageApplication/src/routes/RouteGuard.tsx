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
  authenticated?: boolean;
  logout?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ authenticated = false, docent = false, logout = false }) => {
  const [, setUser, removeUser] = useStorage<undefined | UserData>('user', undefined, 'session');

  if (logout) {
    removeUser();
  } else {
    const { data, isLoading, error } = useSWR('/api/auth', fetcher('POST'));
    const isAuthenticated = !!data?.authenticated;
    const user = data?.decoded as UserData;
    if (user) setUser(user);
    if (error) return <div>Error</div>;
    if (isLoading) return <div></div>;
    if (isAuthenticated !== authenticated) return <Navigate to={authenticated ? '/login' : '/docent'} />;
  }

  const Wrapper = docent ? DocentLayout : EmptyWrapper;
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};

export default RouteGuard;
