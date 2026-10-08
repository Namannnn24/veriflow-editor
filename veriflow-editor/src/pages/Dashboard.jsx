import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Activity, LayoutGrid, FileUp } from 'lucide-react';
import { documentsAPI, submissionsAPI } from '../api.js';
import DocumentCard from '../components/DocumentCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const docs = await documentsAPI.list();
      setDocuments(docs);
      
      const subs = await submissionsAPI.list();
      setSubmissionsCount(subs.length);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    setIsCreating(true);
    try {
      const newDoc = await documentsAPI.create();
      navigate(`/editor/${newDoc.id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
      setIsCreating(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentsAPI.delete(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const calculateAvgScore = () => {
    if (documents.length === 0) return 0;
    return 100;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name || 'Writer'}</h1>
          <p className="text-slate-500 mt-1">Manage your documents and view your integrity stats.</p>
        </div>
        <button
          onClick={handleCreateDocument}
          disabled={isCreating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          {isCreating ? 'Creating...' : 'New Document'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Documents</p>
            <p className="text-2xl font-bold text-slate-900">{isLoading ? '-' : documents.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Submissions</p>
            <p className="text-2xl font-bold text-slate-900">{isLoading ? '-' : submissionsCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Integrity Score</p>
            <p className="text-2xl font-bold text-slate-900">{isLoading ? '-' : `${calculateAvgScore()}%`}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <LayoutGrid className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900">My Documents</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-slate-100 rounded w-1/3"></div>
                <div className="h-8 bg-slate-100 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center max-w-2xl mx-auto mt-12">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-brand-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Create your first document to start writing. VeriFlow will silently track your process and guarantee your authenticity.
          </p>
          <button
            onClick={handleCreateDocument}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" />
            Create First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={() => handleDeleteDocument(doc.id)}
              onOpen={() => navigate(`/editor/${doc.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
