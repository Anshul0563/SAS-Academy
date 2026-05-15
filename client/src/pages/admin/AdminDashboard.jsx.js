import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Activity,
  BarChart3,
  Plus,
  TrendingUp, 
  Clock,
  Download
} from 'lucide-react';

import { motion } from 'framer-motion';
import StatsCard from '../../components/admin/StatsCard';
import RecentActivity from '../../components/admin/RecentActivity';
import TestPerformanceChart from '../../components/admin/TestPerformanceChart';

const emptyDashboard = {
  totalStudents: 0,
  totalTests: 0,
  totalAttempts: 0,
  avgScore: 0,
  studentGrowth: 0,
  testGrowth: 0,
  recentTests: [],
  adminName: 'Admin',
  trendData: []
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get('/api/dashboard/admin-dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const apiData = res.data || emptyDashboard;
      
      // Transform recent tests
      const activities = (apiData.recentTests || []).slice(0, 5).map(test => ({
        id: test._id,
        type: 'test_created',
        title: test.title,
        user: test.createdBy?.name || 'Admin',
        time: new Date(test.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        testType: test.type
      }));

      setDashboardData({
        ...apiData,
        recentTests: activities,
        avgScore: apiData.avgScore ? Number(apiData.avgScore.toFixed(1)) : 0,
        trendData: apiData.trendData || emptyDashboard.trendData
      });
    } catch (error) {
      console.error('Dashboard API error:', error.message);
      setDashboardData(emptyDashboard);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-100 to-slate-200 bg-clip-text text-transparent sm:text-3xl lg:text-4xl">
            Welcome back, {dashboardData.adminName} 👋
          </h1>
          <p className="text-slate-400 mt-2">Your academy overview at a glance</p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-xl transition-all hover:bg-emerald-700 sm:px-6"
            onClick={() => navigate('/admin/add-test')}
          >
            <Plus className="w-4 h-4" />
            Add Test
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white sm:px-6"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* Main Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatsCard 
          title="Total Students" 
          value={dashboardData.totalStudents || 0} 
          change={dashboardData.studentGrowth}
          icon={Users}
          color="indigo"
          route="/admin/students"
        />
        <StatsCard 
          title="Total Tests" 
          value={dashboardData.totalTests || 0} 
          change={dashboardData.testGrowth}
          icon={FileText}
          color="purple"
          route="/admin/tests"
        />
        <StatsCard 
          title="Attempts" 
          value={dashboardData.totalAttempts || 0} 
          icon={Activity}
          color="emerald"
        />
        <StatsCard 
          title="Avg WPM" 
        value={dashboardData.avgScore ? dashboardData.avgScore.toFixed(1) : '0'} 
          icon={BarChart3}
          color="orange"
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-5 xl:grid-cols-2 lg:gap-8"
      >
        {/* Performance Chart */}
        <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-white sm:text-xl">Performance Trend</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium">
              +{dashboardData.testGrowth || 12.4}% growth
            </span>
          </div>
          <TestPerformanceChart trendData={dashboardData.trendData} />
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white sm:text-xl">Recent Activity</h2>
            <span className="text-xs text-slate-400">Live updates</span>
          </div>
          <RecentActivity activities={dashboardData.recentTests || []} />
        </div>
      </motion.div>

      {/* Academy Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 p-5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 sm:h-16 sm:w-16">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wide">Pass Rate</p>
              <p className="text-3xl font-bold text-white">{dashboardData.passRate || 0}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 sm:h-16 sm:w-16">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide">Avg Time</p>
              <p className="text-3xl font-bold text-white">{dashboardData.avgTime || '—'}</p>

            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 sm:h-16 sm:w-16">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-400 font-semibold text-sm uppercase tracking-wide">Active Users</p>
              <p className="text-3xl font-bold text-white">{dashboardData.activeUsers || dashboardData.totalStudents || 0}</p>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
