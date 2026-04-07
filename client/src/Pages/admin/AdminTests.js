import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";

function AdminTests() {

    const [tests, setTests] = useState([]);
    const [type, setType] = useState("transcription"); // 🔥 toggle
    const navigate = useNavigate();

    const fetchTests = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/tests", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setTests(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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
    }, []);

    // 🔥 FILTER
    const filteredTests = tests.filter(t => t.type === type);

    return (
        <AdminLayout>

            {/* HEADER */}
            <h1 className="text-2xl mb-6 font-bold text-white">Manage Tests</h1>

            {/* 🔥 TOGGLE BUTTONS */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setType("transcription")}
                    className={`px-4 py-2 rounded ${type === "transcription"
                            ? "bg-indigo-500"
                            : "bg-white/10"
                        }`}
                >
                    📝 Transcription
                </button>

                <button
                    onClick={() => setType("dictation")}
                    className={`px-4 py-2 rounded ${type === "dictation"
                            ? "bg-indigo-500"
                            : "bg-white/10"
                        }`}
                >
                    🎤 Dictation
                </button>
            </div>

            {/* LIST */}
            {filteredTests.length === 0 ? (
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

                        {/* ACTIONS */}
                        <div className="flex gap-3">

                            {/* UPDATE */}
                            <button
                                onClick={() => navigate(`/admin/edit-test/${test._id}`)}
                                className="bg-yellow-500 px-3 py-1 rounded text-sm hover:bg-yellow-600"
                            >
                                Update
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={() => deleteTest(test._id)}
                                className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))
            )}

        </AdminLayout>
    );
}

export default AdminTests;