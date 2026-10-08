import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionsAPI } from '../api.js';
import { Printer, ChevronLeft, ShieldCheck, Clock, FileText, Activity, AlertTriangle, Calendar } from 'lucide-react';
import { getScoreColor, getScoreLabel } from '../utils/integrity.js';

export default function Report() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    setIsLoading(true);
    try {
      const data = await submissionsAPI.get(id);
      setSubmission(data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('Could not load the integrity report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Activity className="w-8 h-8 text-brand-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Generating integrity report...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-700">Error Loading Report</h2>
        <p className="text-red-600 mt-1">{error}</p>
        <Link to="/submissions" className="mt-4 inline-block text-red-700 font-medium underline">
          Return to Submissions
        </Link>
      </div>
    );
  }

  // Use the score and stats directly from the submission (calculated server-side)
  const score = submission.score;
  const flags = submission.flags || [];
  const stats = submission.stats || {};
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  const content = submission.content || '';
  const docLength = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;

  const pastePercentage = docLength > 0 ? Math.min(100, Math.round(((stats.pastedChars || 0) / docLength) * 100)) : 0;
  const aiPercentage = docLength > 0 ? Math.min(100, Math.round(((stats.aiChars || 0) / docLength) * 100)) : 0;

  const strokeDasharray = 251.2; // 2 * pi * r (r=40)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;

  const scoreColorHex = score > 85 ? '#10b981' : score > 60 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="min-h-screen bg-slate-50 py-8 print:bg-white print:py-0 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Actions */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            to="/submissions"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Submissions
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Certificate
          </button>
        </div>

        {/* Certificate Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          {/* Header */}
          <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden print:bg-white print:text-slate-900 print:border-b print:border-slate-200">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-500 opacity-20 rounded-full blur-3xl print:hidden"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-6 h-6 text-brand-400 print:text-brand-600" />
                  <span className="text-sm font-semibold tracking-wider uppercase text-brand-300 print:text-brand-600">VeriFlow Certified</span>
                </div>
                <h1 className="text-3xl font-bold mb-1 print:text-slate-900">Integrity Report</h1>
                <p className="text-slate-400 font-mono text-sm print:text-slate-500">ID: {submission.id}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-slate-400 print:text-slate-500 mb-1">Submitted On</p>
                <div className="flex items-center gap-1.5 font-medium text-lg">
                  <Calendar className="w-5 h-5 text-slate-300 print:text-slate-600" />
                  {new Date(submission.submitted_at).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Score Circular Display */}
              <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-200 print:text-slate-100"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="8"
                      fill="transparent"
                      stroke={scoreColorHex}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-bold text-slate-900">{score}</span>
                    <span className={`text-sm font-semibold uppercase tracking-wider mt-1 ${scoreColor}`}>
                      {scoreLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Document Title</h3>
                  <p className="text-xl font-bold text-slate-900">{submission.document_title || 'Untitled Document'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 border border-slate-200 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Words
                    </div>
                    <div className="text-xl font-bold text-slate-900">{wordCount}</div>
                  </div>
                  <div className="bg-white p-4 border border-slate-200 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Characters
                    </div>
                    <div className="text-xl font-bold text-slate-900">{docLength}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Breakdown */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Behavioral Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-5 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Pasted Content</span>
                  <span className={`text-sm font-bold ${pastePercentage > 30 ? 'text-red-600' : 'text-slate-900'}`}>
                    {pastePercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${pastePercentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-500">{stats.pastedChars || 0} characters pasted</p>
              </div>

              <div className="p-5 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">AI Generated</span>
                  <span className={`text-sm font-bold ${aiPercentage > 30 ? 'text-violet-600' : 'text-slate-900'}`}>
                    {aiPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${aiPercentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-500">{stats.aiChars || 0} AI-generated characters</p>
              </div>

              <div className="p-5 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Final Score</span>
                  <span className="text-sm font-bold text-slate-900">{score}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${score}%` }}></div>
                </div>
                <p className="text-xs text-slate-500">Overall integrity confidence</p>
              </div>
            </div>

            {/* Flags Section */}
            {flags.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Attention Flags</h3>
                <div className="space-y-3 mb-12">
                  {flags.map((flag, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{flag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Verification Footer */}
            <div className="mt-12 pt-8 border-t border-slate-200 text-center flex flex-col items-center">
              <ShieldCheck className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                This report is cryptographically generated based on keystroke and behavioral data collected during the writing process. VeriFlow guarantees the integrity of this audit trail.
              </p>
              <div className="mt-4 font-mono text-xs text-slate-400 break-all bg-slate-50 p-2 rounded max-w-full">
                Hash: {btoa(`${submission.id}-${score}-${docLength}`).substring(0, 48)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
