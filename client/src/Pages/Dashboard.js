import { motion } from "framer-motion";
import {
    Phone,
    Mail,
    Award,
    Target,
    BarChart3,
    TrendingUp,
    Play,
    Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-white">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 shadow-lg">

                    <div>
                        <h1 className="text-lg sm:text-xl font-bold">SAS Academy</h1>
                        <p className="text-xs sm:text-sm opacity-80">Typing Dashboard</p>
                    </div>

                    <div className="text-center sm:text-right text-xs sm:text-sm opacity-80">
                        {new Date().toLocaleTimeString()} <br />
                        {new Date().toDateString()}
                    </div>

                </div>

                {/* HERO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-10 text-center"
                >
                    <h2 className="text-xl sm:text-3xl font-bold mb-3">
                        Master Your Typing Skills 🚀
                    </h2>

                    <p className="text-gray-400 mb-6 text-sm sm:text-base">
                        Improve speed, accuracy & consistency with real exam simulation
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3">

                        <button
                            onClick={() => navigate("/typing-settings/new-quick")}
                            className="bg-indigo-500 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition flex items-center justify-center gap-2"
                        >
                            <Play size={18} /> Start Test
                        </button>

                        <button
                            onClick={() => navigate("/transcription")}
                            className="border border-white/20 px-5 py-2 rounded-lg hover:bg-white/10 transition"
                        >
                            Explore Tests
                        </button>

                    </div>
                </motion.div>

                {/* STATS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">

                    {[
                        { num: "24", label: "Tests", icon: BarChart3 },
                        { num: "87", label: "Best WPM", icon: TrendingUp },
                        { num: "93%", label: "Accuracy", icon: Target },
                        { num: "#42", label: "Rank", icon: Award }
                    ].map((item, i) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={i}
                                className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition"
                            >
                                <Icon className="mx-auto mb-2 text-indigo-400" size={20} />
                                <h3 className="text-lg sm:text-2xl font-bold">{item.num}</h3>
                                <p className="text-xs sm:text-sm text-gray-400">{item.label}</p>
                            </div>
                        );
                    })}

                </div>

                {/* BEST PERFORMANCE */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-6 sm:p-8 rounded-xl text-center">

                    <Star className="mx-auto mb-3 text-emerald-400" size={32} />

                    <h2 className="text-lg sm:text-2xl font-bold mb-2">Best Performance</h2>

                    <h1 className="text-3xl sm:text-4xl font-bold text-emerald-400">
                        87 WPM
                    </h1>

                    <p className="text-gray-400 mt-2 text-sm">
                        Medical Test • 96% Accuracy
                    </p>

                    <button
                        onClick={() => navigate("/result")}
                        className="mt-4 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                    >
                        View Details
                    </button>

                </div>

                {/* RECENT TESTS */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">

                    <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Tests</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                        {[
                            { wpm: 82, acc: 94, name: "Legal Test" },
                            { wpm: 87, acc: 96, name: "Medical" },
                            { wpm: 79, acc: 92, name: "Practice" }
                        ].map((t, i) => (

                            <div
                                key={i}
                                className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer"
                                onClick={() => navigate("/result")}
                            >
                                <h3 className="text-lg font-bold">{t.wpm} WPM</h3>
                                <p className="text-gray-400 text-sm">{t.acc}% Accuracy</p>
                                <p className="text-xs text-gray-500 mt-1">{t.name}</p>
                            </div>

                        ))}

                    </div>

                </div>

                {/* ACTION CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                    {[
                        { title: "Transcription", to: "/transcription" },
                        { title: "Dictation", to: "/dictations" },
                        { title: "Speed Test", to: "/typing-settings/new-quick" }
                    ].map((c, i) => (

                        <div
                            key={i}
                            onClick={() => navigate(c.to)}
                            className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 p-6 rounded-xl text-center cursor-pointer hover:scale-105 transition"
                        >
                            <h3 className="text-lg font-bold">{c.title}</h3>
                        </div>

                    ))}

                </div>

                {/* CONTACT FOOTER */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">

                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-sm">

                        <div className="flex items-center justify-center gap-2">
                            <Phone size={14} /> +91 8178844795
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <Mail size={14} /> support@sasacademy.in
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;
