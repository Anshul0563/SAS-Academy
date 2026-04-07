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

    // ✅ SAFE USER PARSE
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

    // ✅ CLOSE DROPDOWN OUTSIDE CLICK
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
        <div className="flex min-h-screen bg-[#020617] text-white">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            {!examMode && (
                <div
                    className={`
                        fixed md:static z-50 w-64 h-full 
                        bg-gradient-to-b from-[#020617] to-[#0f172a]
                        border-r border-white/10 p-5
                        transform transition-transform duration-300
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0
                    `}
                >

                    {/* MOBILE HEADER */}
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <h2 className="text-lg font-bold text-indigo-400">
                            ⚡ SAS Academy
                        </h2>
                        <X
                            className="cursor-pointer"
                            onClick={() => setSidebarOpen(false)}
                        />
                    </div>

                    {/* DESKTOP LOGO */}
                    <h2 className="text-2xl font-bold mb-8 text-indigo-400 hidden md:block">
                        ⚡ SAS Academy
                    </h2>

                    {/* MENU */}
                    <div className="space-y-3">
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
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                                    ${active
                                            ? "bg-indigo-500 text-white shadow-lg"
                                            : "hover:bg-white/10 text-gray-300"
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

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* NAVBAR */}
                {!examMode && (
                    <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/10 bg-[#020617]">

                        {/* LEFT */}
                        <div className="flex items-center gap-3">

                            <Menu
                                className="md:hidden cursor-pointer"
                                onClick={() => setSidebarOpen(true)}
                            />

                            <h1 className="text-sm sm:text-lg font-semibold">
                                {location.pathname.replace("/", "").toUpperCase() || "DASHBOARD"}
                            </h1>

                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4 relative" ref={dropdownRef}>

                            {/* 🔔 */}
                            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />

                            {/* 👤 PROFILE */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(!open);
                                }}
                                className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 transition"
                            >

                                <User className="w-4 h-4" />

                                {/* ✅ NAME FIX */}
                                <span className="text-xs sm:text-sm">
                                    {userData.name
                                        ? userData.name.split(" ")[0]
                                        : "User"}
                                </span>

                            </div>

                            {/* DROPDOWN */}
                            {open && (
                                <div className="absolute right-0 top-12 w-40 bg-[#020617] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">

                                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-white/10">
                                        {userData.email || "No email"}
                                    </div>

                                    <div
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm hover:bg-red-500/20 cursor-pointer text-red-400"
                                    >
                                        🚪 Logout
                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                )}

                {/* CONTENT */}
                <div className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </div>

            </div>

        </div>
    );
}

export default Layout;