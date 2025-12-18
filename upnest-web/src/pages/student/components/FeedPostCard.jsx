import React, { useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import MediaLightbox from './MediaLightbox';
import '../styles/FeedPostCard.css';

const REACTION_TYPES = [
  { key: 'LIKE', label: '👍 Like' },
  { key: 'LOVE', label: '❤️ Love' },
  { key: 'HAHA', label: '😂 Haha' },
  { key: 'WOW', label: '😲 Wow' },
  { key: 'SAD', label: '😢 Sad' },
  { key: 'ANGRY', label: '😠 Angry' },
];

function initials(name) {
  const s = (name || 'U').trim();
  if (!s) return 'U';
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('');
}

export default function FeedPostCard({
  post,
  onReactionClick,
  onCommentClick,
  onShareClick,
  onSaveClick,
  onMenuClick,
}) {
  const [lightbox, setLightbox] = useState({ open: false, type: 'image', src: '', alt: '' });

  const createdAt = useMemo(() => {
    try {
      return new Date(post.createdAt).toLocaleString('vi-VN');
    } catch {
      return '';
    }
  }, [post.createdAt]);

  const openImage = (src) => setLightbox({ open: true, type: 'image', src, alt: post.authorName });
  const openVideo = (src) => setLightbox({ open: true, type: 'video', src, alt: post.authorName });
  const openAttachment = (att) => {
    if (!att?.url) return;
    if (att.kind === 'image') return openImage(att.url);
    if (att.kind === 'video') return openVideo(att.url);
    // docs: open in new tab (download/view)
    window.open(att.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="feed-post ui-card ui-animate-fade">
      <header className="feed-post__header">
        <div className="feed-post__author">
          <div className="feed-post__avatar">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={post.authorName || 'User'} />
            ) : (
              <span>{initials(post.authorName)}</span>
            )}
          </div>
          <div className="feed-post__meta">
            <div className="feed-post__nameRow">
              <span className="feed-post__name">{post.authorName}</span>
              <span className="feed-post__time">• {createdAt}</span>
            </div>
            <div className="feed-post__sub">
              {post.postType ? <span className="pill">{post.postType}</span> : null}
              {post.viewCount != null ? <span className="muted">• {post.viewCount} views</span> : null}
            </div>
          </div>
        </div>

        <div className="feed-post__headerActions">
          <button
            className="ui-icon-btn"
            onClick={() => onSaveClick?.(post.id)}
            title={post.isSaved ? 'Bỏ lưu' : 'Lưu để xem sau'}
            aria-label={post.isSaved ? 'Unsave post' : 'Save post'}
          >
            {post.isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
          <button className="ui-icon-btn" onClick={() => onMenuClick?.(post.id)} aria-label="More">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      <div className="feed-post__content">
        <p className="feed-post__text">{post.content}</p>
      </div>

      {(post.imageUrl || post.videoUrl) && (
        <div className="feed-post__media">
          {post.imageUrl && (
            <button className="feed-post__mediaBtn" onClick={() => openImage(post.imageUrl)} aria-label="Open image">
              <img src={post.imageUrl} alt="Post media" />
            </button>
          )}
          {post.videoUrl && (
            <button className="feed-post__mediaBtn" onClick={() => openVideo(post.videoUrl)} aria-label="Open video">
              <img src={post.videoThumbnail || post.imageUrl || ''} alt="Video thumbnail" />
              <span className="feed-post__play">▶</span>
            </button>
          )}
        </div>
      )}

      {Array.isArray(post.attachments) && post.attachments.length > 0 && (
        <div className="feed-post__attachments">
          {post.attachments.slice(0, 6).map((a, idx) => (
            <button
              key={`${a.name || 'att'}-${idx}`}
              className="feed-post__attachment ui-btn ui-btn-ghost"
              type="button"
              onClick={() => openAttachment(a)}
              title={a.name || 'Tệp đính kèm'}
            >
              <span className="feed-post__attIcon" aria-hidden="true">
                {a.kind === 'image' ? '🖼️' : a.kind === 'video' ? '🎬' : '📎'}
              </span>
              <span className="feed-post__attName">{a.name || 'Tệp đính kèm'}</span>
            </button>
          ))}
        </div>
      )}

      <div className="feed-post__stats">
        <span className="muted">
          <strong>{post.likeCount || 0}</strong> reactions
        </span>
        <span className="muted">
          <strong>{post.commentCount || 0}</strong> comments
        </span>
        <span className="muted">
          <strong>{post.shareCount || 0}</strong> shares
        </span>
      </div>

      <div className="feed-post__actions">
        <div className="feed-post__reactions">
          {REACTION_TYPES.map((r) => (
            <button
              key={r.key}
              className={`ui-btn ui-btn-ghost feed-post__reactionBtn ${post.userReactionType === r.key ? 'active' : ''}`}
              onClick={() => onReactionClick?.(post.id, r.key)}
              title={r.label}
              type="button"
            >
              <span className="feed-post__reactionLabel">{r.label}</span>
            </button>
          ))}
        </div>

        <div className="feed-post__quick">
          <button className="ui-btn ui-btn-ghost" onClick={() => onCommentClick?.(post.id)} type="button">
            <MessageCircle size={18} />
            Bình luận
          </button>
          <button className="ui-btn ui-btn-ghost" onClick={() => onShareClick?.(post.id)} type="button">
            <Share2 size={18} />
            Chia sẻ
          </button>
        </div>
      </div>

      <MediaLightbox
        open={lightbox.open}
        type={lightbox.type}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={() => setLightbox((s) => ({ ...s, open: false }))}
      />
    </article>
  );
}


