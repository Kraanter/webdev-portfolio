import React from 'react';
import Navbar from '../../components/wrapper/Navbar';

interface DocentLayoutProps {
  children: React.ReactNode;
}

const DocentLayout: React.FC<DocentLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="">{children}</div>
    </>
  );
};

export default DocentLayout;
