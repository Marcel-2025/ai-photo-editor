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
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--background-secondary)] rounded-2xl shadow-2xl border border-[var(--border-primary)]">
        <div className="flex flex-col items-center">
          <SparklesIcon className="w-16 h-16 text-[var(--accent-primary)] mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] text-center">
            AI Photo Editor
          </h1>
          <p className="mt-2 text-center text-[var(--text-secondary)]">
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
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-[var(--border-secondary)] bg-[var(--background-primary)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] focus:z-10 sm:text-sm"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] focus:ring-[var(--accent-primary)]"
            >
              Sign in or Create Account
            </button>
          </div>
        </form>
         <div className="text-center text-xs text-[var(--text-secondary)]/80 mt-6">
            <p>This is a demo application. No password is required.</p>
            <p>Account data is stored in your browser's local storage.</p>
        </div>
      </div>
    </div>
  );
};