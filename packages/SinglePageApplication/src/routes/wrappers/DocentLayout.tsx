import { UserData } from '@showcase/restapi/types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../util/storage';
import { capitalizeFirstLetter } from '../../util/string';

interface DocentLayoutProps {
  children: React.ReactNode;
}

const DocentLayout: React.FC<DocentLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

const Navbar = () => {
  const [getUser] = useStorage<UserData | undefined>('user', undefined, 'session');
  const user = getUser();
  const navigator = useNavigate();
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            className="w-10 h-10 text-white p-2 bg-green-500 rounded-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
          <span className="ml-3 text-xl">Mijn Groepen</span>
        </a>
        <button
          onClick={() => navigator('/logout')}
          className="inline-flex ml-auto items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
        >
          Hallo, {capitalizeFirstLetter(user?.username ?? 'Docent')}
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
          <img src={`https://api.dicebear.com/5.x/pixel-art/svg?seed=${user?.username}`} className="h-8 w-8" />
        </button>
      </div>
    </header>
  );
};
export default DocentLayout;
