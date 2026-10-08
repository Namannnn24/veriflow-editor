import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submissionsAPI } from '../api.js';
import IntegrityBadge from '../components/IntegrityBadge.jsx';
import { FileText, Clock, ChevronRight, FileUp, Calendar } from 'lucide-react';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await submissionsAPI.list();
      setSubmissions(data || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="flex items-center gap-3 mb-8">
        <FileUp className="w-8 h-8 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Submission History</h1>
          <p className="text-slate-500 mt-1">Review all your verified document submissions.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-6 animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-4 w-1/2">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-8 bg-slate-200 rounded-full w-24"></div>
              </div>
            ))}
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center max-w-2xl mx-auto mt-12">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No submissions yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            You haven't submitted any documents for verification yet. Finish a document in the editor and click "Submit" to generate an integrity report.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-sm transition-all"
          >
            Go to Documents
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Integrity Score
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Flags
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-brand-50 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-brand-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{sub.document_title || 'Untitled Document'}</div>
                          <div className="text-xs text-slate-500 font-mono">ID: {sub.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <IntegrityBadge score={sub.score} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {Array.isArray(sub.flags) ? sub.flags.length : 0} flags
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                        {formatDate(sub.submitted_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/report/${sub.id}`}
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Report
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-50 rounded-lg">
                      <FileText className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{sub.document_title || 'Untitled Document'}</h4>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(sub.submitted_at)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <IntegrityBadge score={sub.score} />
                  <Link
                    to={`/report/${sub.id}`}
                    className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Report <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
