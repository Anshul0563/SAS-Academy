import { useState } from "react";
import axios from "axios";
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
        try {
            setLoading(true);
            setMsg("");

            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!token || user?.role !== "admin") {
                setMsg("❌ Admin login required");
                setLoading(false);
                return;
            }

            //  AUDIO VALIDATION
            if (form.type === "dictation" && !audio) {
                setMsg("❌ Please upload audio file");
                setLoading(false);
                return;
            }

            const data = new FormData();

            //  ADD FORM DATA
            Object.keys(form).forEach((key) => {
                data.append(key, form[key]);
            });

            // ADD AUDIO
            if (form.type === "dictation") {
                data.append("audio", audio);
            }

            //  FIX: DON'T SET Content-Type manually
            await axios.post(
                "http://localhost:5000/api/tests",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMsg(" Test Created Successfully 🚀");

            // RESET
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
            }, 1000);

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
                    <div className="text-center mb-4 text-indigo-400">
                        {msg}
                    </div>
                )}

                {/* TYPE SWITCH */}
                <div className="flex gap-4 mb-6">

                    <button
                        onClick={() => setForm({ ...form, type: "transcription" })}
                        className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 
                        ${form.type === "transcription" ? "bg-indigo-500" : "bg-white/10"}`}
                    >
                        <FileText size={18} />
                        Transcription
                    </button>

                    <button
                        onClick={() => setForm({ ...form, type: "dictation" })}
                        className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 
                        ${form.type === "dictation" ? "bg-indigo-500" : "bg-white/10"}`}
                    >
                        <Headphones size={18} />
                        Dictation
                    </button>

                </div>

                {/* TITLE */}
                <input
                    name="title"
                    placeholder="Test Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 bg-white/10 rounded-lg outline-none"
                />

                {/* PASSAGE */}
                {form.type === "transcription" && (
                    <textarea
                        name="passage"
                        placeholder="Paste transcription passage..."
                        value={form.passage}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-white/10 rounded-lg h-32"
                    />
                )}

                {/* AUDIO */}
                {form.type === "dictation" && (
                    <label className="flex items-center gap-2 cursor-pointer bg-white/10 p-3 rounded-lg mb-4 hover:bg-white/20">
                        <UploadCloud size={18} />
                        {audio ? audio.name : "Upload Audio"}
                        <input
                            type="file"
                            accept="audio/*"
                            hidden
                            onChange={(e) => setAudio(e.target.files[0])}
                        />
                    </label>
                )}

                {/* TRANSCRIPTION OPTIONS */}
                {form.type === "transcription" && (
                    <div className="grid grid-cols-2 gap-4">

                        <input
                            name="duration"
                            placeholder="Duration (min)"
                            value={form.duration}
                            onChange={handleChange}
                            className="p-3 bg-white/10 rounded-lg"
                        />

                        <select
                            name="difficulty"
                            value={form.difficulty}
                            onChange={handleChange}
                            className="p-3 bg-white/10 rounded-lg"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                    </div>
                )}

                {/* CATEGORY */}
                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-3 mt-4 bg-white/10 rounded-lg"
                />

                {/* TAGS */}
                <input
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={form.tags}
                    onChange={handleChange}
                    className="w-full p-3 mt-4 bg-white/10 rounded-lg"
                />

                {/* SUBMIT */}
                <button
                    onClick={handleSubmit}
                    className="w-full mt-6 bg-indigo-500 p-3 rounded-lg font-semibold"
                >
                    {loading ? "Creating..." : "Create Test"}
                </button>

            </motion.div>
        </div>
    );
}


export default AddTest;