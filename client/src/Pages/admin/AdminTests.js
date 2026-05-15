import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, Edit3, FileText, Headphones, Plus, Search, Trash2 } from "lucide-react";

const getDefaultDuration = (test) => (test?.type === "dictation" ? 10 : 50);
const getDisplayDuration = (test) => {
    const duration = Number(test?.duration);
    return !duration || duration === 5 ? getDefaultDuration(test) : duration;
};

function AdminTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const typeFilter = searchParams.get("type") || "all";

    const fetchTests = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("adminToken");
            const res = await API.get("/tests", {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });

            setTests(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load tests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const filteredTests = useMemo(() => {
        return tests.filter((test) => {
            const matchesType = typeFilter === "all" || test.type === typeFilter;
            const query = search.trim().toLowerCase();
            const matchesSearch = !query || [
                test.title,
                test.category,
                ...(test.tags || [])
            ].some((value) => String(value || "").toLowerCase().includes(query));

            return matchesType && matchesSearch;
        });
    }, [tests, typeFilter, search]);

    const deleteTest = async (id) => {
        const ok = window.confirm("Delete this test permanently?");
        if (!ok) return;

        try {
            const token = localStorage.getItem("adminToken");
            await API.delete(`/tests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTests((current) => current.filter((test) => test._id !== id));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to delete test");
        }
    };

    const setTypeFilter = (type) => {
        if (type === "all") {
            setSearchParams({});
        } else {
            setSearchParams({ type });
        }
    };

    return (
        <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">Tests</h1>
                    <p className="text-slate-400">Create, review, and manage all academy tests.</p>
                </div>

                <button
                    onClick={() => navigate("/admin/add-test")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 sm:w-auto"
                >
                    <Plus size={18} />
                    Create Test
                </button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-3 sm:p-4 md:grid-cols-[1fr_auto]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by title, category, or tag"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="flex overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/70 p-1">
                    {["all", "transcription", "dictation"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`shrink-0 rounded-lg px-3 py-2 text-sm capitalize transition ${
                                typeFilter === type ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex h-72 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                </div>
            ) : filteredTests.length === 0 ? (
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-8 text-center text-slate-400 sm:p-12">
                    No tests found.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTests.map((test) => {
                        const Icon = test.type === "dictation" ? Headphones : FileText;

                        return (
                            <div
                                key={test._id}
                                className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-xl transition hover:border-indigo-500/50 sm:p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
                                            <Icon size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="truncate text-lg font-semibold text-white">{test.title}</h2>
                                            <p className="mt-1 text-sm capitalize text-slate-400">{test.type}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full border border-slate-600 px-2 py-1 text-xs capitalize text-slate-300">
                                        {test.difficulty || "medium"}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2">
                                    <div className="flex items-center gap-2 rounded-xl bg-slate-800/70 p-3">
                                        <Clock size={16} className="text-slate-400" />
                                        {getDisplayDuration(test)} min
                                    </div>
                                    <div className="rounded-xl bg-slate-800/70 p-3 truncate">
                                        {test.category || "General"}
                                    </div>
                                </div>

                                {test.tags?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {test.tags.slice(0, 4).map((tag) => (
                                            <span key={tag} className="rounded-md bg-white/10 px-2 py-1 text-xs text-slate-300">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/edit-test/${test._id}`)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTest(test._id)}
                                        className="flex items-center justify-center rounded-xl border border-red-500/30 px-3 py-2 text-red-300 hover:bg-red-500/10"
                                        aria-label={`Delete ${test.title}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AdminTests;
