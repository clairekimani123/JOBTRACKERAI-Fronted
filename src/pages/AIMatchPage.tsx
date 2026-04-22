import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import type { Application, Resume, AIAnalysis } from '../types';
import { Sparkles, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

// ── Circular progress ring ──────────────────────────────────────────────────
const CircularScore: React.FC<{ score: number }> = ({ score }) => {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';

  const label =
    score >= 75
      ? 'Excellent Match!'
      : score >= 50
      ? 'Good Match'
      : 'Needs Tailoring';

  return (
    <div className="flex flex-col items-center gap-3">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fontWeight="bold"
          fill={color}
        >
          {Math.round(score)}%
        </text>
      </svg>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const AIMatchPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedApp, setSelectedApp] = useState<number | ''>('');
  const [selectedResume, setSelectedResume] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState('');

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
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedApp || !selectedResume) {
      setError('Please select both an application and a resume.');
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await api.post<AIAnalysis>('/api/ai/match', {
        application_id: selectedApp,
        resume_id: selectedResume,
      });
      setResult(response.data);
    } catch (err) {
      console.error('Error running AI match:', err);
      setError('Failed to analyze match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Build table rows by zipping strengths and missing_skills
  const tableRows = () => {
    const strengths = result?.strengths || [];
    const missing = result?.missing_skills || [];
    const maxLen = Math.max(strengths.length, missing.length);
    return Array.from({ length: maxLen }, (_, i) => ({
      strength: strengths[i] || null,
      missing: missing[i] || null,
    }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
            <Sparkles className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Resume Matcher</h1>
          <p className="text-gray-500 text-base">
            Select a job application and resume to see how well they match
          </p>
        </div>

        {/* Selectors */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Application
              </label>
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(Number(e.target.value) || '')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(Number(e.target.value) || '')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedApp || !selectedResume}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white
                         font-semibold rounded-lg shadow hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing your resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Run AI Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* Score Section */}
            <div className="flex flex-col items-center py-10 px-6 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">
                Match Score
              </p>
              <CircularScore score={result.match_score} />
            </div>

            {/* ── Strengths & Missing Skills TABLE ── */}
            <div className="p-10 border-b border-gray-100">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {/* Strengths header */}
                    <th className="w-1/2 pb-3 text-left">
                      <span className="inline-flex items-center gap-2 text-base font-semibold text-green-700">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Strengths
                      </span>
                    </th>
                    {/* Missing Skills header */}
                    <th className="w-1/2 pb-3 text-left pl-4 border-l border-gray-200">
                      <span className="inline-flex items-center gap-2 text-base font-semibold text-amber-700">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        Missing Skills
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows().length > 0 ? (
                    tableRows().map((row, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        {/* Strength cell */}
                        <td className="py-2.5 pr-4 align-top text-gray-700">
                          {row.strength ? (
                            <span className="flex items-start gap-2">
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                              {row.strength}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        {/* Missing skill cell */}
                        <td className="py-2.5 pl-4 align-top text-gray-700 border-l border-gray-200">
                          {row.missing ? (
                            <span className="flex items-start gap-2">
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                              {row.missing}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-gray-400 italic">
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Recommendation */}
            <div className="p-15 bg-blue-50">
              <h3 className="flex items-center gap-2 text-base font-semibold text-blue-800 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Recommendation
              </h3>
              <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-line">
                {result.recommendation}
              </p>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIMatchPage;