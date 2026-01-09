// components/JobFilters.jsx
import { Filter, X } from "lucide-react";
import { useState } from "react";

export default function JobFilters({ filters, onFilterChange, onClearFilters }) {
  const [showFilters, setShowFilters] = useState(false);

  const jobTypes = [
    { value: "all", label: "All Types" },
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" }
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "remote", label: "Remote" },
    { value: "new york", label: "New York" },
    { value: "san francisco", label: "San Francisco" },
    { value: "austin", label: "Austin" },
    { value: "boston", label: "Boston" }
  ];

  const experienceLevels = [
    { value: "all", label: "All Experience" },
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive" }
  ];

  const salaryRanges = [
    { value: "all", label: "All Salaries" },
    { value: "0-50000", label: "$0 - $50k" },
    { value: "50000-100000", label: "$50k - $100k" },
    { value: "100000-150000", label: "$100k - $150k" },
    { value: "150000+", label: "$150k+" }
  ];

  return (
    <>
      {/* Filter Toggle for Mobile */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center gap-2 justify-center"
      >
        <Filter className="h-5 w-5" />
        Filters
        {Object.values(filters).some(v => v !== "all") && (
          <span className="w-2 h-2 bg-primary rounded-full"></span>
        )}
      </button>

      {/* Filter Panel */}
      <div className={`
        ${showFilters ? 'block' : 'hidden lg:flex'}
        lg:flex items-center gap-4 flex-wrap
      `}>
        {/* Job Type Filter */}
        <select
          value={filters.jobType}
          onChange={(e) => onFilterChange("jobType", e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {jobTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Location Filter */}
        <select
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {locations.map(location => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>

        {/* Experience Filter */}
        <select
          value={filters.experience}
          onChange={(e) => onFilterChange("experience", e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {experienceLevels.map(exp => (
            <option key={exp.value} value={exp.value}>
              {exp.label}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {Object.values(filters).some(v => v !== "all") && (
          <button
            onClick={onClearFilters}
            className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
          >
            <X className="h-5 w-5" />
            Clear Filters
          </button>
        )}
      </div>
    </>
  );
}