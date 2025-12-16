/**
 * Component: MediaGallery
 * Purpose: Display media gallery/lightbox for conversation
 * Features: Grid view, full-screen preview, zoom, download
 */

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';
import './MediaGallery.css';

export default function MediaGallery({
  media = [],
  onClose = () => {},
  onDownload = () => {}
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);

  const currentMedia = media[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentMedia) {
    return null;
  }

  return (
    <div className={`media-gallery-container ${fullScreen ? 'fullscreen' : ''}`}>
      {/* Main Viewer */}
      <div className="gallery-viewer">
        {/* Media Display */}
        <div className="media-display">
          {currentMedia.type === 'image' ? (
            <img
              src={currentMedia.url}
              alt={currentMedia.name}
              className="gallery-image"
              style={{
                transform: `scale(${zoom})`
              }}
            />
          ) : (
            <video
              src={currentMedia.url}
              controls
              className="gallery-video"
              style={{
                transform: `scale(${zoom})`
              }}
            />
          )}
        </div>

        {/* Navigation Controls */}
        {media.length > 1 && (
          <>
            <button
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              title="Previous (←)"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="nav-btn next-btn"
              onClick={handleNext}
              title="Next (→)"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Header Controls */}
        <div className="gallery-header">
          <div className="gallery-title">
            <span className="media-count">
              {selectedIndex + 1} / {media.length}
            </span>
            <span className="media-name">{currentMedia.name}</span>
          </div>

          <div className="header-actions">
            {currentMedia.type === 'image' && (
              <>
                <button
                  className="control-btn"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                  title="Zoom out"
                >
                  −
                </button>
                <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                <button
                  className="control-btn"
                  onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                  title="Zoom in"
                >
                  +
                </button>
                <div className="separator" />
              </>
            )}

            <button
              className="control-btn"
              onClick={() => setFullScreen(!fullScreen)}
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>

            <button
              className="control-btn"
              onClick={() => onDownload(currentMedia)}
              title="Download"
            >
              <Download size={18} />
            </button>

            <button
              className="control-btn close-btn"
              onClick={onClose}
              title="Close (Esc)"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {media.length > 1 && (
          <div className="thumbnail-strip">
            {media.map((item, index) => (
              <button
                key={item.id || index}
                className={`thumbnail ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => {
                  setSelectedIndex(index);
                  setZoom(1);
                }}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={`${index + 1}`} />
                ) : (
                  <video src={item.url} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
