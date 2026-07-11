import React, { useEffect, useState, useCallback } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { getAdminAuthToken } from '../../utils/authStorage';
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
import { getAdminSettings } from '../../utils/settingsStorage';
import PageLoader from '../../components/PageLoader';

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

  const fetchDashboardData = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const token = getAdminAuthToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await API.get('/dashboard/admin-dashboard', {
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
    const refreshMs = Math.max(10, Number(getAdminSettings().dashboardRefreshSeconds) || 30) * 1000;
    const interval = setInterval(() => fetchDashboardData({ silent: true }), refreshMs);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <PageLoader
        title="Loading admin dashboard"
        subtitle="Fetching students, tests, attempts, charts, and recent activity..."
      />
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
          <p className="sas-kicker">Overview</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Welcome back, {dashboardData.adminName}
          </h1>
          <p className="text-slate-400 mt-2">Your academy overview at a glance</p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="sas-button-primary sm:px-6"
            onClick={() => navigate('/admin/add-test')}
          >
            <Plus className="w-4 h-4" />
            Add Test
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="sas-button-secondary sm:px-6"
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
        <div className="sas-panel flex flex-col p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-white sm:text-xl">Performance Trend</h2>
            <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
              +{dashboardData.testGrowth || 12.4}% growth
            </span>
          </div>
          <TestPerformanceChart trendData={dashboardData.trendData} />
        </div>

        {/* Recent Activity */}
        <div className="sas-panel flex flex-col p-4 sm:p-6 lg:p-8">
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
        <div className="sas-card p-5 sm:p-6 lg:p-8">
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

        <div className="sas-card p-5 sm:p-6 lg:p-8">
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

        <div className="sas-card p-5 sm:p-6 lg:p-8">
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
