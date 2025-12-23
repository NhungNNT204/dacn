/**
 * Component: PostCreator
 * Purpose: Form tạo bài đăng mới với upload ảnh/video
 * Features: Rich text, media upload, preview, submission status
 */

import React, { useState, useRef } from 'react';
import { Image, Video, X, Send } from 'lucide-react';
import postInteractionService from '../../../services/postInteractionService';
import '../styles/PostCreator.css';

const PostCreator = ({ groupId, onPostCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  /**
   * Xử lý thêm ảnh
   */
  const handleAddImages = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const result = await postInteractionService.uploadPostImage(file);
        if (result.success) {
          setImages([...images, result.data]);
        } else {
          setError(`Lỗi upload ảnh: ${result.message}`);
        }
      } catch (err) {
        setError('Lỗi upload ảnh');
        console.error(err);
      }
    }
  };

  /**
   * Xử lý thêm video
   */
  const handleAddVideos = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const result = await postInteractionService.uploadPostVideo(file);
        if (result.success) {
          setVideos([...videos, result.data]);
        } else {
          setError(`Lỗi upload video: ${result.message}`);
        }
      } catch (err) {
        setError('Lỗi upload video');
        console.error(err);
      }
    }
  };

  /**
   * Xóa ảnh
   */
  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  /**
   * Xóa video
   */
  const removeVideo = (id) => {
    setVideos(videos.filter(vid => vid.id !== id));
  };

  /**
   * Xử lý gửi bài đăng
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài đăng');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await postInteractionService.createPost({
        content,
        mediaType: videos.length > 0 ? 'video' : (images.length > 0 ? 'image' : 'text'),
        mediaUrl: videos[0]?.url || images[0]?.url || '',
      });

      // Reset form
      setTitle('');
      setContent('');
      setImages([]);
      setVideos([]);
      setIsExpanded(false);
      setError(null);
      onPostCreated?.(result.data || result);
    } catch (err) {
      setError('Lỗi khi gửi bài đăng');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-creator">
      <div className="creator-container">
        <div className="creator-avatar">
          <div className="avatar-placeholder">👤</div>
        </div>

        <div className="creator-form-wrapper" onClick={() => setIsExpanded(true)}>
          {!isExpanded ? (
            <input
              type="text"
              placeholder="Bạn đang nghĩ gì?"
              readOnly
              className="creator-placeholder"
            />
          ) : (
            <form onSubmit={handleSubmit} className="creator-form">
              {error && (
                <div className="creator-error">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="error-close"
                  >
                    ×
                  </button>
                </div>
              )}

              <input
                type="text"
                placeholder="Tiêu đề (không bắt buộc)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="creator-title"
              />

              <textarea
                placeholder="Bạn đang nghĩ gì?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="creator-textarea"
                disabled={isSubmitting}
              />

              {/* Media Preview */}
              {(images.length > 0 || videos.length > 0) && (
                <div className="media-preview-container">
                  <div className="media-preview">
                    {images.map((img) => (
                      <div key={img.id} className="preview-item image-preview">
                        <img src={img.url} alt="preview" />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="remove-btn"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {videos.map((vid) => (
                      <div key={vid.id} className="preview-item video-preview">
                        <video src={vid.url} controls style={{ width: '100%', height: 'auto' }} />
                        <button
                          type="button"
                          onClick={() => removeVideo(vid.id)}
                          className="remove-btn"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="creator-actions">
                <div className="media-buttons">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="media-btn"
                    title="Thêm ảnh"
                    disabled={isSubmitting}
                  >
                    <Image size={20} />
                    <span>Ảnh</span>
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddImages}
                    hidden
                  />

                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="media-btn"
                    title="Thêm video"
                    disabled={isSubmitting}
                  >
                    <Video size={20} />
                    <span>Video</span>
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleAddVideos}
                    hidden
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setTitle('');
                      setContent('');
                      setImages([]);
                      setVideos([]);
                    }}
                    className="cancel-btn"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting || !content.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Đăng
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
