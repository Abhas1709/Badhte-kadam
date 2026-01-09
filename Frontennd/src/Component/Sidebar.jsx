// components/Sidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  Briefcase,
  User,
  Settings,
  Bookmark,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", active: true },
    { icon: Briefcase, label: "Jobs", path: "/jobs", count: 124 },
    { icon: Bookmark, label: "Saved Jobs", path: "/saved" },
    { icon: FileText, label: "Applications", path: "/applications", count: 5 },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Bell, label: "Notifications", path: "/notifications", count: 3 },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" }
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 lg:translate-x-0 lg:z-40"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-r from-primary to-primary/80">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Badhte-Kadam
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-white">Job Portal</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      item.active
                        ? "bg-linear-to-r from-primary/10 to-primary/5 text-primary border border-primary/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.count && (
                      <span className="ml-auto px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Profile */}
            <div className="mt-8 p-4 rounded-xl bg-linear-to-r from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-primary to-primary/80 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Student Account</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Profile Completeness
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-linear-to-r from-primary to-primary/80 h-2 rounded-full w-3/4"></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">75% Complete</div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 w-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}