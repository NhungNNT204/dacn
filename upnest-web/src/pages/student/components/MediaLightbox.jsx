import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/MediaLightbox.css';

export default function MediaLightbox({ open, type, src, alt, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isEmbed = type === 'video' && typeof src === 'string' && (src.includes('youtube.com') || src.includes('youtu.be') || src.includes('embed'));
  const isDirectVideo = type === 'video' && !isEmbed;

  return (
    <div className="media-lightbox" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="media-lightbox-inner" onMouseDown={(e) => e.stopPropagation()}>
        <button className="media-lightbox-close ui-icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        {isEmbed ? (
          <div className="media-lightbox-video">
            <iframe
              title={alt || 'video'}
              src={src}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : isDirectVideo ? (
          <video className="media-lightbox-videoEl" src={src} controls autoPlay />
        ) : (
          <img className="media-lightbox-img" src={src} alt={alt || 'image'} />
        )}
      </div>
    </div>
  );
}


