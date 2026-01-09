import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { Application, Resume, AIAnalysis } from '../types';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const AIMatchPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedApp, setSelectedApp] = useState<number | ''>('');
  const [selectedResume, setSelectedResume] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysis | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, resumesRes] = await Promise.all([
        api.get('/api/applications/'),
        api.get('/api/resumes/'),
      ]);

      setApplications(appsRes.data);
      setResumes(resumesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedApp || !selectedResume) {
      alert('Please select both an application and a resume');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post<AIAnalysis>('/api/ai/match', {
        application_id: selectedApp,
        resume_id: selectedResume,
      });

      setResult(response.data);
    } catch (error) {
      console.error('Error running AI match:', error);
      alert('Failed to analyze match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Resume Matcher</h1>
          <p className="text-gray-600">Find out how well your resume matches the job</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Application Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Job Application
            </label>
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(Number(e.target.value) || '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={loading}
            >
              <option value="">Choose an application...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.position_title} — {app.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* Resume Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resume
            </label>
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(Number(e.target.value) || '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={loading}
            >
              <option value="">Choose a resume...</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.original_filename || `Resume ${resume.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading || !selectedApp || !selectedResume}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white 
                     font-medium rounded-md shadow hover:bg-primary-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Run AI Analysis
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="mt-12 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            {/* Match Score Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-10 text-white text-center">
              <div className="text-6xl font-bold mb-2">
                {Math.round(result.match_score)}%
              </div>
              <div className="text-xl font-medium">
                {result.match_score >= 75
                  ? 'Excellent Match!'
                  : result.match_score >= 50
                  ? 'Good Match – Some Improvements Possible'
                  : 'Needs Tailoring'}
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Strengths
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {result.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
                  Missing Skills
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {result.missing_skills.map((skill, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-3 mt-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recommendation
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {result.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIMatchPage;