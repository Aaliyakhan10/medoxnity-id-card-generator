import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                M
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Medoxnity <span className="text-blue-600 font-light">ID Gen</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' || location.pathname.startsWith('/edit') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create</span>
            </Link>
            <Link 
              to="/history" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/history' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
