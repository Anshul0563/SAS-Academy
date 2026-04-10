import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { useState, useEffect, useRef } from "react";

import {
    LayoutDashboard,
    Headphones,
    FileText,
    User,
    Bell,
    Menu,
    X
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
    ];

    const handleLogout = () => {
        localStorage.clear();
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
        <div className="flex min-h-screen bg-[#030712] text-white">

            {/* 🔥 BACKGROUND GLOW */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]"></div>

            {/* 🔥 SIDEBAR */}
            {!examMode && (
                <div
                    className={`fixed md:static z-50 w-64 h-full
                    bg-white/5 backdrop-blur-2xl
                    border-r border-white/10
                    shadow-[0_0_40px_rgba(0,0,0,0.6)]
                    transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
                >

                    {/* LOGO */}
                    <div className="px-6 py-6 text-xl font-semibold tracking-wide text-indigo-400">
                        ⚡ SAS Academy
                    </div>

                    {/* MENU */}
                    <div className="px-3 space-y-2">
                        {menu.map((item, i) => {
                            const Icon = item.icon;
                            const active = location.pathname === item.path;

                            return (
                                <div
                                    key={i}
                                    onClick={() => {
                                        navigate(item.path);
                                        setSidebarOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                                    ${active
                                            ? "bg-indigo-500/20 text-indigo-400 shadow-inner"
                                            : "text-gray-400 hover:bg-white/10 hover:text-white hover:translate-x-1"
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </div>
                            );
                        })}
                    </div>

                </div>
            )}

            {/* 🔥 MAIN */}
            <div className="flex-1 flex flex-col">

                {/* 🔥 FLOATING TOPBAR */}
                {!examMode && (
                    <div className="sticky top-0 z-40 mx-4 mt-4 rounded-xl
                        bg-white/5 backdrop-blur-xl border border-white/10
                        shadow-lg px-6 py-3 flex justify-between items-center">

                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            <Menu
                                className="cursor-pointer md:hidden"
                                onClick={() => setSidebarOpen(true)}
                            />
                            <h1 className="text-sm text-gray-300 capitalize">
                                {location.pathname.replace("/", "") || "dashboard"}
                            </h1>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4 relative" ref={dropdownRef}>

                            {/* 🔔 */}
                            <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition">
                                <Bell size={16} />
                            </div>

                            {/* 👤 USER */}
                            <div
                                onClick={() => setOpen(!open)}
                                className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center cursor-pointer shadow-lg"
                            >
                                {userData.name ? userData.name[0] : "U"}
                            </div>

                            {/* DROPDOWN */}
                            {open && (
                                <div className="absolute right-0 top-12 w-48 bg-[#020617]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">

                                    <div className="px-4 py-3 text-xs text-gray-400 border-b border-white/10">
                                        {userData.email || "No email"}
                                    </div>

                                    <div
                                        onClick={handleLogout}
                                        className="px-4 py-3 text-red-400 cursor-pointer hover:bg-red-500/10 transition"
                                    >
                                        Logout
                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                )}

                {/* CONTENT */}
                <div className="p-6 mt-2">
                    <Outlet />
                </div>

            </div>

        </div>
    );
}

export default Layout;