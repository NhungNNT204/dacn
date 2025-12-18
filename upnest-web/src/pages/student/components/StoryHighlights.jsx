import React from 'react';
import { Plus } from 'lucide-react';

/**
 * StoryHighlights - Hiển thị highlights stories
 */
const StoryHighlights = ({ highlights, onAddStory, isOwnProfile }) => {
  return (
    <div className="story-highlights-section">
      <h3>Highlights</h3>
      <div className="highlights-container">
        {isOwnProfile && (
          <div className="highlight-item add-highlight" onClick={onAddStory}>
            <div className="highlight-circle">
              <Plus size={32} />
            </div>
            <p>Thêm mới</p>
          </div>
        )}

        {highlights.map(highlight => (
          <div key={highlight.id} className="highlight-item">
            <img
              src={highlight.thumbnailUrl || 'https://via.placeholder.com/100'}
              alt={highlight.title}
              className="highlight-image"
            />
            <p>{highlight.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryHighlights;
