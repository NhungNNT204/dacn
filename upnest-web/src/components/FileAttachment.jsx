/**
 * Component: FileAttachment
 * Purpose: Display and manage file attachments in messages
 * Features: Download, preview, delete, file type icons
 */

import React, { useState } from 'react';
import { Download, X, FileText, Image, Music, Video } from 'lucide-react';
import './FileAttachment.css';

const FILE_ICONS = {
  'application/pdf': FileText,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.ms-excel': FileText,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileText,
  'application/zip': FileText,
  'application/x-rar-compressed': FileText
};

export default function FileAttachment({
  file = {},
  canDelete = false,
  onDownload = () => {},
  onDelete = () => {},
  onPreview = () => {}
}) {
  const [showPreview, setShowPreview] = useState(false);

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return Image;
    if (type?.startsWith('video/')) return Video;
    if (type?.startsWith('audio/')) return Music;
    return FILE_ICONS[type] || FileText;
  };

  const getFileCategory = (type) => {
    if (type?.startsWith('image/')) return 'image';
    if (type?.startsWith('video/')) return 'video';
    if (type?.startsWith('audio/')) return 'audio';
    if (type?.startsWith('application/pdf')) return 'pdf';
    if (type?.includes('word') || type?.includes('document')) return 'document';
    if (type?.includes('sheet') || type?.includes('excel')) return 'spreadsheet';
    return 'file';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const IconComponent = getFileIcon(file.type);
  const category = getFileCategory(file.type);

  return (
    <div className={`file-attachment-container ${category}`}>
      {/* File Icon */}
      <div className="file-icon-wrapper">
        <IconComponent size={24} className="file-icon" />
      </div>

      {/* File Info */}
      <div className="file-info">
        <h4 className="file-name">{file.name || 'Unnamed file'}</h4>
        <p className="file-meta">
          <span className="file-size">{formatFileSize(file.size || 0)}</span>
          {file.uploadDate && (
            <>
              <span className="separator">•</span>
              <span className="upload-date">
                {new Date(file.uploadDate).toLocaleDateString()}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="file-actions">
        <button
          className="action-btn download-btn"
          onClick={() => onDownload(file)}
          title="Download"
        >
          <Download size={16} />
        </button>

        {canDelete && (
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(file.id)}
            title="Delete"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="file-preview-modal">
          <div className="preview-content">
            <button
              className="close-preview"
              onClick={() => setShowPreview(false)}
            >
              <X size={24} />
            </button>

            {category === 'image' && (
              <img src={file.url} alt={file.name} className="preview-image" />
            )}

            {category === 'video' && (
              <video controls className="preview-video">
                <source src={file.url} />
                Your browser does not support the video tag.
              </video>
            )}

            {category === 'pdf' && (
              <iframe
                src={file.url}
                className="preview-pdf"
                title={file.name}
              />
            )}

            <div className="preview-footer">
              <p>{file.name}</p>
              <button
                className="download-btn"
                onClick={() => onDownload(file)}
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
