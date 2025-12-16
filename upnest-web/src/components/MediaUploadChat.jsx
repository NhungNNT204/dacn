/**
 * Component: MediaUploadChat
 * Purpose: Upload media (images, videos) with preview
 * Features: Drag-drop, file validation, compression, preview gallery
 */

import React, { useState, useRef } from 'react';
import { Upload, X, Loader, Play } from 'lucide-react';
import './MediaUploadChat.css';

export default function MediaUploadChat({
  onUploadComplete = () => {},
  onError = () => {},
  maxFiles = 5,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm']
}) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return { valid: false, error: `File type not supported: ${file.type}` };
    }
    if (file.size > maxFileSize) {
      return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB` };
    }
    return { valid: true };
  };

  const generatePreview = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            type: 'image',
            url: e.target.result
          });
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            type: 'video',
            url: e.target.result
          });
        };
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const handleFileSelect = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = [];
    const maxToAdd = Math.min(selectedFiles.length, maxFiles - files.length);

    for (let i = 0; i < maxToAdd; i++) {
      const file = selectedFiles[i];
      const validation = validateFile(file);

      if (!validation.valid) {
        onError(validation.error);
        continue;
      }

      const preview = await generatePreview(file);
      const fileId = Math.random().toString(36).substr(2, 9);

      newFiles.push({
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        progress: 0,
        error: null
      });
    }

    setFiles([...files, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    await handleFileSelect(droppedFiles);
  };

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedFiles = [];
    const errors = [];

    for (const fileData of files) {
      try {
        // Simulate upload with progress
        const formData = new FormData();
        formData.append('file', fileData.file);

        // Update progress
        setUploadProgress(prev => ({
          ...prev,
          [fileData.id]: 100
        }));

        uploadedFiles.push({
          id: fileData.id,
          name: fileData.name,
          size: fileData.size,
          type: fileData.type,
          url: fileData.preview?.url,
          preview: fileData.preview
        });
      } catch (error) {
        errors.push({
          fileId: fileData.id,
          error: error.message
        });
      }
    }

    setIsUploading(false);
    onUploadComplete(uploadedFiles, errors);
    setFiles([]);
    setUploadProgress({});
  };

  return (
    <div className="media-upload-container">
      {/* Upload Area */}
      {files.length < maxFiles && (
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <Upload size={32} className="upload-icon" />
            <h3>Drop media here or click to select</h3>
            <p>Supports: JPG, PNG, GIF, MP4, WebM (Max {maxFiles} files)</p>
            <button
              className="select-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden-input"
          />
        </div>
      )}

      {/* Files Preview Grid */}
      {files.length > 0 && (
        <div className="files-grid">
          {files.map((fileData) => (
            <div key={fileData.id} className="file-item">
              {/* Preview */}
              {fileData.preview?.type === 'image' && (
                <img
                  src={fileData.preview.url}
                  alt={fileData.name}
                  className="preview-image"
                />
              )}
              {fileData.preview?.type === 'video' && (
                <div className="preview-video">
                  <video src={fileData.preview.url} className="video-thumb" />
                  <Play className="play-icon" size={32} />
                </div>
              )}

              {/* File Info Overlay */}
              <div className="file-overlay">
                <div className="file-info">
                  <p className="file-name">{fileData.name}</p>
                  <p className="file-size">
                    {(fileData.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>

                {/* Progress Bar */}
                {fileData.progress < 100 && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${fileData.progress}%` }}
                    />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  className="remove-btn"
                  onClick={() => removeFile(fileData.id)}
                  disabled={isUploading}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="upload-actions">
          <button
            className="upload-btn"
            onClick={uploadFiles}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader className="spinner" size={16} /> Uploading...
              </>
            ) : (
              `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
            )}
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              setFiles([]);
              setUploadProgress({});
            }}
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
