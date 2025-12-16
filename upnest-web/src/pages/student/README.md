# UpNest Education - Social Media UI Refactoring

## 📋 Overview

The student interface has been completely redesigned to match modern social media standards (Facebook/Instagram style). This includes a responsive layout with a header, sidebar navigation, feed component, and right sidebar widgets.

## 🎨 Components Created

### 1. **StudentLayout.jsx**
Main layout wrapper component that provides the social media-style structure.

**Features:**
- Header with UpNest logo, search bar, notification icons, and logout button
- Collapsible left sidebar with main navigation
- Main content area for child components
- Right sidebar with trending topics and friend suggestions
- Fully responsive design with mobile support

**Structure:**
```
StudentLayout
├── Header
│   ├── Logo
│   ├── Search bar
│   ├── Notification/Message icons
│   └── Logout button
├── Main Container
│   ├── Sidebar (Left)
│   │   ├── Navigation Menu (Home, Friends, Forum, Courses, Profile, Settings)
│   │   └── Footer
│   ├── Content Area
│   │   └── Children/Feed
│   └── Right Sidebar
│       ├── Trending Topics
│       └── Friend Suggestions
```

**Key Props:**
- `children`: Content to render in the main area (optional, defaults to Feed)

### 2. **StudentDashboard.jsx** (Redesigned)
Updated dashboard that integrates with StudentLayout.

**Features:**
- Wraps content with StudentLayout
- Profile card with banner, avatar, and user info
- Stats container showing courses, friends, posts, points
- Quick action buttons for main features
- Recent activity feed
- Course recommendations
- Fetches user profile from backend API

**Sections:**
1. **Profile Card**: User information with edit profile button
2. **Stats**: 4 key metrics (Courses, Friends, Posts, Points)
3. **Quick Actions**: Fast access to main features
4. **Recent Activity**: Timeline of user activities
5. **Recommendations**: Suggested courses to enroll

### 3. **Feed.jsx**
Social media feed component displaying posts from users.

**Features:**
- Create post form with emoji and image support
- Post cards with like/comment/share buttons
- Like functionality with counter
- Responsive design
- Sample posts loaded by default

**Post Card Structure:**
- Author avatar and name
- Timestamp
- Post content
- Image (if available)
- Engagement stats (likes, comments, shares)
- Action buttons (Like, Comment, Share)

**Key Functions:**
- `handlePostSubmit()`: Create new post
- `handleLike()`: Toggle like on post

### 4. **Styling (CSS Files)**

#### StudentLayout.css
- **Header**: Sticky navigation bar with search
- **Sidebar**: Collapsible navigation menu with smooth transitions
- **Content Area**: Responsive main content wrapper
- **Right Sidebar**: Widgets with trending topics and suggestions
- **Responsive Design**: Adapts from desktop (1400px) to mobile (480px)

#### StudentDashboard.css
- **Profile Card**: User profile banner and avatar
- **Stats Container**: Grid layout for key metrics
- **Quick Actions**: 4-column action card grid
- **Activity List**: Timeline view of user activities
- **Recommendations**: Card-based course suggestions

#### Feed.css
- **Create Post**: Form to write and submit new posts
- **Post Card**: Individual post container with interactions
- **Post Stats**: Engagement metrics display
- **Action Buttons**: Like, comment, share functionality
- **Load More**: Button to load additional posts

## 📱 Responsive Breakpoints

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| Desktop | 1200px+ | 3-column layout (sidebar, content, widgets) |
| Tablet | 768px-1199px | 2-column layout (sidebar, content) |
| Mobile | 480px-767px | Single column, collapsible sidebar |
| Small Mobile | <480px | Full width, optimized spacing |

## 🎯 Color Scheme

```css
Primary Color: #007bff (Blue)
Secondary Color: #6c757d (Gray)
Success Color: #28a745 (Green)
Danger Color: #dc3545 (Red)
Light Background: #f8f9fa (Light Gray)
Border Color: #dee2e6 (Gray)
Text Primary: #212529 (Dark)
Text Secondary: #6c757d (Gray)
White: #ffffff
```

## 🚀 Features Implemented

### Feed Features
- [x] Create post form
- [x] Display posts
- [x] Like/unlike posts
- [x] Like counter
- [x] Comment button (UI only)
- [x] Share button (UI only)
- [x] Post timestamps
- [x] User avatars
- [x] Load more button

### Navigation Features
- [x] Main navigation menu
- [x] Collapsible sidebar (mobile)
- [x] Search functionality (UI)
- [x] Notifications icon
- [x] Messages icon
- [x] Logout button
- [x] User profile access
- [x] Settings access

### Dashboard Features
- [x] User profile display
- [x] Profile stats
- [x] Quick actions
- [x] Recent activity
- [x] Course recommendations
- [x] Edit profile button
- [x] User role badges

## 📋 Integration with Existing Components

### Routes (`src/routes/AppRoutes.jsx`)
```jsx
<Route path="/dashboard" element={<StudentDashboard />} />
<Route path="/profile" element={<Profile />} />
<Route path="/privacy" element={<PrivacySettings />} />
```

### Protected Routes
All student pages are wrapped with `<ProtectedRoute>` to ensure only authenticated users can access.

## 🔌 API Integration

The StudentDashboard fetches user profile from:
```
GET /api/v1/users/profile
Header: Authorization: Bearer {accessToken}
```

**Response Expected:**
```json
{
  "id": "uuid",
  "email": "student@upnest.edu",
  "fullName": "Nguyễn Văn A",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```

## 🎨 Customization Guide

### Changing Colors
Edit `:root` CSS variables in `StudentLayout.css`:
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  /* ... */
}
```

### Adding Navigation Items
In `StudentLayout.jsx`, modify `navItems`:
```jsx
const navItems = [
  { icon: '🏠', label: 'Trang chủ', path: '/dashboard' },
  // Add more items here
];
```

### Customizing Profile Card
Edit the `profile-card` styles in `StudentDashboard.css` and modify the banner gradient in `StudentLayout.jsx`.

## 🔄 Component Hierarchy

```
App (with BrowserRouter)
└── AppRoutes
    └── ProtectedRoute
        └── StudentDashboard
            └── StudentLayout
                ├── Header
                ├── MainContainer
                │   ├── Sidebar
                │   ├── Content Area
                │   │   └── Feed (or children)
                │   └── Right Sidebar
```

## 📝 File Locations

```
src/pages/student/
├── StudentLayout.jsx          # Main layout component
├── StudentLayout.css          # Layout styles
├── StudentDashboard.jsx       # Dashboard page (redesigned)
├── StudentDashboard.css       # Dashboard styles
├── Feed.jsx                   # Social feed component
└── Feed.css                   # Feed styles
```

## 🚧 Future Enhancements

- [ ] Implement real post data from backend
- [ ] Add image upload functionality
- [ ] Implement comment system
- [ ] Add notification dropdown
- [ ] Add user search functionality
- [ ] Implement follow/unfollow system
- [ ] Add direct messaging
- [ ] Implement real-time updates (WebSocket)
- [ ] Add infinite scroll for feed
- [ ] Add hashtag search
- [ ] Add user mentions in posts
- [ ] Add emoji picker

## 🐛 Known Issues

- Comment and Share buttons are UI-only (need backend implementation)
- Search bar is non-functional (needs backend search API)
- Notifications dropdown not implemented
- Activity data is hardcoded for demo purposes
- Course recommendations are static

## 🔐 Security Notes

- All routes are protected with JWT authentication
- User tokens stored in localStorage
- Backend validates all API requests
- CORS properly configured for API communication

## 📱 Testing

### Desktop Testing
1. Open browser at `http://localhost:5178`
2. Login with test credentials
3. Verify all navigation works
4. Test create post functionality
5. Test like button functionality

### Mobile Testing
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Verify sidebar collapse/expand works
4. Verify responsive layout
5. Test touch interactions

### Responsive Sizes
- 1920x1080 (Desktop)
- 1366x768 (Laptop)
- 768x1024 (Tablet)
- 480x800 (Mobile)
- 360x640 (Small Mobile)

## 🎯 Performance Tips

1. **Lazy Loading**: Implement lazy loading for Feed component
2. **Image Optimization**: Use image compression for avatars
3. **Virtual Scrolling**: For large feeds, consider virtual scrolling
4. **Caching**: Cache user profile data
5. **Code Splitting**: Split StudentLayout into separate chunks

## 📚 References

- Facebook UI Design Patterns
- Instagram UI/UX Standards
- Modern React Best Practices
- CSS Grid & Flexbox Layout
- Responsive Design Principles

## 👥 Team Notes

- Created: 2025
- Language: Vietnamese (UI text)
- Frontend Framework: React 18+
- CSS Methodology: BEM (Block, Element, Modifier)
- Icon Style: Unicode Emojis

---

**Happy coding! 🚀**
