import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../../util/debounce';
import { checkForm } from './checks';

const DEBOUNCE_TIME = 50;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyArrow = () => {};

export interface LoginFormData {
  username: string;
  password: string;
}

interface LoginInputProps {
  setFormData: (data: LoginFormData) => void;
  isRegister: boolean;
  setError: (error: string) => void;
}

export const LoginInput: React.FC<LoginInputProps> = ({ setFormData, isRegister, setError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [value, setValue] = useState<LoginFormData>({ username: '', password: '' });
  const debouncedValue = useDebounce(value, DEBOUNCE_TIME);

  useEffect(() => {
    setFormData(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (isRegister) {
      const error = checkForm(username, password, password2, isRegister);
      if (error) {
        setError(error);
        if (value.password !== '' || value.username !== '') setValue({ username: '', password: '' });
        return;
      }
    }
    setError('');
    setValue({ username, password });
  }, [password, password2, username]);

  return (
    <div className="w-full mb-2">
      <div className="flex flex-col gap-1 items-center">
        <NameInput setUsername={setUsername} />
        <PasswordInput isRegister={isRegister} setPassword={setPassword} setPassword2={setPassword2} />
      </div>
    </div>
  );
};

interface PasswordInputProps {
  isRegister?: boolean;
  setPassword: (password: string) => void;
  setPassword2?: (password: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  isRegister = false,
  setPassword,
  setPassword2 = emptyArrow,
}) => {
  return (
    <div className="w-full mb-2">
      <div className="flex flex-col gap-1 items-center">
        <PassField setPassword={setPassword} />
        {isRegister && <PassField placeholder="Herhaal Wachtwoord" setPassword={setPassword2} />}
      </div>
    </div>
  );
};

interface PassFieldProps {
  setPassword: (password: string) => void;
  placeholder?: string;
}

const PassField: React.FC<PassFieldProps> = ({ setPassword, placeholder }) => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, DEBOUNCE_TIME);

  useEffect(() => {
    setPassword(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="flex w-full gap-5 items-center justify-between">
      <input
        type={show ? 'text' : 'password'}
        name="password"
        onChange={(e) => setValue(e.target.value.replace(/\s+/g, ' ').trim())}
        placeholder={placeholder || 'Wachtwoord'}
        className="
          w-4/5
          border
          rounded
          px-3
          py-2
          text-gray-700
          focus:outline-none
        "
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="bg-gray-700 text-white rounded-xl py-2 w-1/6 focus:outline-none hover:bg-gray-400"
        tabIndex={-1}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

interface NameInputProps {
  setUsername: (username: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ setUsername }) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, DEBOUNCE_TIME);
  useEffect(() => {
    setUsername(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="flex w-full gap-5 items-center justify-between">
      <input
        type="text"
        name="username"
        onChange={(e) => setValue(e.target.value.replace(/\s+/g, ' ').trim())}
        placeholder="Naam"
        className="
          w-full
          border
          rounded
          px-3
          py-2
          text-gray-700
          focus:outline-none
        "
      />
    </div>
  );
};
