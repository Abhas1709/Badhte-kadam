// components/StatsCard.jsx
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, color, change }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    yellow: "from-amber-500 to-amber-600",
    purple: "from-purple-500 to-purple-600"
  };

  const bgColorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/20",
    green: "bg-emerald-100 dark:bg-emerald-900/20",
    yellow: "bg-amber-100 dark:bg-amber-900/20",
    purple: "bg-purple-100 dark:bg-purple-900/20"
  };

  const isPositive = change?.includes('+');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColorClasses[color]}`}>
          <Icon className={`h-6 w-6 bg-linear-to-r ${colorClasses[color]} bg-clip-text text-transparent`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${isPositive ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {change.split(' ')[0]}
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400">{title}</p>
    </motion.div>
  );
}