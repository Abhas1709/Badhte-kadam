import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react'

function Login() {
  const location = useLocation()
  const navigate = useNavigate()

  // Get role from navigation state, default to student
  const role = location.state?.role || 'student'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: role
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  /* -------------------- API HANDLERS -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      // Use actual roles from backend response to decide navigation
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setLoading(false);
      setLoginSuccess(true);

      const roles = Array.isArray(user?.roles) ? user.roles : [];
      setTimeout(() => {
        if (roles.includes('recruiter')) {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || 'Please try again.',
        icon: 'error'
      });
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    // Placeholder if we ever need it for 2FA
  }

  const resendOTP = () => {
    // Placeholder
  }

  const switchRole = () => {
    const newRole = formData.role === 'student' ? 'recruiter' : 'student'
    setFormData({
      ...formData,
      role: newRole
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-linear-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 mb-4">
                {formData.role === 'student' ? (
                  <GraduationCap className="h-8 w-8 text-white" />
                ) : (
                  <Briefcase className="h-8 w-8 text-white" />
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>

              <div className="flex items-center justify-center space-x-3">
                <p className="text-gray-600 dark:text-gray-400">
                  Login as {formData.role === 'student' ? 'Student' : 'Recruiter'}
                </p>
                <button
                  onClick={switchRole}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Switch to {formData.role === 'student' ? 'Recruiter' : 'Student'}
                </button>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="p-8"
              >
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8"
              >
                {/* OTP content intentionally kept minimal for login */}
                <p className="text-center text-gray-600">Enter OTP (if enabled)</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success State */}
          <AnimatePresence>
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 border-t border-gray-200 text-center"
              >
                <div className="inline-flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Login successful!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
