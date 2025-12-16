# 🚀 UpNest Education - Quick Reference Card

## Getting Started (5 Minutes)

### 1️⃣ Start Backend
```bash
cd edu
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### 2️⃣ Start Frontend
```bash
cd upnest-web
npm run dev
# Frontend runs on http://localhost:5178
```

### 3️⃣ Login with Test Account
```
Email: student@upnest.edu
Password: password123
```

---

## 📁 Key Files Guide

| File | Purpose | Edit For |
|------|---------|----------|
| `StudentLayout.jsx` | Main layout wrapper | Nav items, header |
| `StudentLayout.css` | Layout styles | Colors, spacing, responsive |
| `StudentDashboard.jsx` | Dashboard page | Profile, stats, activities |
| `StudentDashboard.css` | Dashboard styles | Card styles, grid layout |
| `Feed.jsx` | Social feed | Posts, engagement |
| `Feed.css` | Feed styles | Post card, buttons |
| `AppRoutes.jsx` | Route definitions | Add new routes |
| `main.jsx` | App entry point | Providers, Router |

---

## 🎨 Customization Cheat Sheet

### Change Primary Color
```css
/* In StudentLayout.css */
:root {
  --primary-color: #YOUR_COLOR;
}
```

### Add Navigation Item
```jsx
// In StudentLayout.jsx
const navItems = [
  // ... existing items
  { icon: '📚', label: 'New Page', path: '/new-page' },
];
```

### Add New Route
```jsx
// In AppRoutes.jsx
<Route path="/new-page" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
```

### Change Colors Throughout
```css
:root {
  --primary-color: #007bff;      /* Links, buttons */
  --secondary-color: #6c757d;    /* Secondary text */
  --success-color: #28a745;      /* Success messages */
  --danger-color: #dc3545;       /* Danger, delete */
  --light-bg: #f8f9fa;           /* Backgrounds */
}
```

---

## 🔐 Authentication Quick Guide

### Check Token
```javascript
const token = localStorage.getItem('accessToken');
console.log(token ? 'Logged in' : 'Not logged in');
```

### Get Current User
```javascript
const response = await fetch('http://localhost:8080/api/v1/users/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
const user = await response.json();
```

### Logout
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
navigate('/login');
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1200px) {
  /* 3-column layout */
}

/* Tablet */
@media (max-width: 1199px) and (min-width: 768px) {
  /* 2-column layout */
}

/* Mobile */
@media (max-width: 767px) {
  /* Collapsible sidebar */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Full-width layout */
}
```

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
```

### User Profile
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
GET    /api/v1/users/{id}
```

### Social Features (Ready to connect)
```
GET    /api/v1/feed
POST   /api/v1/posts
GET    /api/v1/users/search
POST   /api/v1/users/{id}/follow
```

---

## 🚨 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "Port 8080 in use" | Kill process: `lsof -ti:8080 \| xargs kill -9` |
| Styles not loading | Clear cache: `Ctrl+Shift+Delete` then refresh |
| API request failing | Check backend is running + CORS config |
| Navigation not working | Verify BrowserRouter in main.jsx |
| Component not showing | Check imports and route path |
| Token expired | Clear localStorage and login again |

---

## 💻 Development Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style

# Backend
mvn clean install    # Build project
mvn spring-boot:run  # Run application
mvn test             # Run tests
mvn clean            # Clean build directory
```

---

## 📊 Component Structure

```
App (main.jsx)
├── BrowserRouter
└── AppRoutes
    ├── Login (public)
    ├── Register (public)
    └── Protected Routes
        ├── StudentDashboard
        │   └── StudentLayout
        │       ├── Header
        │       ├── Sidebar
        │       ├── Feed/Content
        │       └── Widgets
        ├── Profile
        └── PrivacySettings
```

---

## 🎯 State Management Pattern

```jsx
// Simple local state
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

// Fetch data effect
useEffect(() => {
  setLoading(true);
  fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

---

## 🎨 CSS Naming Convention

```css
/* Block */
.sidebar { }

/* Block-Element */
.sidebar-header { }
.sidebar-footer { }

/* Block-Element-Modifier */
.sidebar.open { }
.nav-item.active { }
.btn.btn-primary { }
```

---

## 📝 Adding New Features

### 1. Create Component
```jsx
export default function NewFeature() {
  return <div>New Feature Content</div>;
}
```

### 2. Create Styles
```css
.new-feature { }
.new-feature-item { }
```

### 3. Add Route
```jsx
<Route path="/new-feature" element={<ProtectedRoute><NewFeature /></ProtectedRoute>} />
```

### 4. Add Navigation
```jsx
{ icon: '🆕', label: 'New Feature', path: '/new-feature' }
```

---

## 🔧 Debugging Tips

### Check Network Requests
```javascript
// DevTools > Network tab
// Look for API requests and responses
```

### Check Local Storage
```javascript
// DevTools > Application > Local Storage
console.log(localStorage);
```

### Check Component State
```javascript
// React DevTools extension
// Inspect component props and state
```

### Check Console Errors
```javascript
// DevTools > Console
// Look for JavaScript errors
```

---

## 🌍 Environment Variables

Create `.env` file (if needed):
```
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=UpNest Education
```

Usage in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📦 Dependencies

### Frontend
- react: 18+
- react-router-dom: 6+
- vite: 5+

### Backend
- spring-boot: 3.3.5
- spring-security: 6+
- jjwt: 0.11+
- hibernate: 6.5.3

---

## ✅ Pre-Deployment Checklist

- [ ] Backend running without errors
- [ ] Frontend compiling without errors
- [ ] Database seeded with data
- [ ] Test login works
- [ ] All routes accessible
- [ ] API endpoints responding
- [ ] Responsive design tested
- [ ] No console errors
- [ ] Token management working
- [ ] Protected routes secured

---

## 🎓 Resources

- [React Docs](https://react.dev)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)

---

## 📞 Getting Help

1. **Check Logs**: Look at console output
2. **Check Documentation**: See README.md files
3. **Check Code**: Look at similar components
4. **Search Online**: Stack Overflow, GitHub
5. **Ask Team**: Slack/Discord/Email

---

## 🎉 You're Ready!

```bash
npm run dev              # Start developing
# Make changes
git commit -m "message"  # Commit changes
# Test everything
npm run build           # Build for production
```

---

**Happy Coding! 🚀**

*UpNest Education 2025*
