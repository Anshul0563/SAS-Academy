import { useEffect, useState } from "react";
import API from "../api/axios";

import { AnimatePresence, motion } from "framer-motion";
import {
    BookOpen,
    Clock,
    Eye,
    Loader2,
    Play,
    Search,
    Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const getDisplayDuration = (test) => {
    const duration = Number(test?.duration);
    return !duration || duration === 5 ? 50 : duration;
};

function TranscriptionList() {

    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await API.get("/tests?type=transcription");

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
        <div className="mx-auto max-w-7xl text-white">

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="sas-panel mb-6 p-5 sm:p-6"
            >

                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">

                    <div>
                        <p className="sas-kicker">Typing Practice</p>
                        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                            Transcription
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Practice medical & legal passages
                        </p>
                    </div>

                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="sas-input pl-10"
                        />
                    </div>

                </div>

                <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-5 text-sm sm:gap-6">

                    <div className="flex items-center gap-2 text-cyan-200">
                        <Clock size={16} />
                        {tests.length} tests
                    </div>

                    <div className="flex items-center gap-2 text-emerald-200">
                        <Tag size={16} />
                        Steno  • Legal
                    </div>

                </div>

            </motion.div>

            <AnimatePresence>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                        <Loader2 className="mb-3 animate-spin text-cyan-300" size={40} />
                        <p className="text-slate-400">Loading...</p>
                    </div>
                ) : filteredTests.length === 0 ? (

                    <div className="sas-card mt-10 p-10 text-center">
                        <BookOpen className="mx-auto mb-4 text-slate-500" size={60} />
                        <p className="text-slate-400">
                            {search ? "No results found" : "No transcription tests"}
                        </p>
                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        {filteredTests.map((test, i) => (

                            <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -3 }}
                                className="sas-card sas-card-hover flex flex-col p-4 sm:p-5"
                            >

                                <h3 className="text-base sm:text-lg font-bold mb-2">
                                    {test.title}
                                </h3>

                                <div className="mb-4 space-y-2 text-xs text-slate-400 sm:text-sm">

                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {getDisplayDuration(test)} min
                                    </div>

                                    {test.category && (
                                        <div className="flex items-center gap-2">
                                            <Tag size={14} />
                                            {test.category}
                                        </div>
                                    )}

                                </div>

                                <div className="flex gap-2 mt-auto">

                                    <button
                                        onClick={() => navigate(`/typing-settings/${test._id}`)}
                                        className="sas-button-primary flex-1 py-2 text-sm"
                                    >
                                        <Play size={14} /> Start
                                    </button>

                                    <button
                                        onClick={() => navigate(`/transcription-view/${test._id}`)}
                                        aria-label="Preview transcription"
                                        className="sas-button-secondary px-3 py-2"
                                    >
                                        <Eye size={14} />
                                    </button>

                                </div>

                            </motion.div>

                        ))}

                    </div>

                )}

            </AnimatePresence>

        </div>
    );
}


export default TranscriptionList;
