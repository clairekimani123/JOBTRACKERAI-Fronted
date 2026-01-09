import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Application } from '../types';
import { Plus, Search, Filter, Trash2, Edit, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Application[]>('/api/applications/');
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/applications/${id}/`);
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application. Please try again.');
    }
  };

  const filteredApplications = applications.filter(app => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      app.company_name?.toLowerCase().includes(searchLower) ||
      app.position_title?.toLowerCase().includes(searchLower) ||
      false;

    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-800 border border-blue-200',
      interview: 'bg-amber-100 text-amber-800 border border-amber-200',
      offer: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      withdrawn: 'bg-gray-100 text-gray-700 border border-gray-200',
    };

    return styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Applications</h1>
          <Link
            to="/applications/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Application
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-5 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Table / Empty State */}
        <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="text-gray-500 text-lg mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? "No applications match your filters"
                  : "You haven't added any job applications yet"}
              </p>
              <Link
                to="/applications/new"
                className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Application
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.company_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.position_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {app.applied_date ? new Date(app.applied_date).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {app.location || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/applications/${app.id}/edit`}
                            className="text-primary-600 hover:text-primary-800 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {applications.length > 0 && (
          <div className="mt-5 text-sm text-gray-600 text-right">
            Showing {filteredApplications.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApplicationsPage;