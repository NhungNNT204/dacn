import React, { useMemo } from 'react';
import '../styles/ActivityCard.css';

function initials(name) {
  const s = (name || 'U').trim();
  if (!s) return 'U';
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('');
}

function typeLabel(type) {
  const t = (type || '').toUpperCase();
  if (t === 'COURSE_COMPLETED') return 'đã hoàn thành khóa học';
  if (t === 'REVIEW') return 'đã review khóa học';
  if (t === 'CHALLENGE') return 'đã hoàn thành thử thách';
  return 'có hoạt động học tập mới';
}

export default function ActivityCard({ activity }) {
  const createdAt = useMemo(() => {
    try {
      return new Date(activity.createdAt).toLocaleString('vi-VN');
    } catch {
      return '';
    }
  }, [activity.createdAt]);

  return (
    <article className="activity-card ui-card ui-animate-fade">
      <div className="activity-card__left">
        <div className="activity-card__avatar">
          {activity.userAvatar ? (
            <img src={activity.userAvatar} alt={activity.userName || 'User'} />
          ) : (
            <span>{initials(activity.userName)}</span>
          )}
        </div>
      </div>
      <div className="activity-card__body">
        <div className="activity-card__top">
          <div className="activity-card__line">
            <strong className="activity-card__name">{activity.userName}</strong>{' '}
            <span className="activity-card__verb">{typeLabel(activity.activityType)}</span>
          </div>
          <div className="activity-card__time muted">{createdAt}</div>
        </div>
        {activity.courseTitle && (
          <div className="activity-card__course">
            Khóa học: <strong>{activity.courseTitle}</strong>
          </div>
        )}
        {activity.message && <div className="activity-card__msg">{activity.message}</div>}
      </div>
    </article>
  );
}






