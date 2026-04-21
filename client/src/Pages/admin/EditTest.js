import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

function EditTest() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        passage: "",
        duration: ""
    });

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem("token");
                
                const res = await axios.get(`/api/tests/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setForm({
                    title: res.data.title || "",
                    passage: res.data.passage || "",
                    duration: res.data.duration || ""
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchTest();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            
            await axios.put(
                `/api/tests/${id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("✅ Updated Successfully");
            navigate("/admin/tests");

        } catch (err) {
            console.log(err);
            alert("❌ Update Failed");
        }
    };

    return (
        <AdminLayout>

            <h1 className="text-2xl mb-6 font-bold">Edit Test</h1>

            <div className="bg-[#1e293b] p-6 rounded space-y-4">

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full p-3 bg-[#0f172a] rounded"
                />

                <textarea
                    name="passage"
                    value={form.passage}
                    onChange={handleChange}
                    placeholder="Passage"
                    className="w-full p-3 bg-[#0f172a] rounded h-32"
                />

                <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Duration"
                    className="w-full p-3 bg-[#0f172a] rounded"
                />

                <button
                    onClick={handleUpdate}
                    className="bg-indigo-500 px-6 py-2 rounded"
                >
                    Update Test
                </button>

            </div>

        </AdminLayout>
    );
}

export default EditTest;
