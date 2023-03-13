import React from 'react';

interface EmptyWrapperProps {
  children: React.ReactNode;
}

const EmptyWrapper: React.FC<EmptyWrapperProps> = ({ children }) => <div>{children}</div>;

export default EmptyWrapper;