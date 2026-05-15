import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ title, value, change, icon: Icon, route, color = 'indigo' }) => {
  const navigate = useNavigate();

  const colors = {
    indigo: { bg: 'from-indigo-500 to-indigo-600', hover: 'hover:from-indigo-600 hover:to-indigo-700' },
    purple: { bg: 'from-purple-500 to-purple-600', hover: 'hover:from-purple-600 hover:to-purple-700' },
    emerald: { bg: 'from-emerald-500 to-emerald-600', hover: 'hover:from-emerald-600 hover:to-emerald-700' },
    orange: { bg: 'from-orange-500 to-orange-600', hover: 'hover:from-orange-600 hover:to-orange-700' }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => route && navigate(route)}
      className={`group relative rounded-2xl border border-white/20 bg-gradient-to-br ${colors[color].bg} p-5 pt-7 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-6 ${route ? "cursor-pointer" : ""} ${colors[color].hover}`}
    >
      {/* Icon */}
      <div className="absolute -top-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110 sm:-top-4 sm:h-12 sm:w-12 sm:rounded-2xl">
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/80 sm:text-sm">
          {title}
        </p>
        <p className="mb-2 text-2xl font-bold text-white sm:text-3xl">
{(() => {
  const val = value ?? 0;
  return typeof val === 'number' ? val.toLocaleString() : String(val);
})()}
        </p>
        {change !== undefined && (
          <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
            <ArrowUp className={`w-3 h-3 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
            <span className={`font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-white/60">from last month</span>
          </div>
        )}
      </div>

      {/* Click indicator */}
      {route && (
        <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </motion.div>
  );
};

export default StatsCard;
