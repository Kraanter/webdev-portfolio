import { GroupData } from '@showcase/restapi/types';
import React from 'react';
import { addGroupToDatabase } from '../../../api/fetcher';
import { classNames } from '../../../util/extra';
import Card from './Card';

interface AddGroupCardProps {
  addGroup: (group: GroupData) => void;
}

const AddGroupCard: React.FC<AddGroupCardProps> = ({ addGroup }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const createGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const rawName = formData.get('name') as string;
    // truncate double spaces
    const name = rawName.replace(/\s+/g, ' ').trim();

    if (!name || name.length < 4 || name.length > 25) {
      setError('Groepsnaam moet tussen de 4 en 25 karakters lang zijn');
      return;
    }

    const group = await addGroupToDatabase(name);
    if (!group || 'error' in group) {
      setError('Er is iets fout gegaan');
      return;
    }

    addGroup(group);
    setIsOpen(false);
    setError('');
  };

  const Back = (
    <>
      <form onSubmit={createGroup} className="flex flex-col w-full px-7">
        <div>
          <label className="text-xl font-bold text-gray-900">Group Name</label>
          <input
            name="name"
            className="border border-gray-200 rounded-md w-full p-2"
            type="text"
            // Clear input field after submit because of e.currentTarget.reset() not working in form onSubmit
            onSubmit={({ currentTarget }) => (currentTarget.value = '')}
            minLength={4}
            maxLength={25}
          />
          <p className="text-red-500 font-mono text-xs h-7">{error}</p>
        </div>
        <button
          type="submit"
          className={classNames(error === '' ? 'bg-green-400' : 'bg-red-500', 'text-white rounded-md p-2 mt-2')}
        >
          Add Group
        </button>
      </form>
    </>
  );

  const children = isOpen ? Back : Front;

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card onClick={isOpen ? undefined : onClick} className="border-8 border-green-400 border-opacity-50 border-dashed">
      {children}
    </Card>
  );
};

const Front = (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-40 h-40 rounded-full text-black"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
    <h3 className="text-2xl font-bold text-gray-900">Add Group</h3>
  </>
);

export default AddGroupCard;
