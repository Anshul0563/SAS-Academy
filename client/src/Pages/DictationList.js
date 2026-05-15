import { useState, useEffect } from "react";
import API from "../api/axios";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Play,
    Headphones,
    Clock,
    Tag,
    Loader2
} from "lucide-react";

function DictationList() {

    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await API.get("/tests?type=dictation");


                const filtered = res.data
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setTests(filtered);
            } catch (err) {
                console.log("Dictation fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    const filteredTests = tests.filter((t) =>
        t.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="text-white">

            {/* HEADER */}
            <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">

                <div>
                    <h1 className="text-2xl font-bold text-pink-400 sm:text-3xl">
                        🎤 Dictation Tests
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm">
                        Practice audio dictation
                    </p>
                </div>

                {/* SEARCH */}
                <div className="w-full md:w-72 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm focus:border-pink-400"
                    />
                </div>
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <Loader2 className="animate-spin text-pink-400 mb-3" size={36} />
                    <p className="text-gray-400 text-sm">Loading tests...</p>
                </div>
            ) : filteredTests.length === 0 ? (
                <div className="text-center mt-16">
                    <Headphones className="mx-auto text-gray-500 mb-3" size={50} />
                    <p className="text-gray-400 text-sm">
                        {search ? "No results found" : "No dictation tests available"}
                    </p>
                </div>
            ) : (

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

                    {filteredTests.map((test) => (

                        <motion.div
                            key={test._id}
                            whileHover={{ scale: 1.02 }}
                            className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                        >

                            {/* TITLE */}
                            <h2 className="font-semibold text-base sm:text-lg mb-2 text-white line-clamp-2">
                                {test.title}
                            </h2>

                            {/* META */}
                            <div className="text-xs sm:text-sm text-gray-400 space-y-1 mb-3">

                                {test.duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {test.duration} min
                                    </div>
                                )}

                                {test.category && (
                                    <div className="flex items-center gap-2">
                                        <Tag size={14} />
                                        {test.category}
                                    </div>
                                )}

                            </div>

                            {/* TAGS */}
                            {test.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {test.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-[10px] bg-purple-500/20 px-2 py-1 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="flex gap-2 mt-auto">

                                <button
                                    onClick={() => navigate(`/dictation/${test._id}`)}
                                    disabled={!test.audioURL && !test.audioUrl}
                                    className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded flex items-center justify-center gap-2 text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Play size={14} />
                                    Start
                                </button>

                            </div>

                        </motion.div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default DictationList;
