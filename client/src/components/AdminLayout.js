import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

import {
    ChevronLeft,
    FileText,
    ZoomIn,
    ZoomOut
} from "lucide-react";

import { motion } from "framer-motion";

function TranscriptionView() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [fontSize, setFontSize] = useState(20);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/tests/${id}`);

                if (res.data?.passage) {
                    setText(res.data.passage);
                } else {
                    setText("No passage available for this test");
                }

            } catch (err) {
                console.error(err);
                setText("Failed to load passage");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTest();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6">

            {/* HEADER */}
            <div className="max-w-6xl mx-auto py-4 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">

                {/* BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm sm:text-base"
                >
                    <ChevronLeft size={18} />
                    Back
                </button>

                {/* TITLE */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <FileText className="text-indigo-400" size={18} />
                    <h1 className="text-base sm:text-xl font-bold">
                        Transcription Preview
                    </h1>
                </div>

                {/* FONT CONTROLS */}
                <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 py-2 rounded-xl border border-white/10">

                    <button
                        onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                        className="hover:bg-white/10 p-2 rounded"
                    >
                        <ZoomOut size={16} />
                    </button>

                    <span className="text-xs sm:text-sm">{fontSize}px</span>

                    <button
                        onClick={() => setFontSize(Math.min(36, fontSize + 2))}
                        className="hover:bg-white/10 p-2 rounded"
                    >
                        <ZoomIn size={16} />
                    </button>

                </div>

            </div>

            {/* CONTENT */}
            <div className="max-w-5xl mx-auto pb-8">

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                        <div className="w-12 h-12 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Loading passage...
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 shadow-xl overflow-y-auto max-h-[65vh] sm:max-h-[70vh]"
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: 1.8,
                            fontFamily: "Georgia, serif"
                        }}
                    >

                        <div className="text-gray-100 text-justify space-y-4">

                            {text.split("\n").map((line, i) => (
                                <p key={i}>
                                    {line}
                                </p>
                            ))}

                        </div>

                    </motion.div>
                )}

            </div>

            {/* FOOTER */}
            <div className="text-center text-gray-500 text-xs sm:text-sm pb-6">
                Tip: Adjust font size for better readability
            </div>

        </div>
    );
}

export default TranscriptionView;
