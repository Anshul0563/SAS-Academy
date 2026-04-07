<<<<<<< HEAD
import { useEffect, useState } from "react";
import axios from "axios";
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
                const res = await axios.get("http://localhost:5000/api/tests");
                const filtered = res.data.filter(t => t.type?.toLowerCase().trim() === "transcription");
                setTests(filtered);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/30 text-white px-4 sm:px-6 lg:px-10 py-6">

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-8 sm:mb-12 shadow-xl"
            >

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">

                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                        {filteredTests.map((test, i) => (

                            <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col"
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
            <button
                onClick={() => navigate("/typing-settings/quick")}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-indigo-500 p-3 sm:p-4 rounded-full shadow-lg"
            >
                <Play size={18} />
            </button>

        </div>
    );
}

=======
import { useEffect, useState } from "react";
import axios from "axios";
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
                const res = await axios.get("http://localhost:5000/api/tests");
                const filtered = res.data.filter(t => t.type?.toLowerCase().trim() === "transcription");
                setTests(filtered);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/30 text-white px-4 sm:px-6 lg:px-10 py-6">

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-8 sm:mb-12 shadow-xl"
            >

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">

                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                        {filteredTests.map((test, i) => (

                            <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col"
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
            <button
                onClick={() => navigate("/typing-settings/quick")}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-indigo-500 p-3 sm:p-4 rounded-full shadow-lg"
            >
                <Play size={18} />
            </button>

        </div>
    );
}

>>>>>>> d6c1bf3 (Complete MERN setup: backend APIs, MongoDB integration, authentication, admin dashboard, frontend pages, and bug fixes)
export default TranscriptionList;