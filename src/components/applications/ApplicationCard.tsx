import React from 'react';
import { Link } from 'react-router-dom';
import type { Application } from '../../types';
import { formatDate, getStatusColor } from '../../utils/formatters';

interface ApplicationCardProps {
  application: Application;
  onDelete?: (id: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {application.position_title}
          </h3>
          <p className="text-gray-600">{application.company_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>📅 Applied: {formatDate(application.applied_date)}</p>
        {application.location && <p>📍 {application.location}</p>}
        {application.salary_range && <p>💰 {application.salary_range}</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/applications/${application.id}`}
          className="flex-1 text-center bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
        >
          View Details
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(application.id)}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;