import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell 
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const [stats, setStats] = useState({ totalStudents: 0, totalTests: 0 });
  const adminRaw = localStorage.getItem('adminUser');
  const adminUser = adminRaw ? JSON.parse(adminRaw) : {};
  const safeUser = {
    name: adminUser.name || 'Admin',
    totalStudents: stats.totalStudents || 0,
    totalTests: stats.totalTests || 0
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        const res = await axios.get('/api/dashboard/admin-dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats({
          totalStudents: res.data?.totalStudents || 0,
          totalTests: res.data?.totalTests || 0
        });
      } catch (error) {
        console.error('Admin layout stats error:', error.message);
      }
    };

    fetchStats();
  }, []);


  const menu = [
{ 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin',
      active: location.pathname === '/admin'
    },
    { 
      title: 'Students', 
      icon: Users, 
      path: '/admin/students',
      badge: safeUser.totalStudents,
      active: location.pathname.startsWith('/admin/students')
    },
    { 
      title: 'Tests', 
      icon: FileText, 
      path: '/admin/tests',
      badge: safeUser.totalTests,
      active: location.pathname.startsWith('/admin/tests')
    },
    { 
      title: 'Results', 
      icon: BarChart3, 
      path: '/admin/results',
      active: location.pathname.startsWith('/admin/results')
    },
    { 
      title: 'Add Test', 
      icon: FileText, 
      path: '/admin/add-test',
      active: location.pathname.startsWith('/admin/add-test')
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      path: '/admin/settings',
      active: location.pathname.startsWith('/admin/settings')
    }
  ];


  const logout = () => {
    // Clear admin storage only (user login remains separate)
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    // Clear shared/fallback keys to avoid any guard confusion
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    navigate('/admin-login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      
      {/* 🔥 SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            SAS Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">Academy Control Center</p>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menu.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  item.active 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/25' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.title}</span>
                {Number(item.badge) > 0 && (
                  <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400">v2.0 • SAS Academy</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30 p-4">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Menu + Breadcrumbs */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="hidden md:block text-sm text-slate-400 font-medium">
                <span className="text-white">Dashboard</span> / Overview
              </div>
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 cursor-pointer relative group" onClick={() => setUserOpen(!userOpen)}>
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {safeUser.name[0]}
                </div>
                <span className="text-sm font-medium text-slate-200">{safeUser.name}</span>
              </div>

              {/* User Dropdown */}
              {userOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl py-2">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
