import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

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
            const res = await axios.get(`http://localhost:5000/api/tests/${id}`);
            setForm({
                title: res.data.title || "",
                passage: res.data.passage || "",
                duration: res.data.duration || ""
            });
        };

        fetchTest();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/tests/${id}`,
                form,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
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