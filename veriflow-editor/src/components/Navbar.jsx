import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-600 border-b-2 border-brand-600 pb-1'
        : 'text-gray-600 hover:text-brand-600'
    }`;

  const mobileActiveLinkClass = ({ isActive }) =>
    `block px-4 py-2 text-base font-medium rounded-md ${
      isActive
        ? 'text-brand-700 bg-brand-50'
        : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
    }`;

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold shadow-sm">
                V
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">VeriFlow</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/dashboard" className={activeLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/submissions" className={activeLinkClass}>
              Submissions
            </NavLink>
          </div>

          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 hover:bg-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
              >
                <span className="font-semibold">{firstLetter}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/dashboard" className={mobileActiveLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/submissions" className={mobileActiveLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Submissions
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold">
                  {firstLetter}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
