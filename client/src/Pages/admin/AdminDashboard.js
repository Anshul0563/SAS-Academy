import { motion } from "framer-motion";
import {
    FileText,
    Users,
    BarChart3,
    PlusCircle
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/dashboard/admin-dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                setData(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">

            {/* HEADER */}
            <h1 className="text-3xl font-bold mb-6">👑 Admin Dashboard</h1>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                    { title: "Total Tests", value: data?.totalTests || 0, icon: FileText },
                    { title: "Users", value: data?.totalUsers || 0, icon: Users },
                    { title: "Dictation", value: data?.dictationTests || 0, icon: BarChart3 },
                    { title: "Transcription", value: data?.transcriptionTests || 0, icon: BarChart3 }
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/5 p-6 rounded-xl border border-white/10"
                        >
                            <Icon className="mb-2 text-indigo-400" />
                            <p className="text-gray-400 text-sm">{item.title}</p>
                            <h2 className="text-2xl font-bold">{item.value}</h2>
                        </motion.div>
                    );
                })}
            </div>

            {/* QUICK ACTION */}
            <div className="grid grid-cols-2 gap-6 mb-8">

                <div
                    onClick={() => navigate("/admin/add-test")}
                    className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-xl cursor-pointer"
                >
                    <PlusCircle className="mb-2 text-indigo-400" />
                    <h3>Add Test</h3>
                </div>

                <div
                    onClick={() => navigate("/admin/tests")}
                    className="bg-white/5 p-6 rounded-xl cursor-pointer"
                >
                    <FileText className="mb-2 text-indigo-400" />
                    <h3>Manage Tests</h3>
                </div>

            </div>

            {/* RECENT TESTS */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl mb-4">📊 Recent Tests</h3>

                {data?.recentTests?.map((test, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-white/10">
                        <span>{test.title}</span>
                        <span className="text-gray-400 text-sm">
                            {test.createdBy?.name || "Admin"}
                        </span>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default AdminDashboard;