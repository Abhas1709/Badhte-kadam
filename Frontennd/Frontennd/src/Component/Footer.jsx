import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, User, Bookmark, ChevronRight } from "lucide-react";

export default function Footer({ role = "student" }) {
  const [userId] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const parts = token ? token.split(".") : [];
      const body = parts.length > 1 ? parts[1] : "";
      const payload = body ? JSON.parse(atob(body)) : null;
      return payload?.id || null;
    } catch (err) {
          console.error(err);
      return null;
    }
  });

  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Briefcase size={18} />
          <span>Badhte Kadam</span>
        </div>
        {role === "student" ? (
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/student/dashboard" className="text-indigo-600 hover:underline flex items-center gap-1">
              <User size={16} /> Dashboard
            </Link>
            <Link to="/student/applications" className="text-indigo-600 hover:underline flex items-center gap-1">
              <Bookmark size={16} /> My Applications
            </Link>
            <Link to="/student/recommended" className="text-green-600 hover:underline flex items-center gap-1">
              <ChevronRight size={16} /> Recommended Jobs
            </Link>
            {userId && (
              <Link to={`/student/public/${userId}`} className="text-gray-700 hover:underline flex items-center gap-1">
                <User size={16} /> Public Profile
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/recruiter/dashboard" className="text-indigo-600 hover:underline flex items-center gap-1">
              <User size={16} /> Recruiter Dashboard
            </Link>
            {userId && (
              <Link to={`/recruiter/public/${userId}`} className="text-gray-700 hover:underline flex items-center gap-1">
                <User size={16} /> Public Company Profile
              </Link>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
