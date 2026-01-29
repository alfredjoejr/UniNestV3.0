import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Building, Search, Hammer, LogIn, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? "text-indigo-600 font-semibold" : "text-gray-500 hover:text-indigo-500";
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">UniNest</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm ${isActive('/')}`}>
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <Link to="/explore" className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm ${isActive('/explore')}`}>
              <Search className="w-4 h-4 mr-1" />
              Find Housing
            </Link>
            <Link to="/roommates" className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm ${isActive('/roommates')}`}>
              <Users className="w-4 h-4 mr-1" />
              Roommates
            </Link>
            <Link to="/coming-soon" className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm ${isActive('/coming-soon')}`}>
              <Hammer className="w-4 h-4 mr-1" />
              Coming Soon
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-sm focus:outline-none"
                >
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                  />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium text-sm">
                  Log in
                </Link>
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 pb-4">
          {!user && (
            <div className="p-4 flex flex-col gap-3 border-b border-gray-100 mb-2">
               <Link to="/login" className="w-full text-center py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">Log In</Link>
               <Link to="/signup" className="w-full text-center py-2 bg-indigo-600 text-white rounded-lg font-medium">Sign Up</Link>
            </div>
          )}
          {user && (
            <div className="p-4 border-b border-gray-100 mb-2 flex items-center gap-3">
               <img src={user.avatar} className="w-10 h-10 rounded-full" alt="User" />
               <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
               </div>
               <Link to="/dashboard" className="ml-auto text-indigo-600 text-sm font-medium">Dashboard</Link>
            </div>
          )}
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden border-t border-gray-100 flex justify-around p-2 bg-white fixed bottom-0 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <Link to="/" className="flex flex-col items-center p-2 text-xs text-gray-600">
           <Home className="w-5 h-5 mb-1" /> Home
        </Link>
        <Link to="/explore" className="flex flex-col items-center p-2 text-xs text-gray-600">
           <Search className="w-5 h-5 mb-1" /> Search
        </Link>
        <Link to="/roommates" className="flex flex-col items-center p-2 text-xs text-gray-600">
           <Users className="w-5 h-5 mb-1" /> Roomies
        </Link>
         {user ? (
            <Link to="/dashboard" className="flex flex-col items-center p-2 text-xs text-indigo-600">
              <img src={user.avatar} className="w-5 h-5 mb-1 rounded-full" alt="Profile"/> Me
            </Link>
         ) : (
             <Link to="/login" className="flex flex-col items-center p-2 text-xs text-gray-600">
               <LogIn className="w-5 h-5 mb-1" /> Login
            </Link>
         )}
      </div>
    </nav>
  );
};

export default Navbar;