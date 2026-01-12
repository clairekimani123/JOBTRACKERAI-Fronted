import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Application, ApplicationStats } from '../types';
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  LogOut,
  FileText,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0, // added for completeness
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, appsRes] = await Promise.all([
        api.get<ApplicationStats>('/api/applications/stats/summary'),
        api.get<Application[]>('/api/applications/?limit=5&ordering=-applied_date'),
      ]);

      setStats(statsRes.data);
      setRecentApplications(appsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const styles: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-800 border border-blue-200',
      interview: 'bg-amber-100 text-amber-800 border border-amber-200',
      offer: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      withdrawn: 'bg-gray-100 text-gray-700 border border-gray-200',
    };

    return styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">JobTrackAI</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <Link to="/applications" className="text-gray-700 hover:text-primary-600 font-medium">
                  Applications
                </Link>
                <Link to="/resumes" className="text-gray-700 hover:text-primary-600 font-medium">
                  Resumes
                </Link>
                <Link
                  to="/ai-match"
                  className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Match
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.full_name || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="mt-2 text-gray-600">Track and optimize your job search journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<Briefcase className="h-7 w-7 text-primary-600" />}
            bgColor="bg-primary-50"
          />
          <StatCard
            title="Interviews"
            value={stats.interview}
            icon={<Clock className="h-7 w-7 text-amber-600" />}
            bgColor="bg-amber-50"
            textColor="text-amber-700"
          />
          <StatCard
            title="Offers"
            value={stats.offer}
            icon={<CheckCircle className="h-7 w-7 text-green-600" />}
            bgColor="bg-green-50"
            textColor="text-green-700"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle className="h-7 w-7 text-red-600" />}
            bgColor="bg-red-50"
            textColor="text-red-700"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <QuickActionCard
            to="/applications/new"
            title="New Application"
            icon={<Plus className="h-7 w-7" />}
            bgClass="bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
          />
          <QuickActionCard
            to="/resumes"
            title="Manage Resumes"
            icon={<FileText className="h-7 w-7" />}
            bgClass="bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50"
            textColor="text-primary-700"
          />
          <QuickActionCard
            to="/ai-match"
            title="AI Match"
            icon={<Sparkles className="h-7 w-7" />}
            bgClass="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          />
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          </div>

          {recentApplications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">No applications yet</p>
              <Link
                to="/applications/new"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add your first application
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentApplications.map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {app.position_title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">{app.company_name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {app.applied_date
                          ? new Date(app.applied_date).toLocaleDateString('en-GB')
                          : 'Date unknown'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeStyle(
                        app.status
                      )}`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Extracted components for better readability

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
};

const StatCard = ({ title, value, icon, bgColor, textColor = 'text-gray-900' }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
      </div>
      <div className={`rounded-full p-3 ${bgColor}`}>{icon}</div>
    </div>
  </div>
);

type QuickActionProps = {
  to: string;
  title: string;
  icon: React.ReactNode;
  bgClass: string;
  textColor?: string;
};

const QuickActionCard = ({ to, title, icon, bgClass, textColor = 'text-white' }: QuickActionProps) => (
  <Link
    to={to}
    className={`rounded-xl shadow p-6 flex flex-col items-center justify-center gap-4 text-center transition-all ${bgClass} ${textColor}`}
  >
    <div className="opacity-90">{icon}</div>
    <span className="font-medium text-lg">{title}</span>
  </Link>
);

export default DashboardPage;