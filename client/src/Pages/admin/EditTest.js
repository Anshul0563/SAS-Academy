import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminAuthToken } from "../../utils/authStorage";

function EditTest() {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await API.get(`/tests/${id}`);
                setForm({
                    title: res.data.title || "",
                    type: res.data.type || "transcription",
                    passage: res.data.passage || "",
                    duration: res.data.duration || "",
                    difficulty: res.data.difficulty || "medium",
                    category: res.data.category || "",
                    tags: Array.isArray(res.data.tags) ? res.data.tags.join(", ") : ""
                });
            } catch (err) {
                console.error(err);
                setMessage("Failed to load test");
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            setMessage("");
            const token = getAdminAuthToken();
            if (!token) {
                setMessage("Admin login required. Please login again.");
                navigate("/admin-login");
                return;
            }

            const data = new FormData();

            Object.entries(form).forEach(([key, value]) => data.append(key, value));
            if (form.type === "dictation" && audio) {
                data.append("audio", audio);
            }

            await API.put(`/tests/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate("/admin/tests");
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-72 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Edit Test</h1>
                <p className="text-slate-400">Update test content, timing, category, and tags.</p>
            </div>

            {message && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    {message}
                </div>
            )}

            <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white outline-none focus:border-indigo-500"
                />

                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white outline-none focus:border-indigo-500"
                >
                    <option value="transcription">Transcription</option>
                    <option value="dictation">Dictation</option>
                </select>

                {form.type === "transcription" ? (
                    <textarea
                        name="passage"
                        value={form.passage}
                        onChange={handleChange}
                        placeholder="Passage"
                        className="h-44 w-full rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white outline-none focus:border-indigo-500"
                    />
                ) : (
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(event) => setAudio(event.target.files[0])}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white"
                    />
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        name="duration"
                        type="number"
                        value={form.duration}
                        onChange={handleChange}
                        placeholder="Duration"
                        className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white outline-none focus:border-indigo-500"
                    />
                    <select
                        name="difficulty"
                        value={form.difficulty}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white outline-none focus:border-indigo-500"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white outline-none focus:border-indigo-500"
                />

                <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Tags, comma separated"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white outline-none focus:border-indigo-500"
                />

                <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

export default EditTest;
