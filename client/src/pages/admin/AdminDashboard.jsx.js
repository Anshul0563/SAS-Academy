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

const mockData = {
  totalStudents: 1247,
  totalTests: 89,
  totalAttempts: 5432,
  avgScore: 78.4,
  studentGrowth: 12.5,
  testGrowth: 8.2,
  recentTests: [],
  adminName: 'Admin',
  trendData: []
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get('/api/dashboard/admin-dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const apiData = res.data || mockData;
      
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
        trendData: apiData.trendData || mockData.trendData
      });
    } catch (error) {
      console.log('Dashboard API error, using mock:', error.message);
      setDashboardData(mockData);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-900">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 space-y-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-indigo-100 to-slate-200 bg-clip-text text-transparent">
            Welcome back, {dashboardData.adminName} 👋
          </h1>
          <p className="text-slate-400 mt-2">Your academy overview at a glance</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl shadow-xl transition-all flex items-center gap-2"
            onClick={() => navigate('/admin/add-test')}
          >
            <Plus className="w-4 h-4" />
            Add Test
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-2xl transition-all flex items-center gap-2"
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
          change={dashboardData.avgScoreChange || 2.4}
          icon={BarChart3}
          color="orange"
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
      >
        {/* Performance Chart */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Performance Trend</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium">
              +{dashboardData.testGrowth || 12.4}% growth
            </span>
          </div>
          <TestPerformanceChart trendData={dashboardData.trendData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <span className="text-xs text-slate-400">Live updates</span>
          </div>
          <RecentActivity activities={dashboardData.recentTests || []} />
        </div>
      </motion.div>

      {/* Academy Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 p-8 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wide">Pass Rate</p>
              <p className="text-3xl font-bold text-white">{dashboardData.passRate || '84.2'}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 p-8 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide">Avg Time</p>
              <p className="text-3xl font-bold text-white">2m 47s</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 p-8 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-400 font-semibold text-sm uppercase tracking-wide">Active Users</p>
              <p className="text-3xl font-bold text-white">247 online</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;

