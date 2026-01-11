import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './Pages/landingPage'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import StudentDashboard from './Pages/StudentDashboard';
import RecruiterDashboard from './Pages/RecruiterDashboard';
import StudentProfile from './Pages/StudentProfile';
import ForgotPassword from './Pages/ForgotPassword';

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

        {/* Dashboard Routes - Protected in real app or handled by component redirect */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;