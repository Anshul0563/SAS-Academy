import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ title, value, change, icon: Icon, route, color = 'indigo' }) => {
  const navigate = useNavigate();

  const colors = {
    indigo: 'bg-cyan-300/10 text-cyan-200',
    purple: 'bg-violet-300/10 text-violet-200',
    emerald: 'bg-emerald-300/10 text-emerald-200',
    orange: 'bg-amber-300/10 text-amber-200'
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => route && navigate(route)}
      className={`sas-card sas-card-hover group relative p-5 sm:p-6 ${route ? "cursor-pointer" : ""}`}
    >
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${colors[color] || colors.indigo}`}>
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
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
            <span className="text-slate-500">from last month</span>
          </div>
        )}
      </div>

      {route && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-300/[0.03] opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}

    </motion.div>
  );
};

export default StatsCard;
