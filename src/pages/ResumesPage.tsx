import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import type { Resume } from '../types';
import { Upload, FileText, Trash2, Eye, AlertCircle } from 'lucide-react';

const ResumesPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Resume[]>('/api/resumes/');
      setResumes(response.data);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size exceeds 10MB limit');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchResumes();
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // reset input
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await api.delete(`/api/resumes/${id}/`);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume');
    }
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Resumes</h1>

          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <span
              className={`inline-flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${
                uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
              }`}
            >
              <Upload className="w-5 h-5 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
           
            <span>{error}</span>
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6">Upload your first resume to start using AI matching</p>
            <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="px-6 py-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FileText className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {resume.original_filename}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1 space-x-3">
                        <span>
                          Uploaded:{' '}
                          {new Date(resume.uploaded_at).toLocaleDateString('en-GB')}
                        </span>
                        {resume.extracted_text && (
                          <span className="text-green-600">
                            ✓ Text extracted ({resume.extracted_text.length.toLocaleString()} chars)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={resume.file_path || `http://localhost:8000/${resume.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="View/Download"
                    >
                      <Eye className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumesPage;