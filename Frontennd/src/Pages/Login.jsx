import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setShowOTP(true)
      setCountdown(60) // 60 seconds for OTP
    }, 1500)
  }

  const handleOTPSubmit = async () => {
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      alert('Please enter complete 6-digit OTP')
      return
    }

    setLoading(true)
    
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false)
      setLoginSuccess(true)
      
      // Redirect after success animation
      setTimeout(() => {
        // Redirect based on role
        if (formData.role === 'student') {
          navigate('/student/dashboard', { 
            state: { 
              email: formData.email,
              role: formData.role 
            } 
          })
        } else {
          navigate('/recruiter/dashboard', { 
            state: { 
              email: formData.email,
              role: formData.role 
            } 
          })
        }
      }, 2000)
    }, 1500)
  }

  const resendOTP = () => {
    if (countdown === 0) {
      setCountdown(60)
      // In real app, call API to resend OTP
      console.log('Resending OTP to:', formData.email)
    }
  }

  const switchRole = () => {
    const newRole = formData.role === 'student' ? 'recruiter' : 'student'
    setFormData({
      ...formData,
      role: newRole
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 mb-4">
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

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Remember me
                      </span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-500 transition-all duration-300 ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                  >
                    {loading ? 'Verifying...' : 'Login & Send OTP'}
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Don't have an account?{' '}
                      <Link 
                        to="/signup" 
                        state={{ role: formData.role }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.form>
            ) : (
              /* OTP Verification */
              <motion.div
                key="otp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8"
              >
                <div className="space-y-6">
                  {/* Success Animation */}
                  {loginSuccess && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Login Successful!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Redirecting to {formData.role === 'student' ? 'Student' : 'Recruiter'} Dashboard...
                      </p>
                    </motion.div>
                  )}

                  {!loginSuccess && (
                    <>
                      {/* OTP Header */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Enter Verification Code
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          We've sent a 6-digit code to
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.email}
                        </p>
                      </div>

                      {/* OTP Inputs */}
                      <div className="space-y-4">
                        <div className="flex justify-center space-x-3">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength="1"
                              value={otp[index]}
                              onChange={(e) => handleOTPChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                          ))}
                        </div>

                        {/* Countdown & Resend */}
                        <div className="text-center">
                          {countdown > 0 ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                              <Clock className="h-4 w-4" />
                              Resend code in {countdown} seconds
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={resendOTP}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium"
                            >
                              Resend Verification Code
                            </button>
                          )}
                        </div>

                        {/* Verify Button */}
                        <button
                          type="button"
                          onClick={handleOTPSubmit}
                          disabled={loading || otp.some(digit => digit === '')}
                          className={`w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 ${
                            loading || otp.some(digit => digit === '')
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:from-blue-700 hover:to-blue-600 hover:shadow-lg'
                          }`}
                        >
                          {loading ? 'Verifying OTP...' : 'Verify & Continue'}
                        </button>

                        {/* Back to Login */}
                        <button
                          type="button"
                          onClick={() => setShowOTP(false)}
                          className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                        >
                          Back to Login
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By logging in, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login