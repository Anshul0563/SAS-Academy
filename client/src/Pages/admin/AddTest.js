import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

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
        try {
            setLoading(true);
            setMsg("");

            const token = localStorage.getItem("token");

            if (!token) {
                setMsg("❌ Login required");
                setLoading(false);
                return;
            }

            // AUDIO VALIDATION
            if (form.type === "dictation" && !audio) {
                setMsg("❌ Please upload audio file");
                setLoading(false);
                return;
            }

            const data = new FormData();

            // ADD FORM DATA
            Object.keys(form).forEach((key) => {
                data.append(key, form[key]);
            });

            // ADD AUDIO
            if (form.type === "dictation") {
                data.append("audio", audio);
            }

            await axios.post(
                "/api/tests",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMsg("✅ Test Created Successfully!");

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
                navigate("/admin");
            }, 1500);

        } catch (err) {
            console.log("ERROR:", err);
            setMsg(err.response?.data?.message || "❌ Error creating test");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
            >


                <h2 className="text-3xl font-bold text-center mb-6">
                    🚀 Create New Test
                </h2>

                {msg && (
                    <div className="text-center mb-4 p-3 rounded-lg bg-indigo-500/20 text-indigo-300">
                        {msg}
                    </div>
                )}

                {/* TYPE SWITCH */}
                <div className="flex gap-4 mb-6">

                    <button
                        onClick={() => setForm({ ...form, type: "transcription" })}
                        className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 font-medium
                        ${form.type === "transcription" ? "bg-indigo-500 text-white shadow-lg" : "bg-white/10 hover:bg-white/20 text-gray-300"} transition-all`}
                    >
                        <FileText size={18} />
                        Transcription
                    </button>

                    <button
                        onClick={() => setForm({ ...form, type: "dictation" })}
                        className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 font-medium
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
                            <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-dashed border-white/30 rounded-xl hover:border-indigo-400 hover:bg-white/5 transition-all min-h-[80px]">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            Creating Test...
                        </div>
                    ) : (
                        "🚀 Create Test"
                    )}
                </motion.button>

                </motion.div>
        </div>
    );
}

export default AddTest;
