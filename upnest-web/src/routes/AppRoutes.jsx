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
import MyCourses from '../pages/student/MyCourses';
import Library from '../pages/student/Library';
import CoursePlayer from '../pages/student/CoursePlayer';
import Feed from '../pages/student/Feed';
import Messaging from '../pages/student/Messaging';
import Achievements from '../pages/student/Achievements';
import CareerOrientation from '../pages/student/CareerOrientation';
import ProfessionalRoadmap from '../pages/student/ProfessionalRoadmap';
import ReaderView from '../pages/student/ReaderView';

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
            path="/my-courses"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <MyCourses />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <Library />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <Feed />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messaging />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <Achievements />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/career/:pathCode?"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <CareerOrientation />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/professional-roadmap"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <ProfessionalRoadmap />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId?"
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reader/:itemId/:type"
            element={
              <ProtectedRoute>
                <ReaderView />
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
