import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Users,
    Plus,
    LayoutDashboard,
    LogOut,
    MapPin,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    FileText,
    User,
    Link as LinkIcon,
    ExternalLink
} from "lucide-react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, post-job
    const [profile, setProfile] = useState(null);
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [viewApplicant, setViewApplicant] = useState(null); // Selected applicant for detailed view

    // Job Post Form
    const [jobForm, setJobForm] = useState({
        title: "",
        company: "",
        location: "",
        salaryFrom: "",
        salaryTo: "",
        type: "full-time", // lowercase to match backend enum
        description: "",
        skills: "",
        experience: ""
    });

    useEffect(() => {
        fetchProfile();
        fetchMyJobs();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/recruiter/me");
            setProfile(res.data);
            // Pre-fill company name if available
            if (res.data.companyName) {
                setJobForm(prev => ({ ...prev, company: res.data.companyName }));
            }
        } catch (error) {
    
          console.error("Fetch jobs error", error);
        }
    };

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/jobs/me/my-jobs");
            setMyJobs(res.data?.jobs || []);
        } catch (error) {
            console.error("Fetch jobs error", error);
            setMyJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: jobForm.title,
                description: jobForm.description, // + (jobForm.experience ? `\n\nExperience Required: ${jobForm.experience}` : ""),
                skills: jobForm.skills.split(",").map(s => s.trim()),
                location: jobForm.location,
                jobType: jobForm.type, // Map 'type' to 'jobType'
                salaryFrom: Number(jobForm.salaryFrom),
                salaryTo: Number(jobForm.salaryTo)
            };
            await api.post("/jobs", payload);
            alert("Job Posted Successfully!");
            setActiveTab("dashboard");
            fetchMyJobs();
            setJobForm({ ...jobForm, title: "", description: "", skills: "", salaryFrom: "", salaryTo: "" });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to post job");
        }
    };

    const handleViewApplicants = async (jobId) => {
        if (selectedJob === jobId) {
            setSelectedJob(null);
            setApplicants([]);
            return;
        }

        try {
            const res = await api.get(`/jobs/${jobId}/applicants`);
            console.log("Applicants Response:", res.data); // Debug
            setApplicants(res.data.applicants || []); // Backend returns { success, message, applicants }
            setSelectedJob(jobId);
        } catch (error) {
            console.error("Fetch applicants error", error);
        }
    };

    const handleStatusUpdate = async (jobId, applicantId, newStatus) => {
        try {
            await api.patch(`/jobs/${jobId}/applications/${applicantId}/status`, { status: newStatus });
            // Refresh applicants
            const res = await api.get(`/jobs/${jobId}/applicants`);
            setApplicants(res.data.applicants || []); // Backend returns boolean success and applicants array
        } catch (error) {
            console.log(error)
            alert("Failed to update status");
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/recruiter/me', profile); // Correct endpoint
            alert("Profile updated!");
        } catch (error) {
            console.error("Profile update error", error);
            alert("Failed to update profile");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <Briefcase className="h-6 w-6" />
                        <span>Recruiter Panel</span>
                    </div>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "dashboard" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("post-job")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "post-job" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        <Plus size={20} />
                        Post New Job
                    </button>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "profile" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        <User size={20} />
                        Company Profile
                    </button>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {profile?.fullName?.[0] || "R"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{profile?.fullName || "Recruiter"}</p>
                            <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-8">
                    <span className="font-bold text-lg text-indigo-600">Recruiter Panel</span>
                    <button onClick={handleLogout}><LogOut className="text-gray-500" /></button>
                </div>

                {activeTab === "dashboard" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                            <p className="text-gray-500">Manage your posted jobs and view applicants</p>
                        </header>

                        <div className="grid gap-6">
                            {myJobs.length === 0 ? (
                                <div className="bg-white p-8 rounded-2xl border text-center">
                                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">No Jobs Posted Yet</h3>
                                    <button onClick={() => setActiveTab('post-job')} className="mt-4 text-indigo-600 font-medium hover:underline">Post your first job</button>
                                </div>
                            ) : (
                                myJobs.map(job => (
                                    <div key={job._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                                <p className="text-sm text-gray-500">{job.location} • {job.jobType}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Active</span>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{job.applications?.length || 0} Applicants</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleViewApplicants(job._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Users size={16} />
                                                {selectedJob === job._id ? "Hide Applicants" : "View Applicants"}
                                                {selectedJob === job._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </div>

                                        {/* Applicants Dropdown */}
                                        <AnimatePresence>
                                            {selectedJob === job._id && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "auto" }}
                                                    exit={{ height: 0 }}
                                                    className="bg-gray-50 border-t border-gray-100"
                                                >
                                                    <div className="p-6 space-y-4">
                                                        {applicants.length > 0 ? applicants.map(app => (
                                                            <div key={app.applicant.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">{app.applicant?.studentProfile?.fullName || "Student"}</h4>
                                                                    <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                                                                    <p className="text-xs text-blue-600 mt-1">Status: {app.status}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => setViewApplicant(app)}
                                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                                                                    >
                                                                        Profile
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(job._id, app.applicant.id, "shortlisted")}
                                                                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                                                                    >
                                                                        Shortlist
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(job._id, app.applicant.id, "accepted")}
                                                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(job._id, app.applicant.id, "rejected")}
                                                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )) : (
                                                            <p className="text-center text-gray-500 py-4">No applicants yet.</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Applicant Details Modal */}
                <AnimatePresence>
                    {viewApplicant && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h2 className="text-xl font-bold text-gray-900">Applicant Details</h2>
                                    <button onClick={() => setViewApplicant(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                            {viewApplicant.applicant.studentProfile?.fullName?.[0] || "S"}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{viewApplicant.applicant.studentProfile?.fullName || "Student Name"}</h3>
                                            <p className="text-gray-500">{viewApplicant.applicant.email}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium
                                                    ${viewApplicant.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        viewApplicant.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {viewApplicant.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Briefcase size={18} /> Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {viewApplicant.applicant.studentProfile?.skills?.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">{skill}</span>
                                            )) || <p className="text-gray-400 italic">No skills listed</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><FileText size={18} /> Bio</h4>
                                        <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{viewApplicant.applicant.studentProfile?.bio || "No bio provided."}</p>
                                    </div>

                                    {/* Cover Letter if exists in application */}
                                    {viewApplicant.coverLetter && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                            <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{viewApplicant.coverLetter}</p>
                                        </div>
                                    )}

                                    {viewApplicant.applicant.studentProfile?.resumeUrl && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><LinkIcon size={18} /> Resume</h4>
                                            <a href={viewApplicant.applicant.studentProfile.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                                                View Resume <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                        <button onClick={() => { handleStatusUpdate(selectedJob, viewApplicant.applicant.id, "shortlisted"); setViewApplicant(null); }} className="py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium">Shortlist</button>
                                        <button onClick={() => { handleStatusUpdate(selectedJob, viewApplicant.applicant.id, "accepted"); setViewApplicant(null); }} className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">Accept</button>
                                        <button onClick={() => { handleStatusUpdate(selectedJob, viewApplicant.applicant.id, "hired"); setViewApplicant(null); }} className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Hire</button>
                                        <button onClick={() => { handleStatusUpdate(selectedJob, viewApplicant.applicant.id, "rejected"); setViewApplicant(null); }} className="py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-medium">Reject</button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeTab === "profile" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
                            <p className="text-gray-500">Manage your company details</p>
                        </header>
                        <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                <input value={profile.companyName || ''} onChange={e => setProfile({ ...profile, companyName: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Company Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                <input value={profile.companyWebsite || ''} onChange={e => setProfile({ ...profile, companyWebsite: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="https://example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                                <textarea rows={4} value={profile.about || ''} onChange={e => setProfile({ ...profile, about: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="About the company..." />
                            </div>
                            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">Save Profile</button>
                        </form>
                    </motion.div>
                )}

                {activeTab === "post-job" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
                            <p className="text-gray-500">Find the perfect candidate for your team</p>
                        </header>

                        <form onSubmit={handlePostJob} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                    <input
                                        required
                                        value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. Senior Frontend Dev"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                    <input
                                        required
                                        value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Company Name"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Remote, City, etc."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                                    <div className="relative grid grid-cols-2 gap-2">
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                value={jobForm.salaryFrom} onChange={e => setJobForm({ ...jobForm, salaryFrom: e.target.value })}
                                                className="w-full pl-8 pr-2 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                                placeholder="Min"
                                            />
                                        </div>
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                value={jobForm.salaryTo} onChange={e => setJobForm({ ...jobForm, salaryTo: e.target.value })}
                                                className="w-full pl-8 pr-2 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                    <select
                                        value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                    <input
                                        value={jobForm.experience} onChange={e => setJobForm({ ...jobForm, experience: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. 3+ Years"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                                <input
                                    value={jobForm.skills} onChange={e => setJobForm({ ...jobForm, skills: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="React, Node.js, AWS"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    placeholder="Describe the role responsibilities and requirements..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setActiveTab("dashboard")} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors">Post Job</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
