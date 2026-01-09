import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, LayoutDashboard, FileText, Upload, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/applications', label: 'Applications', icon: FileText },
    { path: '/resumes', label: 'Resumes', icon: Upload },
    { path: '/ai-match', label: 'AI Match', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">JobTrackAI</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                        isActive(link.path)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user?.full_name}</span>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-red-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;