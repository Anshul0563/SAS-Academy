import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import API from '../../api/axios';
import { clearAdminAuth, getAdminAuthToken } from '../../utils/authStorage';
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
        const token = getAdminAuthToken();
        if (!token) return;

        const res = await API.get('/dashboard/admin-summary', {
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
    clearAdminAuth();
    navigate('/admin-login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="sas-shell flex overflow-x-hidden">
      
      <div className={`fixed inset-y-0 left-0 z-50 w-[min(84vw,16rem)] lg:w-64 border-r border-white/10 bg-slate-950/78 backdrop-blur-2xl shadow-[24px_0_70px_rgba(0,0,0,0.26)] transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:h-dvh`}>

        <div className="border-b border-white/10 p-5 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="SAS Academy"
            className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.06] object-contain p-1.5"
          />
          <div>
            <h1 className="text-lg font-semibold text-white">
              SAS Admin
            </h1>
            <p className="text-xs text-slate-500">Control Center</p>
          </div>
        </div>


        <nav className="p-3 py-5 space-y-1.5">
          {menu.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 group ${
                  item.active 
                    ? 'border border-cyan-300/15 bg-cyan-300/10 text-cyan-100 shadow-[0_12px_28px_rgba(34,211,238,0.08)]' 
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.title}</span>
                {Number(item.badge) > 0 && (
                  <span className="ml-auto rounded-full bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-500">SAS Academy</p>
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

      <div className="flex-1 min-w-0 flex flex-col lg:ml-64">


        
        <header className="sticky top-0 z-30 mx-3 mt-3 rounded-2xl border border-white/10 bg-slate-950/65 px-3 py-3 shadow-[0_16px_42px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:mx-4 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <button
                onClick={toggleSidebar}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-slate-200 lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="min-w-0">
                <p className="sas-kicker hidden sm:block">Admin</p>
                <div className="truncate text-sm font-semibold capitalize text-white sm:text-base">
                  {location.pathname.replace('/admin', 'dashboard').replaceAll('/', ' / ')}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-slate-300 transition hover:bg-white/[0.1]">
                <Bell size={18} />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-slate-950">
                  3
                </span>
              </button>

              <div className="relative flex cursor-pointer items-center gap-3 rounded-xl bg-white/[0.06] p-1.5 pr-3 transition hover:bg-white/[0.1]" onClick={() => setUserOpen(!userOpen)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-300 text-sm font-bold text-slate-950">
                  {safeUser.name[0]}
                </div>
                <span className="hidden max-w-28 truncate text-sm font-medium text-slate-200 sm:inline">{safeUser.name}</span>
              </div>

              {userOpen && (
                <div className="absolute right-4 top-16 w-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 py-2 shadow-2xl backdrop-blur-xl">
                  <button 
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
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

        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
