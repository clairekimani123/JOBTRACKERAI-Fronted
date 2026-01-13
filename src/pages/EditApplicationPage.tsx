import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { Save, X, Loader2 } from 'lucide-react';
import type { Application } from '../types';

const EditApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Grabs the ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    job_description: '',
    status: 'applied',
    applied_date: '',
    location: '',
    salary_range: '',
    job_url: '',
    notes: '',
  });

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await api.get<Application>(`/api/applications/${id}/`);
        const data = response.data;
        
        // Populate the form with existing data
        setFormData({
          company_name: data.company_name || '',
          position_title: data.position_title || '',
          job_description: data.job_description || '',
          status: data.status || 'applied',
          applied_date: data.applied_date ? data.applied_date.split('T')[0] : '',
          location: data.location || '',
          salary_range: data.salary_range || '',
          job_url: data.job_url || '',
          notes: data.notes || '',
        });
      } catch (error) {
        console.error('Error fetching application:', error);
        alert('Could not find this application.');
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/applications/${id}/`, formData);
      navigate('/applications');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-500">Loading application details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
          <button onClick={() => navigate('/applications')} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input name="company_name" value={formData.company_name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input name="position_title" value={formData.position_title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/applications')} className="px-6 py-2 border rounded-md text-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded-md flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Update Application'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditApplicationPage;