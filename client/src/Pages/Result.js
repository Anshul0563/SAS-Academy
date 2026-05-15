import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useExam } from "../context/ExamContext";

import {
    RefreshCcw,
    Download,
    BarChart3,
    CheckCircle
} from "lucide-react";

function Result() {

    const navigate = useNavigate();
    const resultRef = useRef();
    const { setExamMode } = useExam();

    const [data, setData] = useState(null);
    const [comparison, setComparison] = useState([]);
    const [breakdown, setBreakdown] = useState({
        omission: 0, addition: 0, spelling: 0, caps: 0, punctuation: 0
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setExamMode(false);
    }, [setExamMode]);

    const clean = (text = "") => text.replace(/\s+/g, " ").trim();

    // ================= SAVE =================
    const saveTestData = async () => {
        if (!data) return;

        try {
            setSaving(true);
            const testId = localStorage.getItem("testId");

            const testRes = await axios.get(`http://localhost:5000/api/tests/${testId}`);

            const newTest = {
                testId,
                passageName: testRes.data.title || "Practice",
                wpm: data.wpm,
                accuracy: data.accuracy / 100,
                rawWPM: data.rawWPM,
                totalWords: data.total,
                correctWords: data.correct,
                timeUsed: parseFloat(data.time) * 60,
                errorsDetails: data.mistakes,
                breakdown,
                createdAt: new Date().toISOString()
            };

            const userTests = JSON.parse(localStorage.getItem("userTests") || "[]");
            userTests.push(newTest);
            localStorage.setItem("userTests", JSON.stringify(userTests.slice(-50)));

        } catch (err) {
            console.log("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    // ================= CALC =================
    useEffect(() => {

        const run = async () => {
            const testId = localStorage.getItem("testId");
            const typedText = localStorage.getItem("typedText") || "";
            const timeUsedSeconds = Number(localStorage.getItem("timeUsed")) || 1;

            let originalText = "";

            try {
                const res = await axios.get(`http://localhost:5000/api/tests/${testId}`);
                originalText = res.data?.passage || "";
            } catch { }

            const original = clean(originalText).split(" ");
            const typed = clean(typedText).split(" ");

            let correctWords = 0;
            let totalErrors = 0;
            let comp = [];
            let counts = { omission: 0, addition: 0, spelling: 0, caps: 0, punctuation: 0 };

            for (let i = 0; i < Math.max(original.length, typed.length); i++) {

                const o = original[i] || "";
                const t = typed[i] || "";

                if (!o && t) {
                    counts.addition++; totalErrors++;
                    comp.push({ word: t, type: "addition", strike: true });
                }
                else if (!t && o) {
                    counts.omission++; totalErrors++;
                    comp.push({ word: o, type: "omission" });
                }
                else if (t === o) {
                    correctWords++;
                    comp.push({ word: t, type: "correct" });
                }
                else {
                    counts.spelling++; totalErrors++;
                    comp.push({ word: t || o, type: "spelling" });
                }
            }

            const minutes = timeUsedSeconds / 60;

            setData({
                total: original.length,
                typed: typed.length,
                correct: correctWords,
                mistakes: totalErrors,
                accuracy: Math.round((correctWords / original.length) * 100),
                wpm: Math.round(correctWords / minutes),
                rawWPM: Math.round(typed.length / minutes),
                time: minutes.toFixed(2)
            });

            setComparison(comp);
            setBreakdown(counts);

            setTimeout(saveTestData, 800);
        };

        run();

    }, []);

    // ================= STYLE =================
    const getStyle = (type) => {
        const base = "px-2 py-1 text-[10px] sm:text-xs rounded";

        const colors = {
            correct: "bg-green-500/20 text-green-300",
            omission: "bg-red-500/20 text-red-300",
            addition: "bg-yellow-500/20 text-yellow-300",
            spelling: "bg-orange-500/20 text-orange-300",
        };

        return `${base} ${colors[type] || colors.spelling}`;
    };

    if (!data) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">

            <div ref={resultRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                        Test Results
                    </h1>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                    <div>WPM<br /><b>{data.wpm}</b></div>
                    <div>Accuracy<br /><b>{data.accuracy}%</b></div>
                    <div>Correct<br /><b>{data.correct}</b></div>
                    <div>Errors<br /><b>{data.mistakes}</b></div>
                </div>

                {/* COMPARISON */}
                <div className="bg-white/5 p-4 rounded-xl mb-6">

                    <h3 className="mb-3 text-sm text-gray-400">
                        Comparison
                    </h3>

                    <div className="max-h-[250px] overflow-y-auto flex flex-wrap gap-1">
                        {comparison.map((item, i) => (
                            <span key={i} className={getStyle(item.type)}>
                                {item.word}
                            </span>
                        ))}
                    </div>

                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-indigo-600 px-4 py-2 rounded flex items-center justify-center gap-2"
                    >
                        <BarChart3 size={16} /> Dashboard
                    </button>

                    <button
                        onClick={() => navigate(`/typing/${localStorage.getItem("testId")}`)}
                        className="bg-green-600 px-4 py-2 rounded flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={16} /> Retry
                    </button>

                    <button
                        onClick={() => alert("PDF Coming Soon")}
                        className="bg-yellow-600 px-4 py-2 rounded flex items-center justify-center gap-2"
                    >
                        <Download size={16} /> PDF
                    </button>

                </div>

            </div>
        </div>
    );
}

export default Result;