import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600">
              SkillGapEqualizer
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/problems" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/problems' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Problems
              </Link>
              {user?.role === 'employer' && (
                <Link 
                  to="/post-problem" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/post-problem' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Post Problem
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <span className="text-gray-700">Welcome, {user.username}</span>
                <button 
                  onClick={logout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;