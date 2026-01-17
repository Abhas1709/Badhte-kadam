import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Swal from "sweetalert2";

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/me/my-applications");
      setApplications(res.data?.applications || []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (jobId) => {
    try {
      const result = await Swal.fire({
        title: "Withdraw application?",
        text: "You can apply again later if the job is still open.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, withdraw",
        cancelButtonText: "Cancel",
      });
      if (!result.isConfirmed) return;
      setWithdrawing(jobId);
      await api.delete(`/jobs/${jobId}/apply`);
      await Swal.fire({
        title: "Withdrawn",
        text: "Your application has been withdrawn.",
        icon: "success",
      });
      await fetchApplications();
    } catch (err) {
      await Swal.fire({
        title: "Withdraw failed",
        text: err?.response?.data?.message || "Please try again.",
        icon: "error",
      });
    } finally {
      setWithdrawing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/student/dashboard" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : applications.length > 0 ? (
          <div className="grid gap-4">
            {applications.map((app, idx) => (
              <motion.div
                key={app.jobId || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{app.jobTitle}</h3>
                    <p className="text-sm text-gray-500 mb-3">{app.company} • {app.location}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {app.salary && (
                        <span>{app.salary}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium
                      ${app.applicationStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                        app.applicationStatus === 'shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                          app.applicationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'}`}>
                      {app.applicationStatus}
                    </span>
                  </div>
                </div>

                {app.recruiter && (
                  <div className="mt-3 text-sm text-gray-600">
                    <div>Recruiter Contact: {app.recruiter.contactEmail}</div>
                    {app.recruiter.companyName && <div>Company: {app.recruiter.companyName}</div>}
                  </div>
                )}

                {(app.applicationStatus === 'shortlisted' || app.applicationStatus === 'accepted' || app.applicationStatus === 'hired') && (
                  <div className="mt-4">
                    <Link to={`/chat/${app.jobId}`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium">
                      <Briefcase size={16} /> Open Chat
                    </Link>
                  </div>
                )}
                {(['applied','shortlisted','accepted'].includes(app.applicationStatus)) && (
                  <div className="mt-3">
                    <button
                      onClick={() => withdraw(app.jobId)}
                      disabled={withdrawing === app.jobId}
                      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium"
                    >
                      {withdrawing === app.jobId ? 'Withdrawing...' : 'Withdraw Application'}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Applications Found</h3>
            <p className="text-gray-500 mt-1">Apply to jobs to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
