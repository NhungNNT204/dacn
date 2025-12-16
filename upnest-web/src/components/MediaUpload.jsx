import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import './MediaUpload.css';

/**
 * Component: MediaUpload
 * Xử lý upload hình ảnh/video với preview, validation, compression
 */
export default function MediaUpload({
  onMediaSelect = () => {},
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm']
}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Validate file
  const validateFile = (file) => {
    const errors = [];

    // Kiểm tra loại file
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Loại file không được hỗ trợ`);
    }

    // Kiểm tra kích thước
    if (file.size > maxFileSize) {
      errors.push(`${file.name}: Kích thước vượt quá ${maxFileSize / (1024 * 1024)}MB`);
    }

    return errors;
  };

  // Xử lý upload files
  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    const newErrors = [];

    // Kiểm tra số lượng file
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      newErrors.push(`Chỉ có thể upload tối đa ${maxFiles} file`);
    }

    // Validate từng file
    const validFiles = [];
    fileArray.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      setUploading(true);

      // Simulate upload process
      validFiles.forEach((file) => {
        const fileId = `file_${Date.now()}_${Math.random()}`;

        // Tạo preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile = {
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            preview: e.target.result,
            progress: 0,
            status: 'uploading'
          };

          setUploadedFiles((prev) => [...prev, newFile]);

          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);

              // Update file status
              setUploadedFiles((prev) =>
                prev.map((f) =>
                  f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f
                )
              );

              setUploading(false);
              onMediaSelect(newFile);
            }

            setUploadProgress((prev) => ({
              ...prev,
              [fileId]: Math.min(progress, 100)
            }));

            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
              )
            );
          }, 200);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Xử lý drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }
    handleFileSelect(e.dataTransfer.files);
  };

  // Xóa file
  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Lấy icon dựa trên loại file
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type.startsWith('video/')) {
      return '🎥';
    }
    return '📎';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes, k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="media-upload-container">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, idx) => (
            <div key={idx} className="error-item">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {uploadedFiles.length < maxFiles && (
        <div
          className="upload-dropzone"
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-content">
            <Upload size={32} />
            <p>Kéo thả file hoặc click để chọn</p>
            <small>Hỗ trợ: JPG, PNG, GIF, MP4, WebM (Tối đa {maxFileSize / (1024 * 1024)}MB)</small>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Tệp đã chọn ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="files-grid">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-card">
                {/* Preview */}
                <div className="file-preview">
                  {file.type.startsWith('image/') ? (
                    <img src={file.preview} alt={file.name} />
                  ) : (
                    <div className="video-placeholder">
                      {getFileIcon(file.type)}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className={`status-badge ${file.status}`}>
                    {file.status === 'completed' && <CheckCircle size={16} />}
                    {file.status === 'uploading' && (
                      <div className="spinner"></div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* File Info */}
                <div className="file-info">
                  <p className="file-name" title={file.name}>
                    {file.name}
                  </p>
                  <p className="file-size">{formatFileSize(file.size)}</p>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                      <span className="progress-text">{file.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Stats */}
      {uploadedFiles.length > 0 && (
        <div className="upload-stats">
          <p>
            Đã tải lên: {uploadedFiles.length}/{maxFiles} tệp
            ({uploadedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024) > 0
              ? (uploadedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)
              : '0'} MB)
          </p>
        </div>
      )}
    </div>
  );
}
