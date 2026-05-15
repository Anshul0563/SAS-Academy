import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Search, Filter, Users, BarChart3 } from 'lucide-react';

import { motion } from 'framer-motion';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await API.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    (student.name || '').toLowerCase().includes(search.toLowerCase()) &&
    (filterRole === 'all' || student.role === filterRole)
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent sm:text-3xl">
            👥 Students Management
          </h1>
          <p className="text-slate-400">Manage student accounts and performance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-3 backdrop-blur-xl sm:p-4 md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2 focus:border-indigo-500 focus:outline-none md:w-auto"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-indigo-400 font-medium text-sm uppercase tracking-wide">Total Students</p>
              <p className="text-2xl font-bold text-white">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-medium text-sm uppercase tracking-wide">Active</p>
              <p className="text-2xl font-bold text-white">{students.filter(s => s.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Filter className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-orange-400 font-medium text-sm uppercase tracking-wide">Filtered</p>
              <p className="text-2xl font-bold text-white">{filteredStudents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 shadow-2xl backdrop-blur-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Tests Taken</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Avg Score</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-2"></div>
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {student.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-white">{student.name}</p>
                          <p className="text-xs text-slate-400">ID: {student._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{student.email}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.role === 'student' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {student.role}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{student.testsTaken || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-emerald-400">{student.avgScore || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem('adminToken');
                          await API.patch(`/users/${student._id}/status`, { isActive: !student.isActive }, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setStudents(current => current.map(item => (
                            item._id === student._id ? { ...item, isActive: !item.isActive } : item
                          )));
                        }}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        {student.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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

export default AdminStudents;
