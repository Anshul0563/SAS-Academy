import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

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
                const res = await API.get(`/tests/${id}`);

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
        <div className="sas-shell px-3 text-white sm:px-6">

            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">

                <button
                    onClick={() => navigate(-1)}
                    className="sas-button-secondary px-3 py-2"
                >
                    <ChevronLeft size={18} />
                    Back
                </button>

                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <FileText className="text-cyan-300" size={18} />
                    <h1 className="text-base sm:text-xl font-bold">
                        Transcription Preview
                    </h1>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 sm:gap-3">

                    <button
                        onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                        className="rounded-xl p-2 transition hover:bg-white/10"
                    >
                        <ZoomOut size={16} />
                    </button>

                    <span className="text-xs sm:text-sm">{fontSize}px</span>

                    <button
                        onClick={() => setFontSize(Math.min(36, fontSize + 2))}
                        className="rounded-xl p-2 transition hover:bg-white/10"
                    >
                        <ZoomIn size={16} />
                    </button>

                </div>

            </div>

            <div className="max-w-5xl mx-auto pb-8">

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-300"></div>
                        <p className="text-sm text-slate-400 sm:text-base">
                            Loading passage...
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="sas-panel max-h-[65vh] overflow-y-auto p-4 sm:max-h-[70vh] sm:p-6 md:p-8 lg:p-10"
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: 1.8,
                            fontFamily: "Georgia, serif"
                        }}
                    >

                        <div className="space-y-4 text-justify text-slate-100">

                            {text.split("\n").map((line, i) => (
                                <p key={i}>
                                    {line}
                                </p>
                            ))}

                        </div>

                    </motion.div>
                )}

            </div>

            <div className="pb-6 text-center text-xs text-slate-500 sm:text-sm">
                Tip: Adjust font size for better readability
            </div>

        </div>
    );
}

export default TranscriptionView;
