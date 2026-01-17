
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Briefcase,
  ChevronDown,
  Rocket,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowTitle(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "student", "recruiter"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center"
          >
            <Rocket className="h-10 w-10 text-white" />
          </motion.div>

          <AnimatePresence>
            {showTitle && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              >
                Badhte-Kadam
              </motion.h1>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 mx-auto mt-8 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
        {["home", "student", "recruiter"].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`block w-3 h-3 rounded-full transition-all ${
              activeSection === section
                ? "bg-primary scale-125"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-primary/10 to-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Your Career Journey Starts Here</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-5xl">
                Badhte-Kadam
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              A platform where students find their dream careers and recruiters
              discover top talent. Take your next step towards success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection("student")}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full font-semibold hover:from-primary/90 hover:to-primary hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                For Students
                <User className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollToSection("recruiter")}
                className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              >
                For Recruiters
                <Briefcase className="h-5 w-5" />
              </button>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="cursor-pointer"
              onClick={() => scrollToSection("student")}
            >
              <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
              <ChevronDown className="h-8 w-8 text-primary mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Student Section */}
      <section
        id="student"
        className="min-h-screen flex items-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center lg:justify-start space-x-2 mb-6 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <User className="h-4 w-4" />
                <span>For Students & Job Seekers</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Launch Your
                <span className="block text-blue-600 dark:text-blue-400">
                  Dream Career
                </span>
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Find the perfect job that matches your skills and aspirations.
                Get personalized recommendations, career guidance, and direct
                access to top companies.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "AI-powered job matching",
                  "Personalized career guidance",
                  "Resume building tools",
                  "Interview preparation",
                  "Skill development courses",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-600 hover:shadow-lg transition-all flex items-center gap-2 mb-4">
                Explore Jobs
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Right Content - Icon & Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-96 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-3xl flex flex-col items-center justify-center p-8">
                {/* Main Icon */}
                <div className="relative mb-6">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center">
                      <User className="h-32 w-32 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  {/* Floating elements */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -20, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: i * 0.3,
                      }}
                      className={`absolute w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center ${
                        i === 1
                          ? "top-2 left-2"
                          : i === 2
                          ? "top-2 right-2"
                          : "bottom-4 left-1/2 transform -translate-x-1/2"
                      }`}
                    >
                      {i === 1 && (
                        <span className="text-blue-600 font-bold text-xs">500+</span>
                      )}
                      {i === 2 && (
                        <span className="text-blue-600 font-bold text-xs">95%</span>
                      )}
                      {i === 3 && (
                        <span className="text-blue-600 font-bold text-xs">50K+</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="w-full max-w-md space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Get Started as Student
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Join our community of students and kickstart your career
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                
                    <Link
                      to="/login"
                      state={{ role: "student" }}
                      className="group px-4 py-3 bg-white dark:bg-gray-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Login</span>
                    </Link>

                  
                    <Link
                      to="/signup"
                      state={{ role: "student" }}
                      className="group px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold  hover:border-yellow-400 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recruiter Section */}
      <section
        id="recruiter"
        className="min-h-screen flex items-center bg-gradient-to-b from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Icon & Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="w-full h-96 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-3xl flex flex-col items-center justify-center p-8">
                {/* Main Icon */}
                <div className="relative mb-6">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                      <Briefcase className="h-32 w-32 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>

                  {/* Floating elements */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -20, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: i * 0.3,
                      }}
                      className={`absolute w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center ${
                        i === 1
                          ? "top-2 left-2"
                          : i === 2
                          ? "top-2 right-2"
                          : "bottom-4 left-1/2 transform -translate-x-1/2"
                      }`}
                    >
                      {i === 1 && (
                        <span className="text-emerald-600 font-bold text-xs">10K+</span>
                      )}
                      {i === 2 && (
                        <span className="text-emerald-600 font-bold text-xs">85%</span>
                      )}
                      {i === 3 && (
                        <span className="text-emerald-600 font-bold text-xs">500+</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="w-full max-w-md space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Get Started as Recruiter
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Find top talent and streamline your hiring process
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Login Button */}
                    <Link
                      to="/login"
                      state={{ role: "recruiter" }}
                      className="group px-4 py-3 bg-white dark:bg-gray-800 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Login</span>
                    </Link>

                    {/* Signup Button */}
                    <Link
                      to="/signup"
                      state={{ role: "recruiter" }}
                      className="group px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-600 hover:shadow-xl  hover:border-yellow-400 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-left order-1 lg:order-2"
            >
              <div className="inline-flex items-center justify-center lg:justify-start space-x-2 mb-6 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <Briefcase className="h-4 w-4" />
                <span>For Recruiters & Companies</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Find Top
                <span className="block text-emerald-600 dark:text-emerald-400">
                  Talent Faster
                </span>
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Connect with qualified candidates that match your requirements.
                Streamline your hiring process with our intelligent matching
                system.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "AI-powered candidate matching",
                  "Advanced filtering & search",
                  "One-click candidate outreach",
                  "Interview scheduling tools",
                  "Analytics & insights dashboard",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full font-semibold hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg transition-all flex items-center gap-2 mb-4">
                Post a Job
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Badhte-Kadam
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Empowering careers, connecting talent © {new Date().getFullYear()}
            </p>
            <div className="flex space-x-6">
              <button className="text-gray-500 hover:text-primary transition-colors">
                Terms
              </button>
              <button className="text-gray-500 hover:text-primary transition-colors">
                Privacy
              </button>
              <button className="text-gray-500 hover:text-primary transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3 text-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
