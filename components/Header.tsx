import React from 'react';
import { BookmarkIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  onShowSaved: () => void;
  savedCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowSaved, savedCount, theme, toggleTheme }) => {
  return (
    <header className="flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          br-Palette AI
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg)] focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-400'
          }`}
        >
          <span className="sr-only">Use {theme === 'light' ? 'dark' : 'light'} theme</span>
          <span
              className={`pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                  theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
              }`}
          >
              <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${
                      theme === 'dark' ? 'opacity-0' : 'opacity-100'
                  }`}
                  aria-hidden="true"
              >
                  <SunIcon className="h-5 w-5 text-yellow-500" />
              </span>
              <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-out ${
                      theme === 'dark' ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
              >
                  <MoonIcon className="h-5 w-5 text-gray-700" />
              </span>
          </span>
        </button>
        <button 
          onClick={onShowSaved} 
          className="relative flex items-center gap-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          <BookmarkIcon />
          <span className="hidden sm:inline">Saved</span>
          {savedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[var(--bg)]">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;