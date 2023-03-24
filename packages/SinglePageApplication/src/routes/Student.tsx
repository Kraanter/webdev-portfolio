import React, { useRef } from 'react';
import Stream from '../components/student/browser/Stream';

const Student: React.FC = () => {
  const ref = useRef(null);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <div ref={ref} id="wrap" className="h-full w-full p-0 m-0">
        <Stream />
      </div>
    </div>
  );
};

export default Student;
