import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { Save, X } from 'lucide-react';

const AddApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    job_description: '',
    status: 'applied' as const,
    applied_date: new Date().toISOString().split('T')[0],
    follow_up_date: '',
    notes: '',
    job_url: '',
    salary_range: '',
    location: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/applications/', formData);
      navigate('/applications');
    } catch (error) {
      console.error('Error creating application:', error);
      alert('Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Application</h1>
          <button
            onClick={() => navigate('/applications')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="position_title" className="block text-sm font-medium text-gray-700 mb-1">
                Position Title *
              </label>
              <input
                type="text"
                id="position_title"
                name="position_title"
                value={formData.position_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label htmlFor="applied_date" className="block text-sm font-medium text-gray-700 mb-1">
                Applied Date *
              </label>
              <input
                type="date"
                id="applied_date"
                name="applied_date"
                value={formData.applied_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g. $80k - $120k"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="job_url" className="block text-sm font-medium text-gray-700 mb-1">
              Job URL
            </label>
            <input
              type="url"
              id="job_url"
              name="job_url"
              value={formData.job_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="job_description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              id="job_description"
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes, contacts, follow-ups, etc."
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Application'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/applications')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddApplicationPage;