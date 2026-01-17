import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './Pages/landingPage'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import StudentDashboard from './Pages/StudentDashboard';
import RecruiterDashboard from './Pages/RecruiterDashboard';
import StudentProfile from './Pages/StudentProfile';
import StudentPublicProfile from './Pages/StudentPublicProfile';
import RecruiterPublicProfile from './Pages/RecruiterPublicProfile';
import ForgotPassword from './Pages/ForgotPassword';
import StudentApplications from './Pages/StudentApplications';
import RecommendedJobs from './Pages/RecommendedJobs';
import ProtectedRoute from './utils/ProtectedRoute';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute roles={['student']}><StudentApplications /></ProtectedRoute>} />
        <Route path="/student/recommended" element={<ProtectedRoute roles={['student']}><RecommendedJobs /></ProtectedRoute>} />
        <Route path="/chat/:jobId" element={<ProtectedRoute roles={['student']}><ChatPage /></ProtectedRoute>} />
        <Route path="/student/public/:userId" element={<StudentPublicProfile />} />

        {/* Protected Recruiter Routes */}
        <Route path="/recruiter/dashboard" element={<ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/public/:userId" element={<RecruiterPublicProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
