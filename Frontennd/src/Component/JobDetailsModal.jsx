import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  ExternalLink,
  Bookmark
} from "lucide-react";

export default function JobDetailsModal({ job, isOpen, onClose, onApply }) {
  if (!job || !isOpen) return null;

  /* -------------------- LOGO COLOR (MEMOIZED) -------------------- */
  const logoColor = useMemo(() => {
    const colors = {
      TC: "bg-blue-500",
      DS: "bg-purple-500",
      CS: "bg-green-500",
      IL: "bg-yellow-500",
      IT: "bg-red-500",
      DM: "bg-indigo-500",
      GH: "bg-pink-500",
      AM: "bg-teal-500"
    };
    return colors[job.logo] || "bg-primary";
  }, [job.logo]);

  /* -------------------- ESC KEY + SCROLL LOCK -------------------- */
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEsc = e => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Overlay */}
        <motion.div
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
        >
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl ${logoColor} flex items-center justify-center text-white font-bold text-2xl`}
              >
                {job.logo}
              </div>
              <div>
                <h2 id="job-title" className="text-2xl font-bold">
                  {job.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {job.company}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close job details"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main */}
              <div className="lg:col-span-2 space-y-6">
                {/* Meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Info label="Location" value={job.location} icon={MapPin} />
                  <Info label="Salary" value={job.salary} icon={DollarSign} />
                  <Info label="Type" value={job.type} icon={Briefcase} />
                  <Info label="Posted" value={job.posted} icon={Clock} />
                </div>

                {/* Description */}
                <section>
                  <h3 className="text-xl font-bold mb-3">About this role</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {job.description}
                  </p>

                  <ul className="space-y-2">
                    {[
                      "Build and maintain scalable applications",
                      "Collaborate with cross-functional teams",
                      "Write clean, maintainable code",
                      "Participate in reviews and discussions"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle className="text-green-500 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Skills */}
                <section>
                  <h3 className="text-xl font-bold mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-primary/10 to-primary/5 text-primary font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="rounded-2xl p-6 border bg-linear-to-br from-primary/5 to-primary/10">
                  <h3 className="font-bold mb-3">Company Overview</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Public company information provided for reference only.
                  </p>

                  <div className="space-y-3">
                    <Meta icon={Globe} text="www.company.com" />
                    <Meta
                      icon={Mail}
                      text={`careers@${job.company
                        .toLowerCase()
                        .replace(/\s+/g, "")}.com`}
                    />
                    <Meta icon={Phone} text="+1 (555) 123-4567" />
                  </div>
                </div>

                {/* Actions */}
                <div className="sticky top-6 space-y-4">
                  <button
                    onClick={() => onApply(job.id)}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-primary to-primary/80 text-white font-semibold flex justify-center gap-2 hover:shadow-lg"
                  >
                    Apply Now <ExternalLink />
                  </button>

                  <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold flex justify-center gap-2 hover:bg-primary/10">
                    <Bookmark /> Save for later
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* -------------------- SMALL UI COMPONENTS -------------------- */

function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
        <Icon size={16} /> {label}
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Meta({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
      <Icon size={18} /> {text}
    </div>
  );
}
