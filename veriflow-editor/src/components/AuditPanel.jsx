import React, { useEffect, useState } from 'react';
import { Activity, Type, FileText, Clipboard, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculateIntegrity, getScoreColor, getScoreLabel } from '../utils/integrity';

export default function AuditPanel({ logs, contentLength, isVisible }) {
  const [stats, setStats] = useState({ score: 100, label: 'Verified', color: 'text-emerald-500', bg: 'bg-emerald-500' });
  const [flags, setFlags] = useState([]);
  
  const endRef = React.useRef(null);
  
  useEffect(() => {
    const result = calculateIntegrity(logs, contentLength);
    setStats({
      score: result.score,
      label: getScoreLabel(result.score),
      color: getScoreColor(result.score),
      bg: getScoreColor(result.score).replace('text-', 'bg-')
    });
    setFlags(result.flags || []);
    
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, contentLength]);

  if (!isVisible) return null;

  const pasteCount = logs.filter(l => l.type === 'paste').length;
  const aiCount = logs.filter(l => l.type === 'ai_insert').length;
  const wordsWritten = logs.reduce((acc, log) => acc + (log.change > 0 ? log.change : 0), 0) / 5;

  return (
    <div className="w-80 lg:w-96 flex-shrink-0 bg-slate-950 text-slate-300 h-full flex flex-col border-l border-slate-800 shadow-2xl transition-all duration-300 ease-in-out slide-in-right">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2 text-white font-medium">
          <Activity className="w-5 h-5 text-brand-400" />
          <h2>VeriFlow Audit</h2>
        </div>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
        </span>
      </div>

      <div className="p-6 border-b border-slate-800 flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${stats.score * 2.83} 283`} className={`${stats.color} transition-all duration-1000 ease-out`} />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${stats.color}`}>{stats.score}</span>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${stats.bg} text-white bg-opacity-20`}>
          {stats.label}
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-800 bg-slate-900/30">
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/50">
          <div className="text-slate-500 mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider"><Type className="w-3 h-3" /> Chars</div>
          <div className="text-lg font-semibold text-white">{contentLength}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/50">
          <div className="text-slate-500 mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider"><FileText className="w-3 h-3" /> Words</div>
          <div className="text-lg font-semibold text-white">{Math.round(wordsWritten)}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/50">
          <div className="text-slate-500 mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider"><Clipboard className="w-3 h-3" /> Pastes</div>
          <div className="text-lg font-semibold text-white">{pasteCount}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/50">
          <div className="text-slate-500 mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider"><Sparkles className="w-3 h-3" /> AI</div>
          <div className="text-lg font-semibold text-white">{aiCount}</div>
        </div>
      </div>

      <div className="p-4 border-b border-slate-800">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">Detected Patterns</h3>
        {flags.length === 0 ? (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-3 rounded-lg text-sm border border-emerald-400/20">
            <CheckCircle className="w-4 h-4" />
            <span>All clear. No suspicious patterns detected.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {flags.map((flag, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 rounded-lg text-sm border text-amber-400 bg-amber-400/10 border-amber-400/20">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Event Log</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
          {logs.map((log, idx) => {
            let color = 'text-slate-400';
            if (log.type === 'input') color = 'text-blue-400';
            else if (log.type === 'paste') color = 'text-rose-400';
            else if (log.type === 'ai_insert') color = 'text-violet-400';

            return (
              <div key={idx} className="flex items-start gap-2 break-all">
                <span className="text-slate-600 shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <span className={`shrink-0 ${color}`}>{`[${log.type.toUpperCase()}]`}</span>
                <span className="text-slate-300">
                  {log.type === 'input' && `+${log.change} chars`}
                  {log.type === 'paste' && `pasted ${log.pastedLength} chars`}
                  {log.type === 'ai_insert' && `inserted AI content`}
                </span>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
