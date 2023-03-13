import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessages } from '../components/login/checks';
import { LoginFormData, LoginInput } from '../components/login/Fields';
import { useStorage } from '../hooks/storage';
import { login } from '../logic/login';

interface LoginProps {
  register?: boolean;
  logout?: boolean;
}

const Login: React.FC<LoginProps> = ({ register = false, logout = false }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(register);
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [error, setError] = useState('');
  const [, setToken] = useStorage('token', '', 'local');
  const type = isRegister ? 'Register' : 'Login';

  useEffect(() => {
    if (logout) {
      const logout = async () => {
        const test = await fetch('/api/logout', {
          method: 'GET',
        });
        if (test.status !== 200) {
          console.log('error', test);
          return;
        }
        setToken('');
        navigate('/login');
      };
      logout();
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error !== '' && error !== ErrorMessages.FillAll) return;
    if (formData.username === '' || formData.password === '') {
      setError(ErrorMessages.FillAll);
      return;
    }
    setError('');

    const success = await login(formData);

    if (success) {
      navigate('/');
      return;
    }
    setError(
      isRegister ? `Gebruiker: '${formData.username}' bestaat al` : 'Gebruikersnaam of wachtwoord is onjuist ingevoerd.'
    );
  };

  const goToRegister = () => {
    setIsRegister(true);
    navigate('/register');
  };

  const goToLogin = () => {
    setIsRegister(false);
    navigate('/login');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-indigo-100">
      <div className="w-full md:w-2/3 xl:w-1/3 rounded-lg">
        <div className="flex font-bold justify-center mt-6">
          <h1 className="mb-5 text-5xl">Docent {type}</h1>
        </div>
        <h2 className="text-2xl text-center text-gray-200 mb-8">{type}</h2>
        <form onSubmit={onSubmit} className="px-12 pb-10">
          <LoginInput isRegister={isRegister} setFormData={setFormData} setError={setError} />
          <p className="text-red-500 font-semibold text-center">{error}</p>
          <button
            type="submit"
            className="w-full py-2 mt-8 rounded-full bg-blue-400 text-gray-100 focus:outline-none hover:bg-blue-500"
          >
            {type}
          </button>
        </form>
        {isRegister ? (
          <p className="text-center">
            Al een account?{' '}
            <span className="font-semibold underline cursor-pointer hover:text-blue-700" onClick={goToLogin}>
              Ga naar de login pagina
            </span>
          </p>
        ) : (
          <p className="text-center">
            Nog geen account?{' '}
            <span className="font-semibold underline cursor-pointer hover:text-blue-700" onClick={goToRegister}>
              Ga naar de registratie pagina
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
