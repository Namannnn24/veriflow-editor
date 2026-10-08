import React, { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';

export default function Editor({ content, setContent, onLogEvent, isReadOnly }) {
  const [isTyping, setIsTyping] = useState(false);
  const [time, setTime] = useState(new Date());
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    if (isReadOnly) return;
    
    const newContent = e.target.value;
    const charCount = newContent.length;
    const delta = newContent.length - content.length;
    
    setContent(newContent);
    onLogEvent({
      type: 'input',
      timestamp: Date.now(),
      charCount,
      change: delta,
      contentSnapshot: newContent
    });

    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
  };

  const handlePaste = (e) => {
    if (isReadOnly) return;
    
    const pastedText = e.clipboardData.getData('text');
    onLogEvent({
      type: 'paste',
      timestamp: Date.now(),
      pastedLength: pastedText.length,
      contentSnapshot: content + pastedText
    });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-brand-500 animate-pulse' : 'bg-gray-300'}`}></span>
          <span>{isTyping ? 'Writing...' : 'Idle'}</span>
        </div>
        <div className="flex items-center gap-6">
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{charCount} chars</span>
          <span>{wordCount} words</span>
          <span>~{readingTime} min read</span>
        </div>
      </div>
      
      <div className="flex-1 relative max-w-4xl w-full mx-auto p-8 sm:p-12 lg:p-16">
        {isReadOnly && (
          <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-gray-500 text-sm font-medium border border-gray-100">
              <Lock className="w-4 h-4" />
              <span>Read Only Mode</span>
            </div>
          </div>
        )}
        <textarea
          value={content}
          onChange={handleChange}
          onPaste={handlePaste}
          readOnly={isReadOnly}
          placeholder="Start writing your document here... Every keystroke is being verified."
          className="w-full h-full resize-none outline-none border-none bg-transparent font-serif text-lg leading-loose text-gray-800 placeholder:text-gray-300 selection:bg-brand-100 selection:text-brand-900"
        />
      </div>
    </div>
  );
}
