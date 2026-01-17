import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { motion } from "framer-motion";
import { User, Mail, Link as LinkIcon, MapPin, ArrowLeft, ExternalLink } from "lucide-react";
import Footer from "../Component/Footer";

export default function RecruiterPublicProfile() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/recruiter/public/${userId}`);
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
        <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/recruiter/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="bg-white rounded-2xl border p-8 text-center">
            <p className="text-gray-600">Company profile not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-6">
        <Link to="/recruiter/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold mb-2">Public Company Profile</h1>
            <p className="opacity-90">Visible to students</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold">
                {(profile.companyName || "C")[0]}
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} /> {profile.companyName || "Company"}
                </div>
                <div className="text-gray-600 flex items-center gap-2">
                  <Mail size={18} /> {profile.email || "N/A"}
                </div>
              </div>
            </div>

            {profile.companyLocation && (
              <div className="text-gray-700 flex items-center gap-2">
                <MapPin size={18} /> {profile.companyLocation}
              </div>
            )}

            {profile.companyWebsite && (
              <div className="flex items-center gap-2">
                <LinkIcon size={18} className="text-emerald-600" />
                <a href={profile.companyWebsite} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-2">
                  {profile.companyWebsite} <ExternalLink size={16} />
                </a>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{profile.about || "No description provided."}</p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer role="recruiter" />
    </div>
  );
}
