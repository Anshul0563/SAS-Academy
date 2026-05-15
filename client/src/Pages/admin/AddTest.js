import { useState } from "react";
import API from "../../api/axios";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddTest() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        type: "transcription",
        passage: "",
        duration: "",
        difficulty: "medium",
        category: "",
        tags: ""
    });

    const [audio, setAudio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const title = form.title.trim();
        const passage = form.passage.trim();

        if (!title) {
            setMsg("Test title is required");
            return;
        }

        if (form.type === "transcription" && !passage) {
            setMsg("Transcription passage is required");
            return;
        }

        if (form.type === "dictation" && !audio) {
            setMsg("Please upload audio file");
            return;
        }

        try {
            setLoading(true);
            setMsg("");

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setMsg("Login required");
                setLoading(false);
                return;
            }

            const data = new FormData();

            // ADD FORM DATA
            data.append("title", title);
            data.append("type", form.type);
            data.append("duration", form.duration);
            data.append("difficulty", form.difficulty);
            data.append("category", form.category.trim());
            data.append("tags", form.tags.trim());
            data.append("passage", form.type === "transcription" ? passage : "");

            // ADD AUDIO
            if (form.type === "dictation") {
                data.append("audio", audio);
            }

            await API.post(
                "/tests",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMsg("Test created successfully");

            // RESET FORM
            setForm({
                title: "",
                type: "transcription",
                passage: "",
                duration: "",
                difficulty: "medium",
                category: "",
                tags: ""
            });

            setAudio(null);

            // REDIRECT
            setTimeout(() => {
                navigate("/admin/tests");
            }, 1500);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err);
            setMsg(err.response?.data?.message || "Error creating test");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8"
            >


                <h2 className="mb-5 text-center text-2xl font-bold sm:mb-6 sm:text-3xl">
                    Create New Test
                </h2>

                {msg && (
                    <div className="text-center mb-4 p-3 rounded-lg bg-indigo-500/20 text-indigo-300">
                        {msg}
                    </div>
                )}

                {/* TYPE SWITCH */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4">

                    <button
                        onClick={() => setForm({ ...form, type: "transcription" })}
                        className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium sm:text-base
                        ${form.type === "transcription" ? "bg-indigo-500 text-white shadow-lg" : "bg-white/10 hover:bg-white/20 text-gray-300"} transition-all`}
                    >
                        <FileText size={18} />
                        Transcription
                    </button>

                    <button
                        onClick={() => setForm({ ...form, type: "dictation" })}
                        className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium sm:text-base
                        ${form.type === "dictation" ? "bg-indigo-500 text-white shadow-lg" : "bg-white/10 hover:bg-white/20 text-gray-300"} transition-all`}
                    >
                        <Headphones size={18} />
                        Dictation
                    </button>

                </div>

                {/* FORM FIELDS */}
                <div className="space-y-4">

                    <input
                        name="title"
                        placeholder="Test Title *"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:border-indigo-400 focus:outline-none transition"
                        required
                    />

                    {form.type === "transcription" && (
                        <textarea
                            name="passage"
                            placeholder="Paste transcription passage here..."
                            value={form.passage}
                            onChange={handleChange}
                            rows={6}
                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:border-indigo-400 focus:outline-none transition resize-vertical"
                            required
                        />
                    )}

                    {form.type === "dictation" && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Audio File *
                            </label>
                            <label className="flex min-h-[80px] cursor-pointer flex-col gap-3 rounded-xl border-2 border-dashed border-white/30 p-4 transition-all hover:border-indigo-400 hover:bg-white/5 sm:flex-row sm:items-center">
                                <UploadCloud size={24} className="text-indigo-400 flex-shrink-0" />
                                <div>
                                    {audio ? (
                                        <div>
                                            <p className="font-medium">{audio.name}</p>
                                            <p className="text-sm text-gray-400">({(audio.size / 1024 / 1024).toFixed(1)} MB)</p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">Upload dictation audio (.mp3, .wav, .m4a)</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    hidden
                                    onChange={(e) => setAudio(e.target.files[0])}
                                />
                            </label>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            name="duration"
                            type="number"
                            placeholder="Duration (minutes)"
                            value={form.duration}
                            onChange={handleChange}
                            className="p-4 bg-white/10 border border-white/20 rounded-xl focus:border-indigo-400"
                        />
                        <select
                            name="difficulty"
                            value={form.difficulty}
                            onChange={handleChange}
                            className="p-4 bg-white/10 border border-white/20 rounded-xl focus:border-indigo-400"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <input
                        name="category"
                        placeholder="Category (e.g. English, Practice)"
                        value={form.category}
                        onChange={handleChange}
                        className="p-4 bg-white/10 border border-white/20 rounded-xl focus:border-indigo-400"
                    />

                    <input
                        name="tags"
                        placeholder="Tags (comma separated)"
                        value={form.tags}
                        onChange={handleChange}
                        className="p-4 bg-white/10 border border-white/20 rounded-xl focus:border-indigo-400"
                    />

                </div>

                {/* CREATE BUTTON */}
                <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 text-base font-semibold text-white shadow-2xl transition-all hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            Creating Test...
                        </div>
                    ) : (
                        "Create Test"
                    )}
                </motion.button>

                </motion.div>
        </div>
    );
}

export default AddTest;
