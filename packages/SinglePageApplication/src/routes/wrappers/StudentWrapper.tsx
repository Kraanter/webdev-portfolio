import React from 'react';

interface StudentWrapperProps {
  children: React.ReactNode;
}

const StudentWrapper: React.FC<StudentWrapperProps> = ({ children }) => {
  return (
    <>
      <div>StudentWrapper</div>
      {children}
    </>
  );
};

export default StudentWrapper;
