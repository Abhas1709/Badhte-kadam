import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    User,
    Mail,
    BookOpen,
    Briefcase,
    FileText,
    Save,
    ArrowLeft,
    Loader
} from 'lucide-react'

export default function StudentProfile() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        fullName: '',
        education: '', // String in backend
        skills: '', // Comma separated for editing, Array for backend
        bio: '',
        resumeUrl: ''
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const res = await api.get('/student/me')
            const data = res.data
            if (data) {
                setFormData({
                    fullName: data.fullName || '',
                    education: data.education || '',
                    skills: data.skills ? data.skills.join(', ') : '', // Convert array to string
                    bio: data.bio || '',
                    resumeUrl: data.resumeUrl || ''
                })
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s) // Convert back to array
            }

            await api.put('/student/me', payload)
            alert("Profile updated successfully!")
            navigate('/student/dashboard')
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Failed to update profile.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-blue-600 font-semibold">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/student/dashboard"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
                        <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
                        <p className="opacity-90">Update your professional details to stand out to recruiters.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Info</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g. B.Tech Computer Science"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Info</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="React, Node.js, Python (comma separated)"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Separate multiple skills with commas</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="url"
                                            name="resumeUrl"
                                            value={formData.resumeUrl}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="https://drive.google.com/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Summary</label>
                            <textarea
                                name="bio"
                                rows={4}
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tell recruiters about yourself..."
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70"
                            >
                                {saving ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
