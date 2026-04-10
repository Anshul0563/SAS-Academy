import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate, useLocation } from "react-router-dom";

function AdminTests() {

    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true); // 🔥 added
    const [error, setError] = useState(""); // 🔥 added

    const navigate = useNavigate();
    const location = useLocation();

    const queryType = new URLSearchParams(location.search).get("type");
    const [type, setType] = useState(queryType || "transcription");

    const fetchTests = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const res = await axios.get("http://localhost:5000/api/tests", {
                headers: {
                    Authorization: "Bearer " + token
                },
                params: { t: Date.now() }
            });

            console.log("TESTS:", res.data); // 🔥 debug

            setTests(Array.isArray(res.data) ? res.data : []);

        } catch (err) {
            console.error("Fetch Error:", err);
            setError("❌ Failed to load tests");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const deleteTest = async (id) => {
        if (!window.confirm("Delete this test?")) return;

        await axios.delete(`http://localhost:5000/api/tests/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        fetchTests();
    };

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    useEffect(() => {
        if (queryType) {
            setType(queryType);
        }
    }, [queryType]);

    const filteredTests = tests.filter(
        t => t.type?.toLowerCase() === type
    );

    return (
        <AdminLayout>

            <h1 className="text-2xl mb-6 font-bold text-white">Manage Tests</h1>

            {/* 🔥 LOADING */}
            {loading && (
                <p className="text-gray-400">Loading tests...</p>
            )}

            {/* 🔥 ERROR */}
            {error && (
                <p className="text-red-400">{error}</p>
            )}

            {/* 🔥 TOGGLE */}
            {!loading && (
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => {
                            setType("transcription");
                            navigate("/admin/tests?type=transcription");
                        }}
                        className={`px-4 py-2 rounded ${type === "transcription" ? "bg-indigo-500" : "bg-white/10"
                            }`}
                    >
                        📝 Transcription
                    </button>

                    <button
                        onClick={() => {
                            setType("dictation");
                            navigate("/admin/tests?type=dictation");
                        }}
                        className={`px-4 py-2 rounded ${type === "dictation" ? "bg-indigo-500" : "bg-white/10"
                            }`}
                    >
                        🎤 Dictation
                    </button>
                </div>
            )}

            {/* 🔥 LIST */}
            {!loading && (
                filteredTests.length === 0 ? (
                    <p className="text-gray-400">No tests found</p>
                ) : (
                    filteredTests.map((test) => (
                        <div
                            key={test._id}
                            className="bg-[#1e293b] p-4 mb-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <h2 className="font-semibold">{test.title}</h2>
                                <p className="text-sm text-gray-400">
                                    ⏱ {test.duration} min
                                </p>
                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => navigate(`/admin/edit-test/${test._id}`)}
                                    className="bg-yellow-500 px-3 py-1 rounded text-sm"
                                >
                                    Update
                                </button>

                                <button
                                    onClick={() => deleteTest(test._id)}
                                    className="bg-red-500 px-3 py-1 rounded text-sm"
                                >
                                    Delete
                                </button>

                            </div>
                        </div>
                    ))
                )
            )}

        </AdminLayout>
    );
}

export default AdminTests;