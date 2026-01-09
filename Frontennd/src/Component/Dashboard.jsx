// Dashboard.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Briefcase,
  Users,
  DollarSign,
  Star,
  ChevronRight
} from "lucide-react";

import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import StatsCard from "./StatsCard";
import JobDetailsModal from "./JobDetailsModal";

const initialJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Solutions",
    logo: "TC",
    location: "Remote",
    salary: "$80,000 - $120,000",
    type: "Full-time",
    experience: "2-4 years",
    posted: "2 days ago",
    description:
      "We're looking for a skilled Frontend Developer with React experience to join our growing team.",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    status: "active",
    isFeatured: true,
    applicants: 45,
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignStudio Inc",
    logo: "DS",
    location: "New York, NY",
    salary: "$70,000 - $100,000",
    type: "Full-time",
    experience: "3-5 years",
    posted: "1 week ago",
    description:
      "Join our design team to create beautiful and functional user experiences.",
    skills: ["Figma", "UI Design", "User Research", "Prototyping"],
    status: "active",
    isFeatured: true,
    applicants: 32,
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudSystems",
    logo: "CS",
    location: "San Francisco, CA",
    salary: "$90,000 - $140,000",
    type: "Full-time",
    experience: "3+ years",
    posted: "3 days ago",
    description:
      "Build scalable backend systems using Node.js and microservices.",
    skills: ["Node.js", "AWS", "Docker", "PostgreSQL"],
    status: "active",
    isFeatured: false,
    applicants: 28,
  },
];

export default function Dashboard() {
  const [jobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    jobType: "all",
    experience: "all",
    location: "all",
    salaryRange: "all",
  });

  /* -------------------- FILTERED JOBS -------------------- */
  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }

    if (filters.jobType !== "all") {
      result = result.filter(
        (job) => job.type.toLowerCase() === filters.jobType
      );
    }

    if (filters.location !== "all") {
      if (filters.location === "remote") {
        result = result.filter((job) =>
          job.location.toLowerCase().includes("remote")
        );
      } else {
        result = result.filter(
          (job) =>
            !job.location.toLowerCase().includes("remote") &&
            job.location.toLowerCase().includes(filters.location)
        );
      }
    }

    return result;
  }, [jobs, searchTerm, filters]);

  /* -------------------- STATS -------------------- */
  const stats = useMemo(() => {
    const totalJobs = filteredJobs.length;
    const applications = filteredJobs.reduce(
      (sum, job) => sum + job.applicants,
      0
    );
    const featuredJobs = filteredJobs.filter((j) => j.isFeatured).length;

    const avgSalary =
      totalJobs > 0
        ? Math.round(
            filteredJobs.reduce((sum, job) => {
              const [min, max] = job.salary
                .replace(/[$,]/g, "")
                .split("-")
                .map(Number);
              return sum + (min + max) / 2;
            }, 0) /
              totalJobs /
              1000
          )
        : 0;

    return { totalJobs, applications, featuredJobs, avgSalary };
  }, [filteredJobs]);

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* -------------------- HANDLERS -------------------- */
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      jobType: "all",
      experience: "all",
      location: "all",
      salaryRange: "all",
    });
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleApplyJob = (jobId) => {
    console.log("Applying for job:", jobId);
  };

  const handleSaveJob = (jobId) => {
    console.log("Saving job:", jobId);
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold tracking-tight">
          Find Your Next Opportunity
        </h2>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Browse curated job openings that match your skills and career goals
        </p>
      </motion.div>

      {/* Stats */}
      <section aria-label="Job statistics" className="mb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={Briefcase}
          />
          <StatsCard
            title="Applications"
            value={stats.applications}
            icon={Users}
          />
          <StatsCard
            title="Avg Salary"
            value={`$${stats.avgSalary}k`}
            icon={DollarSign}
          />
          <StatsCard
            title="Featured Jobs"
            value={stats.featuredJobs}
            icon={Star}
          />
        </div>
      </section>

      {/* Search & Filters */}
      <section
        aria-label="Search and filters"
        className="sticky top-20 z-30 bg-white/90 backdrop-blur rounded-2xl p-5 mb-12 border"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by job title, company, or skill"
              aria-label="Search jobs"
              className="w-full pl-12 pr-10 py-3 rounded-xl border focus:ring-2 focus:ring-primary/30 transition"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </div>
      </section>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold">{filteredJobs.length}</span>{" "}
          jobs
        </p>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border rounded-2xl"
        >
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold">No jobs found</h3>
          <p className="text-gray-500 mt-2 mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 rounded-xl border hover:bg-gray-50 transition"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <JobCard
                  job={job}
                  onView={()=>handleViewJob(job)}
                  onApply={()=>handleApplyJob(job.id)}
                  onSave={() =>handleSaveJob(job.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center mt-14">
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border hover:bg-gray-50 transition font-medium">
            Load More Jobs <ChevronRight />
          </button>
        </div>
      )}
       <JobDetailsModal
        job={selectedJob}
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onApply={handleApplyJob}
      />
    </main>
  );
}
