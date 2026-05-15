import { useEffect, useState } from "react";
import API from "../api/axios";

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Play,
    Eye,
    Clock,
    Tag,
    BookOpen,
    Loader2
} from "lucide-react";

function TranscriptionList() {

    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await API.get("/api/tests?type=transcription");

                setTests(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log(err);
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
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl sm:mb-8 sm:p-6 lg:p-8"
            >

                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">

                    <div>
                        <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent sm:text-3xl lg:text-4xl">
                            📝 Transcription
                        </h1>

                        <p className="text-sm sm:text-lg text-gray-300 mt-1">
                            Practice medical & legal passages
                        </p>
                    </div>

                    {/* SEARCH */}
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-sm sm:text-base outline-none"
                        />
                    </div>

                </div>

                {/* STATS */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 pt-6 border-t border-white/10 text-sm">

                    <div className="flex items-center gap-2 text-indigo-400">
                        <Clock size={16} />
                        {tests.length} tests
                    </div>

                    <div className="flex items-center gap-2 text-purple-400">
                        <Tag size={16} />
                        Medical • Legal
                    </div>

                </div>

            </motion.div>

            {/* CONTENT */}
            <AnimatePresence>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                        <Loader2 className="animate-spin text-indigo-400 mb-3" size={40} />
                        <p className="text-gray-400">Loading...</p>
                    </div>
                ) : filteredTests.length === 0 ? (

                    <div className="text-center mt-16">
                        <BookOpen className="mx-auto text-gray-500 mb-4" size={60} />
                        <p className="text-gray-400">
                            {search ? "No results found" : "No transcription tests"}
                        </p>
                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        {filteredTests.map((test, i) => (

                            <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5"
                            >

                                {/* TITLE */}
                                <h3 className="text-base sm:text-lg font-bold mb-2">
                                    {test.title}
                                </h3>

                                {/* META */}
                                <div className="text-xs sm:text-sm text-gray-400 mb-4 space-y-1">

                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {test.duration} min
                                    </div>

                                    {test.category && (
                                        <div className="flex items-center gap-2">
                                            <Tag size={14} />
                                            {test.category}
                                        </div>
                                    )}

                                </div>

                                {/* BUTTONS */}
                                <div className="flex gap-2 mt-auto">

                                    <button
                                        onClick={() => navigate(`/typing-settings/${test._id}`)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded text-sm flex items-center justify-center gap-2"
                                    >
                                        <Play size={14} /> Start
                                    </button>

                                    <button
                                        onClick={() => navigate(`/transcription-view/${test._id}`)}
                                        className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded"
                                    >
                                        <Eye size={14} />
                                    </button>

                                </div>

                            </motion.div>

                        ))}

                    </div>

                )}

            </AnimatePresence>

            {/* FLOAT BUTTON */}
        </div>
    );
}


export default TranscriptionList;
