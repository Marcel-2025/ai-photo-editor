import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { SparklesIcon, GoogleIcon, FacebookIcon, CloseIcon } from './IconComponents';

interface LoginProps {
    onClose?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };
  
  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    login(`${provider} User`);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-[var(--background-secondary)] rounded-2xl shadow-2xl border border-[var(--border-primary)] relative animate-scale-in">
      <style>{`.animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; } @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full bg-[var(--background-secondary)] hover:bg-[var(--border-primary)]">
            <CloseIcon className="w-5 h-5" />
        </button>
      )}

      <div className="flex flex-col items-center">
        <SparklesIcon className="w-16 h-16 text-[var(--accent-primary)] mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] text-center">
          AI Photo Editor
        </h1>
        <p className="mt-2 text-center text-[var(--text-secondary)]">
          Sign in to start creating. New users get 300 free credits!
        </p>
      </div>
      
      <div className="space-y-4">
          <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[var(--border-secondary)] rounded-md text-sm font-medium text-[var(--text-primary)] bg-[var(--background-primary)] hover:bg-[var(--border-primary)] transition-colors"
          >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
          </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[var(--border-secondary)] rounded-md text-sm font-medium text-[var(--text-primary)] bg-[var(--background-primary)] hover:bg-[var(--border-primary)] transition-colors"
          >
              <FacebookIcon className="w-5 h-5" />
              Continue with Facebook
          </button>
      </div>

      <div className="flex items-center justify-center space-x-2">
          <hr className="w-full border-t border-[var(--border-secondary)]" />
          <span className="text-xs text-[var(--text-secondary)] uppercase">OR</span>
          <hr className="w-full border-t border-[var(--border-secondary)]" />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
  );
};
