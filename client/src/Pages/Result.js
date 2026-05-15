import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";

import {
    RefreshCcw,
    Download,
    BarChart3
} from "lucide-react";

const clean = (text = "", options = {}) => {
    let value = String(text)
        .replace(/\r\n/g, "\n")
        .replace(/\s+/g, " ")
        .trim();

    if (options.ignoreCase) value = value.toLowerCase();
    if (options.ignorePunctuation) value = value.replace(/[^\w\s]|_/g, "");

    return value;
};

const tokenize = (text = "", options = {}) => {
    const value = clean(text, options);
    return value ? value.split(" ") : [];
};

const round = (value, decimals = 2) => Number(Number(value || 0).toFixed(decimals));

const countWordStrokes = (words = []) => {
    if (!words.length) return 0;
    return words.reduce((total, word) => total + String(word || "").length, 0) + words.length - 1;
};

const buildComparison = (originalWords, typedWords) => {
    const rows = originalWords.length;
    const cols = typedWords.length;
    const dp = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));

    for (let i = 0; i <= rows; i++) dp[i][0] = i;
    for (let j = 0; j <= cols; j++) dp[0][j] = j;

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            const cost = originalWords[i - 1] === typedWords[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }

    const comparison = [];
    let i = rows;
    let j = cols;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (originalWords[i - 1] === typedWords[j - 1] ? 0 : 1)) {
            comparison.unshift({
                expected: originalWords[i - 1],
                typed: typedWords[j - 1],
                word: typedWords[j - 1],
                type: originalWords[i - 1] === typedWords[j - 1] ? "correct" : "spelling"
            });
            i--;
            j--;
        } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
            comparison.unshift({
                expected: originalWords[i - 1],
                typed: "",
                word: originalWords[i - 1],
                type: "omission"
            });
            i--;
        } else {
            comparison.unshift({
                expected: "",
                typed: typedWords[j - 1],
                word: typedWords[j - 1],
                type: "addition"
            });
            j--;
        }
    }

    return comparison;
};

const calculateLocalResult = ({ originalText, typedText, timeUsedSeconds, settings }) => {
    const options = {
        ignoreCase: settings.ignoreCase || settings.caps === "none",
        ignorePunctuation: settings.ignorePunctuation || settings.punctuation === "none"
    };
    const originalWords = tokenize(originalText, options);
    const typedWords = tokenize(typedText, options);
    const comparison = buildComparison(originalWords, typedWords);
    const correctWords = comparison.filter((item) => item.type === "correct").length;
    const omissions = comparison.filter((item) => item.type === "omission").length;
    const additions = comparison.filter((item) => item.type === "addition").length;
    const spelling = comparison.filter((item) => item.type === "spelling").length;
    const errors = omissions + additions + spelling;
    const minutes = Math.max(1, Number(timeUsedSeconds) || 1) / 60;
    const typedCharacters = clean(typedText, options).length;
    const expectedCharacters = clean(originalText, options).length;
    const correctCharacters = countWordStrokes(
        comparison
            .filter((item) => item.type === "correct")
            .map((item) => item.typed || item.word)
    );
    const errorPenaltyCharacters = Math.min(typedCharacters, errors * 5);
    const grossWPM = (typedCharacters / 5) / minutes;
    const netWPM = (correctCharacters / 5) / minutes;
    const totalWords = originalWords.length || 1;

    return {
        grossWPM: round(grossWPM),
        netWPM: round(netWPM),
        accuracy: round(Math.max(0, ((totalWords - errors) / totalWords) * 100)),
        totalWords: originalWords.length,
        typedWords: typedWords.length,
        correctWords,
        errors,
        errorsDetails: errors,
        typedCharacters,
        expectedCharacters,
        correctCharacters,
        errorPenaltyCharacters,
        omissions,
        additions,
        spelling,
        capitalization: 0,
        comparison,
        timeTaken: Math.max(1, Number(timeUsedSeconds) || 1)
    };
};

const formatNumber = (value, decimals = 1) => {
    const number = Number(value || 0);
    return number % 1 === 0 ? String(number) : number.toFixed(decimals);
};

const formatTime = (seconds = 0) => {
    const value = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(value / 60);
    const remainingSeconds = String(Math.floor(value % 60)).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
};

function Result() {
    const navigate = useNavigate();
    const resultRef = useRef();
    const { setExamMode } = useExam();

    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const settings = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("testSettings")) || {};
        } catch {
            return {};
        }
    }, []);

    useEffect(() => {
        setExamMode(false);
    }, [setExamMode]);

    useEffect(() => {
        const run = async () => {
            const testId = localStorage.getItem("testId");
            const typedText = localStorage.getItem("typedText") || "";
            const timeUsedSeconds = Number(localStorage.getItem("timeUsed")) || 1;
            const backspaces = Number(localStorage.getItem("backspace")) || 0;
            const keystrokes = Number(localStorage.getItem("keystrokes")) || typedText.length;

            try {
                const token = localStorage.getItem("userToken") || localStorage.getItem("token");
                const res = await axios.post(
                    "/api/results/submit",
                    {
                        testId,
                        typedText,
                        timeTaken: timeUsedSeconds,
                        backspaces,
                        keystrokes,
                        settings
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setData(res.data);
            } catch (submitError) {
                console.error("Result submit error:", submitError);
                setError("Result was calculated locally, but it could not be saved right now.");

                try {
                    const testRes = await axios.get(`/api/tests/${testId}`);
                    setData(calculateLocalResult({
                        originalText: testRes.data?.passage || "",
                        typedText,
                        timeUsedSeconds,
                        settings
                    }));
                } catch {
                    setData(calculateLocalResult({
                        originalText: typedText,
                        typedText,
                        timeUsedSeconds,
                        settings
                    }));
                }
            }
        };

        run();
    }, [settings]);

    const downloadResult = () => {
        if (!data) return;

        const errors = data.errorsDetails ?? data.errors ?? 0;
        const lines = [
            "SAS Academy Result",
            `Net WPM: ${data.netWPM || 0}`,
            `Gross WPM: ${data.grossWPM || 0}`,
            `Accuracy: ${data.accuracy || 0}%`,
            `Correct Words: ${data.correctWords || 0}`,
            `Errors: ${errors}`,
            `Correct Strokes: ${data.correctCharacters || 0}`,
            `Typed Strokes: ${data.typedCharacters || data.keystrokes || 0}`,
            `Time: ${data.timeTaken || 0}s`
        ];

        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sas-academy-result.txt";
        link.click();
        URL.revokeObjectURL(url);
    };

    if (!data) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-white">
                Loading result...
            </div>
        );
    }

    const errors = data.errorsDetails ?? data.errors ?? 0;
    const typedCharacters = data.typedCharacters ?? data.keystrokes ?? 0;
    const scoreCards = [
        { label: "Net WPM", value: formatNumber(data.netWPM), tone: "text-emerald-300", detail: "Correct strokes only" },
        { label: "Gross WPM", value: formatNumber(data.grossWPM), tone: "text-sky-300", detail: "All typed strokes" },
        { label: "Accuracy", value: `${formatNumber(data.accuracy)}%`, tone: "text-amber-200", detail: `${data.correctWords || 0}/${data.totalWords || 0} words` },
        { label: "Time", value: formatTime(data.timeTaken), tone: "text-violet-200", detail: `${data.timeTaken || 0} seconds` }
    ];
    const breakdown = [
        { label: "Correct", value: data.correctWords || 0 },
        { label: "Errors", value: errors },
        { label: "Omissions", value: data.omissions || 0 },
        { label: "Additions", value: data.additions || 0 },
        { label: "Spelling", value: data.spelling || 0 },
        { label: "Backspace", value: data.backspaces || Number(localStorage.getItem("backspace")) || 0 }
    ];
    const comparison = data.comparison || [];

    const getWordStyle = (type) => {
        const styles = {
            correct: "font-medium text-emerald-300",
            omission: "rounded bg-sky-500/15 px-1 font-medium text-sky-200 line-through decoration-sky-200/80",
            addition: "rounded bg-amber-400/15 px-1 font-medium text-amber-100 underline decoration-amber-200/80 underline-offset-4",
            spelling: "rounded bg-red-500/15 px-1 font-medium text-red-200 underline decoration-red-200/80 decoration-wavy underline-offset-4",
        };

        return styles[type] || styles.spelling;
    };

    return (
        <div className="min-h-dvh bg-slate-950 text-white">
            <div ref={resultRef} className="mx-auto flex max-w-6xl flex-col gap-5 px-3 py-5 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Typing result</p>
                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your scorecard</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                            Net WPM is calculated from correct five-character strokes, so extra or misspelled text does not inflate the final speed.
                        </p>
                        {error && <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">{error}</p>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-500"
                        >
                            <BarChart3 size={16} /> Dashboard
                        </button>
                        <button
                            onClick={() => navigate(`/typing/${localStorage.getItem("testId")}`)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold transition hover:bg-emerald-500"
                        >
                            <RefreshCcw size={16} /> Retry
                        </button>
                        <button
                            onClick={downloadResult}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold transition hover:bg-slate-700"
                        >
                            <Download size={16} /> Download
                        </button>
                    </div>
                </header>

                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {scoreCards.map((item) => (
                        <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                            <p className={`mt-3 text-4xl font-bold ${item.tone}`}>{item.value}</p>
                            <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <h2 className="text-lg font-semibold">Scoring detail</h2>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            {breakdown.map((item) => (
                                <div key={item.label} className="rounded-md bg-slate-900/80 px-3 py-3">
                                    <p className="text-slate-400">{item.label}</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 rounded-md bg-slate-900/80 p-3 text-sm leading-6 text-slate-300">
                            <p>Typed strokes: <span className="font-semibold text-white">{typedCharacters}</span></p>
                            <p>Correct strokes: <span className="font-semibold text-white">{data.correctCharacters || 0}</span></p>
                            <p>Expected strokes: <span className="font-semibold text-white">{data.expectedCharacters || 0}</span></p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-semibold">Word comparison</h2>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300" />Correct</span>
                                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-300" />Mistake</span>
                                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-300" />Omission</span>
                                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-300" />Addition</span>
                            </div>
                        </div>

                        <div className="mt-4 max-h-[360px] overflow-y-auto rounded-md bg-slate-900/80 p-4">
                            {comparison.length ? (
                                <p className="text-base leading-8 text-slate-200">
                                    {comparison.map((item, index) => (
                                        <span
                                            key={`${item.type}-${index}`}
                                            className={getWordStyle(item.type)}
                                            title={item.expected && item.typed ? `${item.expected} -> ${item.typed}` : undefined}
                                        >
                                            {item.type === "omission" ? item.expected : item.word || item.typed}
                                            {index < comparison.length - 1 ? " " : ""}
                                        </span>
                                    ))}
                                </p>
                            ) : (
                                <p className="text-sm text-slate-400">No comparison data available.</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Result;
