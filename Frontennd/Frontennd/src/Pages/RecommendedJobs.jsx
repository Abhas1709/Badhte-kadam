import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, MapPin, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/me/recommended");
      setJobs(res.data?.jobs || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/student/dashboard" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Recommended Jobs</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {jobs.length > 0 ? (
                jobs.map((job, idx) => (
                  <motion.div
                    key={job._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.location} • {job.jobType}</p>
                      </div>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-md font-medium">Match {job.matchScore}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(job.skills || []).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{skill}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                      {job.salaryFrom && job.salaryTo && (
                        <span className="inline-flex items-center gap-1">
                          <DollarSign size={16} /> {job.salaryFrom} - {job.salaryTo}
                        </span>
                      )}
                      {job.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={16} /> {job.location}
                        </span>
                      )}
                    </div>
                    <div className="mt-6">
                      <Link to={`/student/dashboard`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium">
                        <Briefcase size={16} /> View in Jobs
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 bg-white p-8 rounded-2xl border text-center">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No recommendations yet</h3>
                  <p className="text-gray-500 mt-1">Update your profile skills for better matches.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
