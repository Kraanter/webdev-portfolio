import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import DocentLayout from './wrappers/DocentLayout';
import EmptyWrapper from './wrappers/EmptyLayout';

interface RouteGuardProps {
  docent?: boolean;
  authenticated?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ authenticated = false, docent = false }) => {
  const { data, isLoading, error } = useSWR('/api/auth', fetcher('POST'));

  const isAuthenticated = !!data?.authenticated;

  const Wrapper = docent ? DocentLayout : EmptyWrapper;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (isAuthenticated !== authenticated) return <Navigate to={authenticated ? '/login' : '/docent'} />;
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};


export default RouteGuard;