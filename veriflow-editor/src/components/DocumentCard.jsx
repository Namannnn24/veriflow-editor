import React, { useState } from 'react';
import IntegrityBadge from './IntegrityBadge';

const getRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

const DocumentCard = ({ doc, onDelete, onOpen }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      onDelete();
    } catch (err) {
      setIsDeleting(false);
    }
  };

  const handleOpen = () => {
    onOpen();
  };

  const previewText = doc.content ? doc.content.substring(0, 120) : 'No content yet...';

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 overflow-hidden cursor-pointer h-64" onClick={handleOpen}>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {doc.title || 'Untitled Document'}
          </h3>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Delete document"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-gray-500 flex-1 overflow-hidden">
          {previewText}
          {doc.content && doc.content.length > 120 ? '...' : ''}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex space-x-3">
            <span>{doc.wordCount || 0} words</span>
            <span>•</span>
            <span>{getRelativeTime(doc.updated_at)}</span>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        {doc.isSubmitted && doc.score !== undefined ? (
          <IntegrityBadge score={doc.score} />
        ) : (
          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">Draft</span>
        )}
        
        <button
          onClick={(e) => { e.stopPropagation(); handleOpen(); }}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center"
        >
          Open
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
