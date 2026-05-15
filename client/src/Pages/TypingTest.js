import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExam } from "../context/ExamContext";

function TypingTest() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { setExamMode } = useExam();

    const [inputText, setInputText] = useState("");
    const settings = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("testSettings")) || {};
        } catch {
            return {};
        }
    }, []);
    const totalMinutes = Number(settings.time) || 50;
    const totalSeconds = totalMinutes * 60;

    const [time, setTime] = useState(totalSeconds);
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [backspaceCount, setBackspaceCount] = useState(0);

    // ✅ EXAM MODE
    useEffect(() => {
        setExamMode(true);
        return () => setExamMode(false);
    }, [setExamMode]);

    // ⏱ TIMER
    const words = inputText.trim().split(/\s+/).filter(Boolean).length;
    const keystrokes = inputText.length;
    const minutesPassed = (totalSeconds - time) / 60;
    const liveWpm = minutesPassed > 0 ? Math.round((keystrokes / 5) / minutesPassed) : 0;

    // ✅ SUBMIT
    const handleSubmit = useCallback(() => {
        if (submitted) return;

        const timeUsed = Math.max(1, totalSeconds - time);

        localStorage.setItem("typedText", inputText);
        localStorage.setItem("testId", id);
        localStorage.setItem("time", totalSeconds);
        localStorage.setItem("backspace", backspaceCount);
        localStorage.setItem("timeUsed", timeUsed);
        localStorage.setItem("keystrokes", keystrokes);

        setSubmitted(true);
        setExamMode(false);
        navigate("/result");
    }, [backspaceCount, id, inputText, keystrokes, navigate, setExamMode, submitted, time, totalSeconds]);

    // ⏱ TIMER
    useEffect(() => {
        if (!started || submitted) return undefined;

        if (time <= 0) {
            handleSubmit();
            return undefined;
        }

        const interval = setInterval(() => {
            setTime(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [handleSubmit, started, submitted, time]);

    // ❌ EXIT
    const handleExit = () => {
        if (!window.confirm("⚠ Exit test?")) return;
        setExamMode(false);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-dvh bg-[#020617] px-3 py-3 text-white sm:px-6 sm:py-4">

            {/* HEADER */}
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">

                <h1 className="text-lg sm:text-xl font-bold">
                    Typing Test
                </h1>

                <div className="flex items-center gap-3">

                    <span className="bg-green-500 px-3 py-1 rounded text-xs sm:text-sm">
                        {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
                    </span>

                    <button
                        onClick={handleExit}
                        className="bg-red-500 px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600"
                    >
                        Exit
                    </button>

                </div>

            </div>

            {/* STATS */}
            <div className="mb-4 flex flex-wrap gap-2 text-xs text-gray-300 sm:gap-4 sm:text-sm">

                <span>Words: {words}</span>
                <span>Keystrokes: {keystrokes}</span>
                <span>Gross WPM: {liveWpm}</span>
                <span>Backspace: {backspaceCount}</span>

            </div>

            {/* TEXT AREA */}
            <div className="rounded-xl border border-white/10 bg-[#020617]/80 p-3 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:p-5">

                <textarea
                    value={inputText}
                    onChange={(e) => {
                        if (!started) setStarted(true);
                        setInputText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Backspace") {

                            setBackspaceCount(prev => prev + 1);

                            if (!settings.backspace || settings.examType === "ssc") {
                                e.preventDefault();
                            }
                        }
                    }}
                    placeholder="Start typing here..."
                    className="h-[58vh] w-full resize-none bg-transparent text-sm outline-none sm:h-[62vh] sm:text-base md:h-[65vh]"
                    style={{ fontSize: `${settings.fontSize || 20}px` }}
                />

            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-6">

                <button
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-3 text-sm font-semibold transition hover:bg-green-600 sm:w-[60%] sm:text-lg lg:w-[30%]"
                >
                    Submit Test
                </button>

            </div>

        </div>
    );
}

export default TypingTest;
