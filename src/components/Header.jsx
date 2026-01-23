// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, BookOpen, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';   // ← make sure path is correct
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();    // ← now using toggleTheme
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState('Reader');
  const [initials, setInitials] = useState('U');

  useEffect(() => {
    const updateUser = () => {
      const name = localStorage.getItem('userName') || 'Reader';
      setUserName(name);

      const parts = name.trim().split(/[\s.]+/).filter(Boolean);
      let init = '';
      if (parts.length >= 2) {
        init = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (parts.length === 1 && parts[0].length >= 2) {
        init = parts[0].substring(0, 2).toUpperCase();
      } else if (parts.length === 1) {
        init = (parts[0][0] + parts[0][0]).toUpperCase();
      }
      setInitials(init || 'U');
    };

    updateUser();

    const handleStorage = (e) => {
      if (e.key === 'userName' || e.key === 'token') updateUser();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('localStorageChange', updateUser);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('localStorageChange', updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-emerald-500" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                LitShelf
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-transform cursor-pointer shadow-md"
                title={userName}
              >
                {initials}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {userName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Logged in</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full px-5 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                    >
                      <User className="w-5 h-5" />
                      View Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;