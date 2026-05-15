import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, Filter, Download, Calendar, TrendingUp, Award } from 'lucide-react';

import { motion } from 'framer-motion';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchResults();
    fetchStats();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('/api/results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data.slice(0, 50) || []); // Top 50 recent
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('/api/results/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            📊 Results Analytics
          </h1>
          <p className="text-slate-400">Student performance overview and insights</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 rounded-xl transition"
          >
            <Download className="w-4 h-4 inline mr-1" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-medium text-sm uppercase tracking-wide">Total Results</p>
              <p className="text-2xl font-bold text-white">{stats.totalResults || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 border border-indigo-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-indigo-400 font-medium text-sm uppercase tracking-wide">Avg Score</p>
              <p className="text-2xl font-bold text-white">{stats.avgScore ? `${stats.avgScore.toFixed(1)} WPM` : 'N/A'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-400 font-medium text-sm uppercase tracking-wide">Recent</p>
              <p className="text-2xl font-bold text-white">{stats.recentResults || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-orange-400 font-medium text-sm uppercase tracking-wide">Pass Rate</p>
              <p className="text-2xl font-bold text-white">{stats.passRate !== undefined ? `${stats.passRate}%` : 'N/A'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
        <Filter className="w-5 h-5 text-slate-400" />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-300"
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last Month</option>
        </select>
      </div>

      {/* Results Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Test</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">WPM</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Accuracy</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-2"></div>
                    Loading results...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result._id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {result.userName?.[0] || 'U'}
                        </div>
                        <span className="font-medium text-white">{result.userName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-800/50 text-xs rounded-md text-slate-300">
                        {result.testTitle || 'Test'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-emerald-400 font-semibold">
                      {result.netWPM?.toFixed(1) || 0} WPM
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-purple-400">
                        {result.accuracy?.toFixed(1) || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        (result.score || 0) > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {result.score?.toFixed(1) || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminResults;
