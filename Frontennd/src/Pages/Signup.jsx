import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Building, 
  MapPin,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Upload
} from 'lucide-react'

function Signup() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get role from navigation state, default to student
  const role = location.state?.role || 'student'
  
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: role,
    
    // Student specific fields
    educationLevel: '',
    institution: '',
    graduationYear: '',
    course: '',
    skills: [],
    experience: '',
    currentCTC: '',
    expectedCTC: '',
    resume: null,
    
    // Recruiter specific fields
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    designation: '',
    hiringFor: [],
    companyLocation: '',
    hrEmail: '',
    companyDescription: ''
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [skillsInput, setSkillsInput] = useState('')
  const [hiringInput, setHiringInput] = useState('')

  // Update role when navigation changes
  useEffect(() => {
    if (location.state?.role) {
      setFormData(prev => ({ ...prev, role: location.state.role }))
    }
  }, [location.state?.role])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSkillsAdd = () => {
    if (skillsInput.trim() && !formData.skills.includes(skillsInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillsInput.trim()]
      })
      setSkillsInput('')
    }
  }

  const handleSkillsRemove = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    })
  }

  const handleHiringAdd = () => {
    if (hiringInput.trim() && !formData.hiringFor.includes(hiringInput.trim())) {
      setFormData({
        ...formData,
        hiringFor: [...formData.hiringFor, hiringInput.trim()]
      })
      setHiringInput('')
    }
  }

  const handleHiringRemove = (position) => {
    setFormData({
      ...formData,
      hiringFor: formData.hiringFor.filter(h => h !== position)
    })
  }

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSignupSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            email: formData.email,
            role: formData.role 
          } 
        })
      }, 2000)
    }, 1500)
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const switchRole = () => {
    const newRole = formData.role === 'student' ? 'recruiter' : 'student'
    setFormData({
      ...formData,
      role: newRole,
      skills: [],
      hiringFor: []
    })
    setCurrentStep(1)
  }

  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return formData.email && formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword
      case 2:
        return formData.fullName && formData.phone
      case 3:
        if (formData.role === 'student') {
          return true // Optional fields in step 3
        } else {
          return formData.companyName && formData.designation
        }
      default:
        return false
    }
  }

  const educationLevels = [
    'High School',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Other'
  ]

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ]

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Entertainment',
    'Other'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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
                Create Your Account
              </h1>
              
              <div className="flex items-center justify-center space-x-3 mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Sign up as {formData.role === 'student' ? 'Student' : 'Recruiter'}
                </p>
                <button
                  onClick={switchRole}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Switch to {formData.role === 'student' ? 'Recruiter' : 'Student'}
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step === currentStep
                        ? 'bg-blue-600 text-white'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {step < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4 text-sm">
                <span className={currentStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  Account Details
                </span>
                <span className={currentStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  Personal Info
                </span>
                <span className={currentStep === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  {formData.role === 'student' ? 'Education & Skills' : 'Company Details'}
                </span>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <AnimatePresence mode="wait">
              {/* Success Message */}
              {signupSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                    <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Account Created Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Welcome to Badhte-Kadam! Your {formData.role} account has been created.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500">
                    Redirecting to login page...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Step 1: Account Details */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Step 1: Account Details
                      </h2>
                      
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              minLength="6"
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
                          <p className="text-xs text-gray-500 mt-1">
                            Must be at least 6 characters
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="••••••••"
                              required
                              className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                              )}
                            </button>
                          </div>
                          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Personal Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Step 2: Personal Information
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                            required
                            className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Role-specific Information */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Step 3: {formData.role === 'student' ? 'Education & Skills' : 'Company Details'}
                        <span className="text-sm font-normal text-gray-500 ml-2">(Optional - can add later)</span>
                      </h2>

                      {/* Student Fields */}
                      {formData.role === 'student' ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Education Level
                              </label>
                              <select
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              >
                                <option value="">Select Education Level</option>
                                {educationLevels.map(level => (
                                  <option key={level} value={level}>{level}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Institution
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="institution"
                                  value={formData.institution}
                                  onChange={handleChange}
                                  placeholder="University/College Name"
                                  className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Course/Degree
                              </label>
                              <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                placeholder="e.g., Computer Science"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Graduation Year
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name="graduationYear"
                                  value={formData.graduationYear}
                                  onChange={handleChange}
                                  placeholder="2024"
                                  min="1900"
                                  max="2100"
                                  className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skills
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={skillsInput}
                                  onChange={(e) => setSkillsInput(e.target.value)}
                                  onKeyPress={(e) => handleKeyPress(e, handleSkillsAdd)}
                                  placeholder="Add a skill"
                                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <button
                                  type="button"
                                  onClick={handleSkillsAdd}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {formData.skills.map(skill => (
                                  <div
                                    key={skill}
                                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                                  >
                                    <span>{skill}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleSkillsRemove(skill)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Experience
                              </label>
                              <select
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              >
                                <option value="">Select Experience</option>
                                <option value="fresher">Fresher (0 years)</option>
                                <option value="1-3">1-3 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5-10">5-10 years</option>
                                <option value="10+">10+ years</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current CTC (₹)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name="currentCTC"
                                  value={formData.currentCTC}
                                  onChange={handleChange}
                                  placeholder="e.g., 500000"
                                  className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Expected CTC (₹)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name="expectedCTC"
                                  value={formData.expectedCTC}
                                  onChange={handleChange}
                                  placeholder="e.g., 700000"
                                  className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Upload Resume (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Drag & drop your resume or{' '}
                                <label className="text-blue-600 cursor-pointer hover:text-blue-500">
                                  browse
                                  <input
                                    type="file"
                                    name="resume"
                                    onChange={handleChange}
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                  />
                                </label>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PDF, DOC, DOCX up to 5MB
                              </p>
                              {formData.resume && (
                                <p className="text-sm text-green-600 mt-2">
                                  ✓ {formData.resume.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Recruiter Fields */
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company Name *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleChange}
                                  placeholder="Your Company Name"
                                  required
                                  className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company Website
                              </label>
                              <input
                                type="url"
                                name="companyWebsite"
                                value={formData.companyWebsite}
                                onChange={handleChange}
                                placeholder="https://company.com"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company Size
                              </label>
                              <select
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              >
                                <option value="">Select Company Size</option>
                                {companySizes.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Industry
                              </label>
                              <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              >
                                <option value="">Select Industry</option>
                                {industries.map(industry => (
                                  <option key={industry} value={industry}>{industry}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Designation *
                              </label>
                              <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="e.g., HR Manager"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company Location
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="companyLocation"
                                  value={formData.companyLocation}
                                  onChange={handleChange}
                                  placeholder="City, State"
                                  className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Hiring For Positions
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={hiringInput}
                                onChange={(e) => setHiringInput(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleHiringAdd)}
                                placeholder="Add a position (e.g., Software Engineer)"
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              />
                              <button
                                type="button"
                                onClick={handleHiringAdd}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.hiringFor.map(position => (
                                <div
                                  key={position}
                                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                                >
                                  <span>{position}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleHiringRemove(position)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                    </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              HR/Contact Email
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                name="hrEmail"
                                value={formData.hrEmail}
                                onChange={handleChange}
                                placeholder="hr@company.com"
                                className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              />
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Company Description
                            </label>
                            <textarea
                              name="companyDescription"
                              value={formData.companyDescription}
                              onChange={handleChange}
                              placeholder="Brief description of your company..."
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                        >
                          ← Back
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStepValid()}
                          className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                            !isStepValid() ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-600 hover:shadow-lg'
                          }`}
                        >
                          Continue
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading || !isStepValid()}
                          className={`px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg transition-all duration-300 ${
                            loading || !isStepValid() ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-600 hover:shadow-lg'
                          }`}
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Already have account */}
            {!signupSuccess && (
              <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    state={{ role: formData.role }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            )}
          </form>
        </motion.div>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{' '}
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

export default Signup