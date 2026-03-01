// src/components/Sidebar.jsx
import React from 'react';
import { Home, Search, List, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/lists', icon: List, label: 'My Lists' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

<aside className={`
  fixed lg:fixed
  top-16
  left-0
  h-[calc(100vh-4rem)]
  w-64
  bg-white dark:bg-gray-950
  border-r border-gray-200 dark:border-gray-800
  transition-transform duration-300
  z-30
  overflow-y-auto
  ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>
        <div className="flex flex-col h-full px-4 py-6">
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          <nav className="flex-1 space-y-1 mt-12 lg:mt-0">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${location.pathname === item.path
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;