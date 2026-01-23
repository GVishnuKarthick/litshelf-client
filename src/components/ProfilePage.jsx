import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Reader');
  const [userEmail, setUserEmail] = useState('Not available');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Reader';
    setUserName(name);

    // If you save email during login/signup, fetch it here
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Your Profile
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {userName
              .split(/[\s.]+/)
              .filter(Boolean)
              .map(p => p[0])
              .join('')
              .toUpperCase()
              .substring(0, 2) || 'U'}
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {userName}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <button
            onClick={handleLogout}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;