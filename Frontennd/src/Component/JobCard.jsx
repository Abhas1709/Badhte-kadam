// components/JobCard.jsx
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  TrendingUp,
  Users,
  Star,
  ExternalLink,
  Bookmark
} from "lucide-react";

export default function JobCard({ job, onView, onApply, onSave }) {
  const getLogoColor = (logo) => {
    const colors = {
      'TC': 'bg-blue-500',
      'DS': 'bg-purple-500',
      'CS': 'bg-green-500',
      'IL': 'bg-yellow-500',
      'IT': 'bg-red-500',
      'DM': 'bg-indigo-500',
      'GH': 'bg-pink-500',
      'AM': 'bg-teal-500'
    };
    return colors[logo] || 'bg-primary';
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:shadow-xl transition-all group relative"
    >
      {job.isFeatured && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-linear-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold">
            <Star className="h-3 w-3" />
            Featured
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className={`w-14 h-14 rounded-xl ${getLogoColor(job.logo)} flex items-center justify-center text-white font-bold text-lg`}>
          {job.logo}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {job.company}
              </p>
            </div>
            <button
              onClick={() => onSave?.(job.id)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                Bookmark
              <Bookmark className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{job.posted}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-linear-to-r from-primary/10 to-primary/5 text-primary text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span className="text-sm">{job.applicants} applicants</span>
              </div>
              {job.isFeatured && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">High Demand</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onView?.(job)}
                className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg text-sm font-medium transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => onApply?.(job.id)}
                className="px-4 py-2 bg-linear-to-r from-primary to-primary/80 text-white rounded-lg text-sm font-semibold hover:from-primary/90 hover:to-primary hover:shadow-lg transition-all"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}