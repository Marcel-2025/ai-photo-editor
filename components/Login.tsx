import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { SparklesIcon } from './IconComponents';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
          <SparklesIcon className="w-16 h-16 text-blue-400 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-white text-center">
            AI Photo Editor
          </h1>
          <p className="mt-2 text-center text-gray-400">
            Sign in to start creating. New users get 300 free credits!
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            >
              Sign in or Create Account
            </button>
          </div>
        </form>
         <div className="text-center text-xs text-gray-500 mt-6">
            <p>This is a demo application. No password is required.</p>
            <p>Account data is stored in your browser's local storage.</p>
        </div>
      </div>
    </div>
  );
};
