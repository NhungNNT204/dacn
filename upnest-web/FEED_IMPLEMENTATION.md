# 📚 FEED IMPLEMENTATION GUIDE
## Bảng tin học tập - Student Learning Feed

---

## 📑 Table of Contents
1. [Overview](#overview)
2. [Components](#components)
3. [Features](#features)
4. [Setup & Usage](#setup--usage)
5. [Configuration](#configuration)
6. [API Integration](#api-integration)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The **StudentFeed** system is the central hub for social learning, enabling students to:
- **Discover** posts from friends, groups, and courses
- **Filter** content by interest (All, Lessons, Groups, Friends)
- **Create** and share learning posts with media
- **Interact** through reactions, comments, and shares
- **Learn** from suggestions and trending content

**Key Metrics:**
- 3 main components + 1 service
- 3 responsive CSS files
- Mock data ready for testing
- Progressive mobile layout

---

## 🧩 Components

### 1. **StudentFeed.jsx** (Main Feed)
**Purpose:** Core feed page managing posts, filtering, and sidebar

**Props:**
```jsx
// No required props - uses localStorage for user data
<StudentFeed />
```

**Key Features:**
- Content filtering (All/Lessons/Groups/Friends)
- Post creation via PostCreator
- Post display with comments/reactions
- Infinite scroll with "Load More"
- Auto-refresh capability
- Mobile responsive layout
- Error handling & loading states

**State Management:**
```javascript
- posts[] - All posts
- filteredPosts[] - Posts after filtering
- activeFilter - Current filter type
- isLoadingPosts - Loading state
- error - Error message
- isMobileLayout - Mobile detection
- showSuggestions - Sidebar visibility
```

**Key Methods:**
```javascript
loadFeed(filterType, page) - Load posts with pagination
handleFilterChange(filter) - Update active filter
handlePostCreated(newPost) - Add post to feed
handlePostDeleted(postId) - Remove post
handlePostUpdated(updatedPost) - Update post
handleRefresh() - Refresh feed
handleLoadMore() - Load next page
```

---

### 2. **FeedFilter.jsx** (Filter Bar)
**Purpose:** Content filtering with tabbed interface

**Props:**
```jsx
<FeedFilter 
  activeFilter="all"           // Current filter
  onFilterChange={function}    // Callback when filter changes
/>
```

**Features:**
- 4 filter tabs with icons
- Active state styling
- Smooth transitions
- Responsive button layout

**Filter Options:**
| ID | Label | Icon | Description |
|---|---|---|---|
| `all` | Tất cả | BarChart3 | All activities |
| `lessons` | Bài học | Book | Teacher content |
| `groups` | Nhóm | Users | Group activities |
| `friends` | Bạn bè | Heart | Friends' posts |

---

### 3. **SuggestedContent.jsx** (Sidebar)
**Purpose:** Show materials, events, and trending posts

**Props:**
```jsx
<SuggestedContent
  userId="user-1"              // Current user ID
  friendIds={['user-2', ...]}  // Friend list
  groupIds={['group-1', ...]}  // Group list
/>
```

**Features:**
- 3 tabs: Materials | Events | Trending
- Save/bookmark materials
- Event registration buttons
- Trending posts ranking
- Error handling
- Responsive sidebar with mobile overlay

**Tab Content:**

**Materials Tab:**
- Title, description, subject, level
- View count & rating
- Save button
- Link to full resource

**Events Tab:**
- Date display with calendar
- Title & description
- Time & location
- Speaker list
- Attendee count
- Register button

**Trending Tab:**
- Ranking badge (#1, #2, #3)
- Post title & author
- Like/comment/share counts
- Tags
- Link to full post

---

## ✨ Features

### Feed Features

#### 1. **Content Filtering**
```
Tất cả | Bài học | Nhóm | Bạn bè
```
- **All:** Shows all posts
- **Lessons:** Posts from teachers/courses
- **Groups:** Posts within study groups
- **Friends:** Posts from friends only

#### 2. **Post Creation**
- Rich text input
- Image/video upload
- Tag groups and teachers
- Pending status for moderation
- Media preview

#### 3. **Post Interactions**
- 6 emoji reactions (👍 ❤️ 😂 😲 😢 😠)
- Comments with thread
- Share functionality
- Teacher moderation controls
- Delete options

#### 4. **Infinite Scroll**
- Pagination support (10 posts per page)
- "Load More" button
- Page info tracking
- Loading states

#### 5. **Sidebar Suggestions**
- Suggested learning materials
- Upcoming events & webinars
- Trending posts
- Save materials for later
- Event registration

#### 6. **Responsive Design**
- Desktop: 2-column layout (feed + sidebar)
- Tablet: Single column with collapsible sidebar
- Mobile: Full-width feed with overlay sidebar

---

## 🚀 Setup & Usage

### Installation

**1. Files Already Created:**
```
src/components/
  ├── StudentFeed.jsx
  ├── FeedFilter.jsx
  ├── SuggestedContent.jsx
  ├── PostCreator.jsx
  ├── PostCard.jsx
  ├── PostComments.jsx
  ├── CommentItem.jsx
  ├── PostReactions.jsx
  └── TeacherModerationDashboard.jsx

src/services/
  └── postInteractionService.js

src/styles/
  ├── StudentFeed.css
  ├── FeedFilter.css
  ├── SuggestedContent.css
  ├── PostCard.css
  ├── PostComments.css
  ├── CommentItem.css
  ├── PostCreator.css
  ├── PostReactions.css
  └── TeacherModerationDashboard.css
```

**2. Add to Your Router:**
```jsx
// In your main App.jsx or Router setup
import StudentFeed from './components/StudentFeed';

<Route path="/feed" element={<StudentFeed />} />
```

**3. Add to Navigation:**
```jsx
<Link to="/feed">📰 Feed</Link>
```

### Basic Usage

**Simple Implementation:**
```jsx
import StudentFeed from './components/StudentFeed';

export default function HomePage() {
  return (
    <div className="app">
      <Header />
      <StudentFeed />
      <Footer />
    </div>
  );
}
```

**With Layout:**
```jsx
import StudentFeed from './components/StudentFeed';
import StudentLayout from './StudentLayout';

export default function FeedPage() {
  return (
    <StudentLayout>
      <StudentFeed />
    </StudentLayout>
  );
}
```

---

## ⚙️ Configuration

### Service Configuration

**File:** `src/services/postInteractionService.js`

**Enable Mock Service (Development):**
```javascript
// Line 11
const USE_MOCK_SERVICE = true;
```

**Configure API Base URL (Production):**
```javascript
// Line 9
const API_BASE_URL = 'http://your-api.com/api/v1';

// Line 11
const USE_MOCK_SERVICE = false;
```

### Environment Variables

**Create `.env` file:**
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_USE_MOCK=true
```

**Use in code:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;
const USE_MOCK_SERVICE = import.meta.env.VITE_USE_MOCK === 'true';
```

---

## 🔌 API Integration

### Required Backend Endpoints

The service expects these endpoints to exist:

#### Feed Management
```
GET    /api/v1/feed
       - filterType: all|lessons|groups|friends
       - page: 1
       - limit: 10
       - userId: string
       Returns: { success, data: posts[], hasMore, total }
```

#### Post Management
```
POST   /api/v1/posts
       Body: { groupId, title, content, images[], videos[] }
       Returns: { success, data: post }

GET    /api/v1/posts/{id}
       Returns: { success, data: post }

PUT    /api/v1/posts/{id}
       Body: { title, content, ... }
       Returns: { success, data: post }

DELETE /api/v1/posts/{id}
       Returns: { success }
```

#### Suggestions
```
GET    /api/v1/suggestions/materials
       - userId: string
       - limit: 5
       Returns: { success, data: materials[] }

GET    /api/v1/suggestions/events
       - groupIds: string[]
       - limit: 5
       Returns: { success, data: events[] }

GET    /api/v1/posts/trending
       - userId: string
       - limit: 3
       Returns: { success, data: posts[] }
```

### Data Structures

**Post Object:**
```javascript
{
  id: "post-1",
  groupId: "group-1",
  authorId: "user-1",
  authorName: "John Doe",
  authorAvatar: "https://...",
  title: "Post Title",
  content: "Post content...",
  images: [{ id, url, name }],
  videos: [{ id, url, thumbnail, name }],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
  reactions: { like: 5, love: 2, haha: 1 },
  userReaction: "like",
  commentCount: 3,
  shareCount: 2,
  status: "approved",      // pending|approved|rejected
  moderatedAt: "2024-01-15T10:05:00Z",
  tags: ["React", "Web"],
  type: "lesson"            // lesson|normal
}
```

**Material Object:**
```javascript
{
  id: "mat-1",
  title: "React Hooks Guide",
  description: "Learn React Hooks...",
  subject: "React",
  level: "Intermediate",
  url: "https://...",
  views: 2345,
  rating: 4.8
}
```

**Event Object:**
```javascript
{
  id: "evt-1",
  title: "React Workshop",
  description: "Deep dive into...",
  startDate: "2024-01-20T14:00:00Z",
  location: "Room 301",
  speakers: ["John", "Jane"],
  attendees: 124,
  groupId: "group-1"
}
```

---

## 🧪 Testing Checklist

### Feature Testing

**Feed Display:**
- [ ] Feed loads on page open
- [ ] Posts display with correct layout
- [ ] Post cards show avatar, name, timestamp
- [ ] Post content, images, and videos display
- [ ] Empty state shows when no posts

**Filtering:**
- [ ] "All" filter shows all posts
- [ ] "Lessons" filter shows only lesson posts
- [ ] "Groups" filter shows only group posts
- [ ] "Friends" filter shows only friend posts
- [ ] Filter buttons update active state
- [ ] Posts update when filter changes

**Post Creation:**
- [ ] Post creator form is visible
- [ ] Can write title and content
- [ ] Can upload images/videos
- [ ] Can tag groups/lecturers
- [ ] New post appears at top of feed
- [ ] Form clears after submission

**Post Interactions:**
- [ ] Can add reactions (6 emoji types)
- [ ] Reaction count updates
- [ ] Can remove own reactions
- [ ] Can add comments
- [ ] Can view comments thread
- [ ] Comments show author info
- [ ] Can delete own posts
- [ ] Can share posts

**Sidebar Suggestions:**
- [ ] Materials tab shows resources
- [ ] Can save/unsave materials
- [ ] Events tab shows upcoming events
- [ ] Events show correct dates/times
- [ ] Trending tab shows popular posts
- [ ] Can register for events
- [ ] Tab switching works

**Infinite Scroll:**
- [ ] "Load More" button appears
- [ ] Clicking loads next page
- [ ] Posts append to feed
- [ ] Pagination info is correct
- [ ] "Load More" disappears when no more posts

**Mobile Responsiveness:**
- [ ] Layout switches to single column on tablet
- [ ] Sidebar collapses on mobile
- [ ] Sidebar toggle button appears
- [ ] Mobile overlay opens/closes
- [ ] Filter bar scrolls horizontally
- [ ] Touch interactions work

**Error Handling:**
- [ ] Error messages display correctly
- [ ] Can dismiss error messages
- [ ] Can retry failed operations
- [ ] Loading states show properly
- [ ] Network errors are handled

---

## 🛠️ Troubleshooting

### Issue: Feed not loading

**Solutions:**
1. Check localStorage for `accessToken`
   ```javascript
   console.log(localStorage.getItem('accessToken'));
   ```

2. Verify mock service is enabled
   ```javascript
   // In postInteractionService.js
   const USE_MOCK_SERVICE = true;
   ```

3. Check browser console for errors
   ```javascript
   console.error() messages
   ```

4. Verify components are properly imported

---

### Issue: Posts not appearing

**Solutions:**
1. Check mock data in service
   ```javascript
   // Line 60+ in postInteractionService.js
   // Verify mockData.posts has items
   ```

2. Verify filter is not excluding all posts
   ```javascript
   // Check friendIds and groupIds match post data
   ```

3. Check CSS display properties
   ```css
   .posts-container should have display: flex
   .post-card should be visible
   ```

---

### Issue: Sidebar not showing

**Solutions:**
1. Desktop width must be > 1024px
   ```javascript
   // Feed only shows sidebar on desktop
   ```

2. Check SuggestedContent component is rendering
   ```javascript
   console.log('Rendering SuggestedContent');
   ```

3. Verify CSS media queries
   ```css
   /* Sidebar hidden on mobile */
   @media (max-width: 1023px) {
     .feed-sidebar { display: none; }
   }
   ```

---

### Issue: Styles not applying

**Solutions:**
1. Verify CSS files are imported
   ```javascript
   import '../styles/StudentFeed.css';
   import '../styles/FeedFilter.css';
   import '../styles/SuggestedContent.css';
   ```

2. Check for CSS conflicts
   ```javascript
   // Use browser DevTools to inspect
   // Check specificity of selectors
   ```

3. Clear browser cache
   ```
   Ctrl+Shift+Delete (Clear Browsing Data)
   ```

---

### Issue: Mock data not working

**Solutions:**
1. Enable mock service
   ```javascript
   const USE_MOCK_SERVICE = true;
   ```

2. Verify mock data structure
   ```javascript
   // In postInteractionService.js, line 50+
   const mockData = {
     posts: [ /* check posts exist */ ]
   };
   ```

3. Check service methods fallback
   ```javascript
   // All methods should return proper mock responses
   ```

---

## 🔗 Related Components

- **PostCreator.jsx** - Create new posts
- **PostCard.jsx** - Display individual posts
- **PostComments.jsx** - Comment section
- **PostReactions.jsx** - Emoji reactions
- **TeacherModerationDashboard.jsx** - Moderation interface
- **postInteractionService.js** - API service

---

## 📞 Support & Contact

For issues or questions:
1. Check the troubleshooting section
2. Review component props and state
3. Inspect browser console for errors
4. Check network tab for API calls
5. Verify localStorage and authentication

---

## 📊 Architecture Diagram

```
StudentFeed (Main Container)
├── FeedHeader (Title + Refresh)
├── FeedFilter (All|Lessons|Groups|Friends)
├── PostCreator (Create new post)
├── PostsContainer
│   ├── PostCard 1
│   │   ├── PostReactions
│   │   └── PostComments
│   ├── PostCard 2
│   │   ├── PostReactions
│   │   └── PostComments
│   └── LoadMoreButton
└── SuggestedContent (Mobile Sidebar)
    ├── MaterialsTab
    ├── EventsTab
    └── TrendingTab
```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial release with core features |

---

**Happy Learning! 🎓**
