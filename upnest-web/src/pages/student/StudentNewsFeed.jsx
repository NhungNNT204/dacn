import React from 'react';
import HomeFeed from './HomeFeed';

/**
 * StudentNewsFeed route wrapper.
 * We now use the full-feature HomeFeed (reactions/comments/share/save/report/hide + media lightbox).
 */
export default function StudentNewsFeed() {
  return <HomeFeed />;
}
