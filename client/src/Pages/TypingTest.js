import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExam } from "../context/ExamContext";

function TypingTest() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { setExamMode } = useExam();

    const [inputText, setInputText] = useState("");
    const [time, setTime] = useState(300);
    const [started, setStarted] = useState(false);
    const [backspaceCount, setBackspaceCount] = useState(0);

    const settings = JSON.parse(localStorage.getItem("testSettings")) || {};
    const totalTime = settings.time || 5;

    // ✅ EXAM MODE
    useEffect(() => {
        setExamMode(true);
        return () => setExamMode(false);
    }, [setExamMode]);

    // ⏱ TIMER
    useEffect(() => {
        let interval;

        if (started && time > 0) {
            interval = setInterval(() => {
                setTime(prev => prev - 1);
            }, 1000);
        }

        if (time === 0) handleSubmit();

        return () => clearInterval(interval);

    }, [started, time]);

    const words = inputText.trim().split(/\s+/).filter(Boolean).length;
    const keystrokes = inputText.length;
    const minutesPassed = totalTime - time / 60;
    const wpm = minutesPassed > 0 ? Math.round(words / minutesPassed) : 0;

    // ✅ SUBMIT
    const handleSubmit = () => {
        const totalTime = settings.time * 60;
        const timeUsed = totalTime - time;

        localStorage.setItem("typedText", inputText);
        localStorage.setItem("testId", id);
        localStorage.setItem("time", totalTime);
        localStorage.setItem("backspace", backspaceCount);
        localStorage.setItem("timeUsed", timeUsed);

        setExamMode(false);
        navigate("/result");
    };

    // ❌ EXIT
    const handleExit = () => {
        if (!window.confirm("⚠ Exit test?")) return;
        setExamMode(false);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-4">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">

                <h1 className="text-lg sm:text-xl font-bold">
                    Typing Test
                </h1>

                <div className="flex items-center gap-3">

                    <span className="bg-green-500 px-3 py-1 rounded text-xs sm:text-sm">
                        {time}s
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
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 mb-4">

                <span>Words: {words}</span>
                <span>Keystrokes: {keystrokes}</span>
                <span>WPM: {wpm}</span>
                <span>Backspace: {backspaceCount}</span>

            </div>

            {/* TEXT AREA */}
            <div className="border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-[#020617]/80 backdrop-blur-xl shadow-xl">

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
                    className="w-full h-[55vh] sm:h-[60vh] md:h-[65vh] bg-transparent outline-none resize-none text-sm sm:text-base"
                    style={{ fontSize: `${settings.fontSize || 20}px` }}
                />

            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-6">

                <button
                    onClick={handleSubmit}
                    className="w-full sm:w-[60%] lg:w-[30%] bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl text-sm sm:text-lg font-semibold hover:scale-105 transition"
                >
                    Submit Test
                </button>

            </div>

        </div>
    );
}

export default TypingTest;