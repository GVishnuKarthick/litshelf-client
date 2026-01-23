// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import ListsPage from './components/ListsPage';
import BookDetailPage from './components/BookDetailPage';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfilePage from './components/ProfilePage';

function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex min-h-screen">
        {/* Sidebar - starts below header on desktop */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main content - pushed down by header height */}
        <main className="flex-1 pt-16 lg:pt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleBookClick = (book) => {
    navigate('/book-detail', { state: { book } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />

        <Route
          path="*"
          element={
            isAuthenticated ? (
              <ProtectedLayout>
                <Routes>
                  <Route path="/" element={<HomePage onBookClick={handleBookClick} />} />
                 <Route path="/search" element={<SearchPage onBookClick={handleBookClick} />} />
             <Route path="/lists" element={<ListsPage onBookClick={handleBookClick} />} />
                  <Route path="/book-detail" element={<BookDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}