import { motion } from "framer-motion";
import {
    FileText,
    Users,
    BarChart3,
    PlusCircle
} from "lucide-react";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //  useCallback fix (eslint + performance)
    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const res = await axios.get(
                "http://localhost:5000/api/dashboard/admin-dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: { t: Date.now() }
                }
            );

            console.log("🔥 DASHBOARD DATA:", res.data); // ✅ DEBUG

            setData(res.data);

        } catch (err) {
            console.error("Dashboard Error:", err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();

        //  AUTO REFRESH
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);

    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
                <h2 className="text-xl animate-pulse">Loading Dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-8">

            <h1 className="text-3xl font-bold mb-6">👑 Admin Dashboard</h1>

            {/*  CLICKABLE STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    {
                        title: "Total Tests",
                        value: data?.totalTests || 0,
                        icon: FileText,
                        route: "/admin/tests"
                    },
                    {
                        title: "Users",
                        value: data?.totalUsers || 0,
                        icon: Users,
                        route: "/admin/users"
                    },
                    {
                        title: "Dictation",
                        value: data?.dictationTests || 0,
                        icon: BarChart3,
                        route: "/admin/tests?type=dictation"
                    },
                    {
                        title: "Transcription",
                        value: data?.transcriptionTests || 0,
                        icon: BarChart3,
                        route: "/admin/tests?type=transcription"
                    }
                ].map((item, i) => {
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate(item.route)} //  CLICK
                            className="bg-white/5 p-6 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition"
                        >
                            <Icon className="mb-2 text-indigo-400" />
                            <p className="text-gray-400 text-sm">{item.title}</p>
                            <h2 className="text-2xl font-bold">{item.value}</h2>
                        </motion.div>
                    );
                })}
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                <div
                    onClick={() => navigate("/admin/add-test")}
                    className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-xl cursor-pointer hover:scale-105 transition"
                >
                    <PlusCircle className="mb-2 text-indigo-400" />
                    <h3>Add Test</h3>
                </div>

                <div
                    onClick={() => navigate("/admin/tests")}
                    className="bg-white/5 p-6 rounded-xl cursor-pointer hover:scale-105 transition"
                >
                    <FileText className="mb-2 text-indigo-400" />
                    <h3>Manage Tests</h3>
                </div>

            </div>

            {/* RECENT TESTS */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl mb-4">📊 Recent Tests</h3>

                {Array.isArray(data?.recentTests) && data.recentTests.length > 0 ? (
                    data.recentTests.map((test, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-white/10">
                            <span>{test.title}</span>
                            <span className="text-gray-400 text-sm">
                                {test.createdBy?.name || "Admin"}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No recent tests found</p>
                )}
            </div>

        </div>
    );
}

export default AdminDashboard;