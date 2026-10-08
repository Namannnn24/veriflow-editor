import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Activity, CheckCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import { documentsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { calculateIntegrity } from '../utils/integrity';
import Editor from '../components/Editor';
import AuditPanel from '../components/AuditPanel';
import AISandbox from '../components/AISandbox';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doc, setDoc] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [logs, setLogs] = useState([]);
  const [pendingLogs, setPendingLogs] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [error, setError] = useState(null);
  
  const [showAudit, setShowAudit] = useState(window.innerWidth >= 1024);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setIsLoading(true);
        const data = await documentsAPI.get(id);
        setDoc(data);
        setContent(data.content || '');
        setTitle(data.title || 'Untitled Document');
        setLogs(data.logs || []);
      } catch (err) {
        setError('Document not found or access denied.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const triggerSave = useCallback(async (newTitle, newContent, currentPendingLogs) => {
    if (!doc || doc.status === 'submitted') return;
    
    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      await documentsAPI.update(id, {
        title: newTitle,
        content: newContent,
        newLogs: currentPendingLogs
      });
      setPendingLogs([]);
      setSaveStatus('Saved');
    } catch (err) {
      console.error('Save failed', err);
      setSaveStatus('Unsaved');
    } finally {
      setIsSaving(false);
    }
  }, [id, doc]);

  // Debounced auto-save
  useEffect(() => {
    if (isLoading || !doc || doc.status === 'submitted') return;
    
    if (saveStatus === 'Saved' && content === doc.content && title === doc.title && pendingLogs.length === 0) return;

    setSaveStatus('Unsaved');
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      triggerSave(title, content, pendingLogs);
    }, 2000);
    
    return () => clearTimeout(saveTimeoutRef.current);
  }, [content, title, pendingLogs, doc, isLoading, saveStatus, triggerSave]);

  const handleLogEvent = (event) => {
    setLogs(prev => [...prev, event]);
    setPendingLogs(prev => [...prev, event]);
  };

  const handleUseAI = (prompt, response) => {
    const aiBlock = `\n\n[AI CITATION: Prompt="${prompt}"]\n${response}\n[END AI]\n\n`;
    const newContent = content + aiBlock;
    const aiLog = {
      type: 'ai_insert',
      timestamp: Date.now(),
      prompt,
      responseLength: response.length,
      change: aiBlock.length,
      contentSnapshot: newContent
    };
    
    setContent(newContent);
    handleLogEvent(aiLog);
  };

  const handleSubmit = async () => {
    if (doc?.status === 'submitted') return;
    
    // Save any pending changes first
    if (pendingLogs.length > 0 || saveStatus === 'Unsaved') {
      await triggerSave(title, content, pendingLogs);
    }
    
    setIsSubmitting(true);
    try {
      const result = await documentsAPI.submit(id);
      setSubmissionResult(result);
    } catch (err) {
      console.error('Submit failed', err);
      alert('Failed to submit document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-brand-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-medium text-gray-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Workspace Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/dashboard" className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isReadOnly = doc?.status === 'submitted';
  const displayScore = doc ? calculateIntegrity(logs, content.length).score : 100;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      
      {/* Sidebar Nav */}
      <div className="w-[72px] shrink-0 bg-slate-900 flex flex-col items-center py-6 border-r border-slate-800 z-20">
        <Link to="/dashboard" className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center font-bold text-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20 mb-8" title="Back to Dashboard">
          V
        </Link>
        
        <div className="flex flex-col gap-4 flex-1 w-full px-3">
          <button 
            onClick={() => setIsSandboxOpen(true)}
            disabled={isReadOnly}
            className="w-full aspect-square flex flex-col items-center justify-center rounded-xl text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 group relative"
          >
            <Sparkles className="w-6 h-6" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">AI Sandbox</span>
          </button>
          
          <button 
            onClick={() => setShowAudit(!showAudit)}
            className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all group relative ${showAudit ? 'text-brand-400 bg-brand-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Activity className="w-6 h-6" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Toggle Audit Panel</span>
          </button>
        </div>

        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-medium border border-slate-700 mt-auto cursor-help" title={user?.name}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative z-10 shadow-xl shadow-gray-200/50">
        
        {/* Topbar */}
        <header className="h-16 shrink-0 border-b border-gray-200 px-6 flex items-center justify-between bg-white z-20">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {isEditingTitle && !isReadOnly ? (
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="text-lg font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full max-w-md"
              />
            ) : (
              <h1 
                onClick={() => !isReadOnly && setIsEditingTitle(true)}
                className={`text-lg font-semibold text-gray-900 truncate px-2 py-1 border border-transparent rounded ${!isReadOnly ? 'hover:bg-gray-50 cursor-text' : ''}`}
              >
                {title}
              </h1>
            )}
            
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 shrink-0">
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin text-brand-500" /> : <Save className="w-3 h-3" />}
              {saveStatus}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            {!isReadOnly && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isSaving}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-lg font-medium text-sm transition-colors shadow-sm shadow-brand-500/20 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Submit Document
              </button>
            )}
            {isReadOnly && (
              <div className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Submitted
              </div>
            )}
          </div>
        </header>

        {/* Editor Wrapper */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <Editor 
            content={content} 
            setContent={setContent} 
            onLogEvent={handleLogEvent}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      {/* Audit Panel */}
      <AuditPanel 
        logs={logs} 
        contentLength={content.length} 
        isVisible={showAudit}
      />

      {/* AI Sandbox Modal */}
      <AISandbox 
        isOpen={isSandboxOpen} 
        onClose={() => setIsSandboxOpen(false)} 
        onUseAI={handleUseAI}
      />

      {/* Submission Success Modal */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified & Submitted</h2>
            <p className="text-gray-500 mb-8">Your document has been successfully processed and recorded on the verification ledger.</p>
            
            <div className="w-full bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Final Integrity Score</div>
              <div className="text-5xl font-extrabold text-emerald-500 mb-4">{displayScore}</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${displayScore}%` }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Link to={`/report/${submissionResult.id || id}`} className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                View Verification Report
              </Link>
              <Link to="/dashboard" className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-medium transition-colors">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
