import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { useState, useEffect, useRef } from "react";
import { clearUserAuth } from "../utils/authStorage";

import {
    LayoutDashboard,
    Headphones,
    FileText,
    Keyboard,
    Mic2,
    Bell,
    Menu,
    Settings,
    LogOut
} from "lucide-react";

function Layout() {

    const { examMode } = useExam();
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dropdownRef = useRef();

    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Dictation", icon: Headphones, path: "/dictations" },
        { name: "Transcription", icon: FileText, path: "/transcription" },
        {
            name: "Typing Learning",
            icon: Keyboard,
            path: "/typing-learning",
            children: [
                { name: "SSC Steno Test", icon: Mic2, path: "/typing-learning/ssc-steno" },
            ],
        },
        { name: "Settings", icon: Settings, path: "/settings" },
    ];

    const handleLogout = () => {
        clearUserAuth();
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="sas-shell flex overflow-x-hidden">

            {!examMode && (
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-[min(80vw,16rem)] md:w-64 h-dvh
                    border-r border-white/10 bg-slate-950/78 backdrop-blur-2xl
                    shadow-[24px_0_70px_rgba(0,0,0,0.26)]
                    transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
                >

                    <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
                        <img
                            src="/logo.png"
                            alt="SAS Academy"
                            className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.06] object-contain p-1.5"
                        />
                        <div>
                            <div className="text-lg font-semibold text-white">SAS Academy</div>
                            <div className="text-xs text-slate-500">Practice Console</div>
                        </div>
                    </div>

                    <div className="px-3 py-5 space-y-1.5">
                        {menu.map((item, i) => {
                            const Icon = item.icon;
                            const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                            return (
                                <div key={i}>
                                    <div
                                        onClick={() => {
                                            navigate(item.path);
                                            setSidebarOpen(false);
                                        }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200
                                        ${active
                                                ? "border border-cyan-300/15 bg-cyan-300/10 text-cyan-100 shadow-[0_12px_28px_rgba(34,211,238,0.08)]"
                                                : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                    {item.children && active && (
                                        <div className="mt-1 space-y-1 pl-5">
                                            {item.children.map((child) => {
                                                const ChildIcon = child.icon;
                                                const childActive = location.pathname === child.path || location.pathname.startsWith(`${child.path}/`);

                                                return (
                                                    <div
                                                        key={child.path}
                                                        onClick={() => {
                                                            navigate(child.path);
                                                            setSidebarOpen(false);
                                                        }}
                                                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer transition
                                                        ${childActive
                                                                ? "bg-emerald-400/10 text-emerald-200"
                                                                : "text-slate-500 hover:bg-white/[0.06] hover:text-white"
                                                            }`}
                                                    >
                                                        <ChildIcon size={15} />
                                                        <span>{child.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            )}

            {sidebarOpen && !examMode && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex min-w-0 flex-col md:ml-64">

                {!examMode && (
                    <div className="sticky top-0 z-30 mx-3 mt-3 rounded-2xl
                        border border-white/10 bg-slate-950/65 backdrop-blur-xl
                        shadow-[0_16px_42px_rgba(0,0,0,0.18)] px-3 py-3 sm:mx-4 sm:px-5 flex justify-between items-center">

                        <div className="flex items-center gap-3">
                            <button
                                className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-slate-200 md:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={19} />
                            </button>
                            <div>
                                <p className="sas-kicker hidden sm:block">Workspace</p>
                                <h1 className="truncate text-sm font-semibold capitalize text-white sm:text-base">
                                    {(location.pathname.replace("/", "").replaceAll("/", " / ") || "dashboard")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>

                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-slate-300 transition hover:bg-white/[0.1]">
                                <Bell size={16} />
                            </div>

                            <div
                                onClick={() => setOpen(!open)}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-cyan-300 text-sm font-bold text-slate-950 shadow-[0_12px_28px_rgba(34,211,238,0.18)]"
                            >
                                {userData.name ? userData.name[0] : "U"}
                            </div>

                            {open && (
                                <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">

                                    <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
                                        {userData.email || "No email"}
                                    </div>

                                    <div
                                        onClick={() => {
                                            navigate("/settings");
                                            setOpen(false);
                                        }}
                                        className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06]"
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </div>

                                    <div
                                        onClick={handleLogout}
                                        className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                )}

                <main className="min-w-0 flex-1 p-3 pt-4 sm:p-5 lg:p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default Layout;
