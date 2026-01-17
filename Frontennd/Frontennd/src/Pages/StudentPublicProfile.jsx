import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { motion } from "framer-motion";
import { User, Mail, BookOpen, FileText, ArrowLeft, ExternalLink } from "lucide-react";
import Footer from "../Component/Footer";

export default function StudentPublicProfile() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/student/public/${userId}`);
      setProfile(res.data?.profile || null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/student/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="bg-white rounded-2xl border p-8 text-center">
            <p className="text-gray-600">Profile not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-6">
        <Link to="/student/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold mb-2">Public Profile</h1>
            <p className="opacity-90">Viewable by recruiters</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold">
                {(profile.fullName || "S")[0]}
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} /> {profile.fullName || "Student"}
                </div>
                <div className="text-gray-600 flex items-center gap-2">
                  <Mail size={18} /> {profile.email || "N/A"}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen size={18} /> Education
              </h3>
              <p className="text-gray-700">{profile.education || "Not specified"}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || []).length > 0 ? (
                  profile.skills.map((s, i) => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">{s}</span>)
                ) : (
                  <span className="text-gray-500">No skills listed</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText size={18} /> Bio
              </h3>
              <p className="text-gray-700">{profile.bio || "No bio provided."}</p>
            </div>

            {profile.resumeUrl && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume</h3>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                  View Resume <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <Footer role="student" />
    </div>
  );
}
