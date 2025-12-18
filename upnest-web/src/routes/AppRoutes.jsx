import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/profile/Profile';
import PrivacySettings from '../pages/privacy/PrivacySettings';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentNewsFeed from '../pages/student/StudentNewsFeed';
import BlogSection from '../pages/student/BlogSection';
import CreatePost from '../pages/student/CreatePost';
import StudentLayout from '../pages/student/StudentLayout';
import ClassroomView from '../pages/classroom/ClassroomView';
import ConnectionsPage from '../pages/student/ConnectionsPage';

/**
 * AppRoutes - Tất cả routes của app
 */
export default function AppRoutes() {
  return (
    <Routes>
          {/* Root path - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <StudentDashboard />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/news-feed"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <StudentNewsFeed />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <BlogSection />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <ClassroomView />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <ConnectionsPage />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <PrivacySettings />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
  );
}
