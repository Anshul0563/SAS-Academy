import { useEffect, useState } from "react";
import axios from "axios";

function AdminTests() {

    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/api/tests",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = res.data.tests || res.data;
                setTests(Array.isArray(data) ? data : []);

            } catch (err) {
                console.error(err);
                setError("Failed to load tests");
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#020617]">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 mt-20 text-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    🚀 Admin Dashboard
                </h1>

                <button className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 rounded-xl text-sm font-semibold shadow-lg hover:scale-105 transition">
                    + Create Test
                </button>
            </div>

            {/* GRID */}
            {tests.length === 0 ? (
                <p className="text-gray-400">No tests found</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {tests.map((test) => (
                        <div
                            key={test._id}
                            className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.03] transition duration-300"
                        >

                            {/* GLOW BORDER EFFECT */}
                            <div className="absolute inset-0 rounded-2xl border border-transparent hover:border-indigo-500/40 transition pointer-events-none"></div>

                            {/* TYPE BADGE */}
                            <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium
                                ${test.type === "dictation"
                                    ? "bg-indigo-500/20 text-indigo-300"
                                    : "bg-pink-500/20 text-pink-300"
                                }`}
                            >
                                {test.type}
                            </span>

                            {/* TITLE */}
                            <h2 className="text-lg font-semibold mb-2">
                                {test.title}
                            </h2>

                            {/* DETAILS */}
                            <div className="text-sm text-gray-400 space-y-1">
                                <p>⏱ {test.duration} min</p>
                                <p>🎯 {test.difficulty}</p>
                                <p>📂 {test.category}</p>
                            </div>

                            {/* TAGS */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {test.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs bg-white/10 px-2 py-1 rounded-md border border-white/10"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* ACTIONS */}
                            <div className="flex justify-between mt-6 text-sm">

                                <button className="text-indigo-400 hover:text-indigo-300 transition">
                                    ✏️ Edit
                                </button>

                                <button className="text-red-400 hover:text-red-300 transition">
                                    🗑 Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default AdminTests;