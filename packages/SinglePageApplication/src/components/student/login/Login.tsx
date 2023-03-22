import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchStudent } from '../../../logic/login';
import { useStorage } from '../../../util/storage';

const Login: React.FC = () => {
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({ username: '', code: '' });
  const [getSession] = useStorage('session', '', 'session');
  const navigate = useNavigate();

  if (getSession() !== '') return <Navigate replace to="/student" />;

  React.useEffect(() => {
    if (error === '') return;
    const timeout = setTimeout(() => {
      setError('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [error]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error !== '' && error !== 'Fill all fields') return;
    if (formData.username === '' || formData.code === '') {
      setError('Vul alle velden in');
      return;
    }
    if (formData.code.length !== 4) {
      setError('Code moet 4 karakters lang zijn');
      return;
    }
    if (formData.username.length < 3) {
      setError('Naam moet minimaal 3 karakters lang zijn');
      return;
    }
    const response = await fetchStudent(formData);
    if (!response) {
      setError('De ingevoerde code bestaat niet');
      return;
    }
    setError('');
    navigate('/student');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-yellow-100">
      <div className="w-full md:w-2/3 xl:w-1/3 rounded-lg">
        <div className="flex font-bold justify-center mt-6">
          <h1 className="mb-12 font-bold text-8xl">Student Login</h1>
        </div>
        <form onSubmit={onSubmit} className="px-12 pb-10">
          <input
            type="text"
            placeholder="Name"
            minLength={3}
            className="w-full text-center font-bold text-6xl px-4 py-2 mt-4 rounded-md bg-gray-100 focus:outline-none"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="Code"
            className="w-full text-center font-extrabold text-6xl px-4 py-2 mt-4 rounded-md bg-gray-100 focus:outline-none"
            maxLength={4}
            minLength={4}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <p className="text-red-500 font-semibold text-center">{error}</p>
          <button
            type="submit"
            className="w-full text-3xl font-semibold py-2 mt-8 rounded-full bg-orange-400 text-white focus:outline-none hover:bg-orange-500"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
