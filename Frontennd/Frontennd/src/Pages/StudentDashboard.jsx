import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Briefcase,
    MapPin,
    DollarSign,
    User,
    LogOut,
    ChevronRight,
    Bookmark
} from "lucide-react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import JobDetailsModal from "../Component/JobDetailsModal";
import Swal from "sweetalert2";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [applying, setApplying] = useState(null);
    const [userId, setUserId] = useState(null);

    // Modal State
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Debug: Check JWT token and roles
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("JWT Payload:", payload);
                console.log("User Roles:", payload.roles);
                setUserId(payload.id);
            } catch (e) {
                console.error("Failed to decode token:", e);
            }
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, jobsRes] = await Promise.all([
                api.get("/student/me").catch(() => ({ data: { name: "Student" } })),
                api.get("/jobs")
            ]);

            setProfile(profileRes.data);
            setJobs(jobsRes.data?.jobs || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setJobs([]); // Fallback to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        try {
            console.log("=== APPLY STARTED ===", jobId);
            setApplying(jobId);
            // Must send an empty object (or actual data) so Content-Type header is set
            console.log("Sending POST request to:", `/jobs/${jobId}/apply`);
            const response = await api.post(`/jobs/${jobId}/apply`, {});
            console.log("=== APPLY SUCCESS ===", response.data);
            Swal.fire({
                title: "Applied Successfully",
                text: "Your application has been submitted.",
                icon: "success"
            });
            fetchData(); // Refresh UI to show "Applied" status
        } catch (error) {
            console.error("=== APPLY ERROR ===");
            console.error("Apply error:", error);
            console.error("Error response:", error.response?.data); // Show backend error
            console.error("Error status:", error.response?.status);
            const errorMsg = error.response?.data?.message || error.message || "Failed to apply";
            Swal.fire({
                title: "Apply Failed",
                text: errorMsg,
                icon: "error"
            });
        } finally {
            console.log("=== APPLY FINISHED ===");
            setApplying(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const filteredJobs = jobs.filter(job => {
        const term = searchTerm.toLowerCase();
        return job.title?.toLowerCase().includes(term) ||
            job.companyName?.toLowerCase?.().includes(term);
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                BK
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Badhte Kadam
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
                                <User size={16} />
                                <Link to="/student/profile" className="hover:underline">
                                    {profile?.fullName || "Student"}
                                </Link>
                            </div>
                            {userId && (
                                <Link to={`/student/public/${userId}`} className="text-xs text-gray-500 hover:text-gray-900 underline">
                                    Public Profile
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
                    <p className="text-gray-500 mt-2">Explore opportunities tailored for you.</p>
                </div>

                {/* Search */}
                <div className="relative mb-8 max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
                        placeholder="Search by job title, company, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="mb-8 flex gap-3">
                    <Link to="/student/applications" className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium inline-flex items-center gap-2">
                        <Bookmark size={16} /> My Applications
                    </Link>
                    <Link to="/student/recommended" className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium inline-flex items-center gap-2">
                        <ChevronRight size={16} /> Recommended Jobs
                    </Link>
                </div>

                {/* Available Jobs */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
                </div>

                {/* Job Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job, idx) => (
                                <motion.div
                                    key={job._id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => { setSelectedJobId(job._id); setIsModalOpen(true); }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-gray-600">
                                            {(job.companyName || "C")?.[0]}
                                        </div>
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full capitalize">
                                            {job.jobType || "full-time"}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {job.title}
                                    </h3>
                                    {/* Display company name if available in backend logic */}
                                    <p className="text-sm text-gray-500 font-medium mb-4">{job.companyName || "Company"}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin size={16} className="mr-2 text-gray-400" />
                                            {job.location || "Remote"}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <DollarSign size={16} className="mr-2 text-gray-400" />
                                            {job.salaryFrom ? `$${job.salaryFrom} - $${job.salaryTo}` : "Salary: Disclosed on Match"}
                                        </div>
                                    </div>

                                    {job.applications?.some(app => (app.applicant?.toString?.() || app.applicant) === userId) ? (
                                        <div className={`w-full py-2.5 rounded-lg flex items-center justify-center font-medium
                                            ${(() => {
                                                const status = job.applications.find(app => (app.applicant?.toString?.() || app.applicant) === userId).status;
                                                switch (status) {
                                                    case 'accepted': return 'bg-green-100 text-green-700';
                                                    case 'rejected': return 'bg-red-100 text-red-700';
                                                    default: return 'bg-blue-100 text-blue-700';
                                                }
                                            })()}
                                        `}>
                                            {(() => {
                                                const status = job.applications.find(app => (app.applicant?.toString?.() || app.applicant) === userId).status;
                                                return status.charAt(0).toUpperCase() + status.slice(1);
                                            })()}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleApply(job._id); }}
                                            disabled={applying === job._id}
                                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            {applying === job._id ? "Applying..." : "Quick Apply"}
                                            <ChevronRight size={16} />
                                        </button>
                                    )}

                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                <p>No jobs found matching your criteria.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <JobDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jobId={selectedJobId}
                onApply={handleApply}
            />
            {/* <Footer role="student" /> */}
        </div>
    );
}
