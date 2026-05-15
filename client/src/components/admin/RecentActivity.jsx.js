import React from 'react';
import { Clock, User, TrendingUp, CheckCircle, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const RecentActivity = ({ activities = [] }) => {
  const recent = Array.isArray(activities) ? activities.slice(0, 5) : [];

  const getIcon = (type, testType) => {
    // If backend uses different naming, infer from available fields.
    const inferredTestType = testType || (type === 'test_activity' ? testType : undefined);

    if (type === 'test_activity') {
      switch (inferredTestType) {
        case 'dictation':
          return <FileText className="w-5 h-5 text-indigo-400" />;
        case 'transcription':
          return <Activity className="w-5 h-5 text-purple-400" />;
        default:
          return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      }
    }

    switch (type) {
      case 'test_completed':
      case 'score_improved':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'test_created':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'new_student':
        return <User className="w-5 h-5 text-slate-400" />;
      default:
        return <User className="w-5 h-5 text-slate-400" />;
    }
  };


  return (
    <div className="space-y-3">
      {recent.map((activity, index) => (
        <motion.div
          key={activity.id || activity._id || index}

          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all cursor-pointer hover:shadow-lg"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mt-1">
{getIcon(activity.type, activity.testType)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {activity.title || activity.details}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {activity.user || activity.name}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1 text-xs text-slate-400 ml-auto">
            <span>{activity.time || 'Just now'}</span>
            <Clock className="w-3 h-3" />
          </div>
        </motion.div>
      ))}
      
      {recent.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Activity className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
