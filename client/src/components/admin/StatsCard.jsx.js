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
      className={`group relative bg-gradient-to-br ${colors[color].bg} p-6 rounded-2xl shadow-xl cursor-pointer border border-white/20 hover:shadow-2xl transition-all duration-300 ${colors[color].hover}`}
    >
      {/* Icon */}
      <div className="absolute -top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div>
        <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-white mb-2">
{(() => {
  const val = value ?? 0;
  return typeof val === 'number' ? val.toLocaleString() : String(val);
})()}
        </p>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-sm">
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
