import React from 'react';
import { MapPin, Settings, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Real Estate AI</h1>
            <p className="text-xs text-blue-100">Growth Prediction Platform</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 font-medium transition-colors rounded-lg">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <a href="#" className="px-4 py-2 text-white hover:bg-white/10 font-medium transition-colors rounded-lg">
            Analytics
          </a>
          <a href="#" className="px-4 py-2 text-white hover:bg-white/10 font-medium transition-colors rounded-lg">
            Reports
          </a>
          <button className="flex items-center gap-2 p-2 ml-4 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
