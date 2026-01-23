// src/components/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

const Signup = ({ setIsAuthenticated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (name.trim() === '') {
      setError('Name is required');
      setLoading(false);
      return;
    }

    try {
      const signupRes = await axios.post('https://litshelf-server.onrender.com/api/auth/signup', { name, email, password });

      // Auto-login
      const loginRes = await axios.post('https://litshelf-server.onrender.com/api/auth/login', { email, password });

      console.log('FULL SIGNUP/AUTO-LOGIN RESPONSE:', JSON.stringify(loginRes.data, null, 2));

      const token = loginRes.data.Token || loginRes.data.token || loginRes.data.accessToken || null;
      const savedName = loginRes.data.Name || loginRes.data.name || name || email.split('@')[0];

      if (!token) {
        throw new Error('No token received after signup/login');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userName', savedName.trim());

      console.log('SAVED TOKEN (first 30 chars):', token.substring(0, 30) + '...');
      console.log('SAVED USERNAME:', savedName);

      window.dispatchEvent(new Event('localStorageChange'));
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      console.error('Signup/login error:', err);
      const msg =
        err.response?.data?.Message ||
        err.response?.data?.message ||
        err.message ||
        'Signup failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Create LitShelf Account</h2>
        </div>

        {error && <p className="text-red-500 text-center font-medium">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Full Name (e.g. G.vishnu)"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;