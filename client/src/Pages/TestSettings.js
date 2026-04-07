import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

function TestSettings() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [settings, setSettings] = useState({
        backspace: true,
        spelling: "half",
        caps: "none",
        punctuation: "none",
        fontSize: 20,
        time: 5,
        examType: "custom"
    });

    const handleStart = () => {
        localStorage.setItem("testSettings", JSON.stringify(settings));
        navigate(`/typing/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 lg:px-10 py-6">

            {/* HEADER */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                ⚙ Test Configuration
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#020617]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl"
                >

                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-indigo-300">
                        Individual Settings
                    </h3>

                    {/* BACKSPACE */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm sm:text-base">Backspace</span>
                        <button
                            onClick={() =>
                                setSettings({ ...settings, backspace: !settings.backspace })
                            }
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm transition ${settings.backspace
                                ? "bg-green-500/80"
                                : "bg-red-500/80"
                                }`}
                        >
                            {settings.backspace ? "Enabled" : "Disabled"}
                        </button>
                    </div>

                    {/* SELECTS */}
                    {[
                        { label: "Spelling Mistakes", key: "spelling", options: ["full", "half"] },
                        { label: "Capitalization", key: "caps", options: ["none", "full"] },
                        { label: "Punctuation", key: "punctuation", options: ["none", "full"] }
                    ].map((item, i) => (
                        <div key={i} className="mb-4">
                            <label className="text-gray-300 text-sm">{item.label}</label>
                            <select
                                value={settings[item.key]}
                                onChange={(e) =>
                                    setSettings({ ...settings, [item.key]: e.target.value })
                                }
                                className="w-full mt-1 p-2 text-sm bg-[#020617] border border-white/10 rounded-lg"
                            >
                                {item.options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {/* FONT SIZE */}
                    <div className="mt-5">
                        <label className="text-gray-300 text-sm">
                            Font Size: {settings.fontSize}px
                        </label>
                        <input
                            type="range"
                            min="16"
                            max="30"
                            value={settings.fontSize}
                            onChange={(e) =>
                                setSettings({ ...settings, fontSize: Number(e.target.value) })
                            }
                            className="w-full mt-2 accent-indigo-500"
                        />
                    </div>

                </motion.div>

                {/* RIGHT PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#020617]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl"
                >

                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-purple-300">
                        Exam Settings
                    </h3>

                    {/* EXAM TYPE */}
                    <div className="mb-4">
                        <label className="text-gray-300 text-sm">Exam Type</label>
                        <select
                            value={settings.examType}
                            onChange={(e) =>
                                setSettings({ ...settings, examType: e.target.value })
                            }
                            className="w-full mt-1 p-2 text-sm bg-[#020617] border border-white/10 rounded-lg"
                        >
                            <option value="custom">Custom</option>
                            <option value="ssc">SSC Mode</option>
                        </select>
                    </div>

                    {/* TIMER */}
                    <div className="mb-5">
                        <label className="text-gray-300 text-sm">
                            Timer: {settings.time} min
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="60"
                            value={settings.time}
                            onChange={(e) =>
                                setSettings({ ...settings, time: Number(e.target.value) })
                            }
                            className="w-full mt-2 accent-purple-500"
                        />
                    </div>

                    {/* PREVIEW */}
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-gray-300">
                        <p>⚡ Backspace: {settings.backspace ? "Allowed" : "Blocked"}</p>
                        <p>🧠 Mode: {settings.examType}</p>
                        <p>⏱ Time: {settings.time} min</p>
                    </div>

                </motion.div>

            </div>

            {/* START BUTTON */}
            <div className="flex justify-center mt-8 sm:mt-10">
                <button
                    onClick={handleStart}
                    className="w-full sm:w-[60%] lg:w-[40%] bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl text-base sm:text-lg font-semibold hover:scale-105 transition shadow-lg"
                >
                    🚀 Start Test
                </button>
            </div>

        </div>
    );
}

export default TestSettings;