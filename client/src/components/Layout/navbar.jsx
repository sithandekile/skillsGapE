import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white mb-20 shadow-lg [font-family:'Inter',sans-serif]  fixed left-0 right-0 top-0 z-100">
      <div className=" max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/"
             className="text-3xl font-bold  text-[#0F172A] tracking-tight">
              <span className="text-[#14b8c4]">Skills</span>GapEqualizer
            </Link>


            {/* <div className="ml-10 flex items-baseline space-x-4 a:active-[#14B8C4]">
              <NavLink 
                to="/problems" 
                className={`px-3 py-2 rounded-md text-lg font-medium ${
                  location.pathname === '/problems' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Problems
              </NavLink> */}
              {user?.role === 'employer' && (
                <NavLink 
                  to="/post-problem" 
                  className={`px-3 py-2 rounded-md text-lg font-medium ${
                    location.pathname === '/post-problem' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Post Problem
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NavLink to="/problems" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </NavLink>
                <span className="text-gray-700 rounded-full bg-gray-200 px-3 py-1">
                  {user.username.charAt(0).toUpperCase() }
                </span>
                <button 
                  onClick={logout}
                  className="btn-secondary text-lg"
                >
                  Logout
                </button>
              </>
            ) : (
                <NavLink to="/login" className="text-gray-700 text-lg hover:text-primary-600">
                  Login
                </NavLink> 
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
