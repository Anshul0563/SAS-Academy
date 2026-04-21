import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!form.name || !form.email || !form.password) {
            return setError("All fields are required");
        }

        try {
            setLoading(true);
            setError("");

            console.log("Sending data:", form); // DEBUG

            const res = await axios.post(
                "/api/auth/admin-register",
                form,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Response:", res.data); // DEBUG

            navigate("/admin-login");

        } catch (err) {
            console.log("FULL ERROR:", err); // DEBUG

            // Better error handling
            if (err.response) {
                setError(err.response.data.message || "Server Error");
            } else if (err.request) {
                setError("Server not responding (check backend)");
            } else {
                setError("Request error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">

            <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-[380px] border border-white/10 shadow-2xl"
            >

                <h2 className="text-3xl font-bold mb-6 text-center">
                    Admin Register 🔐
                </h2>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-500/20 text-red-300 p-2 mb-4 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                {/* NAME */}
                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 bg-transparent border border-white/20 rounded-lg outline-none focus:border-indigo-500"
                />

                {/* EMAIL */}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 bg-transparent border border-white/20 rounded-lg outline-none focus:border-indigo-500"
                />

                {/* PASSWORD */}
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 bg-transparent border border-white/20 rounded-lg outline-none focus:border-indigo-500"
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg font-semibold flex justify-center items-center"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Register"
                    )}
                </button>

                {/* LOGIN LINK */}
                <p
                    onClick={() => navigate("/admin-login")}
                    className="text-sm mt-5 text-center cursor-pointer text-gray-400 hover:text-white"
                >
                    Already admin? Login
                </p>

            </form>
        </div>
    );
}

export default AdminRegister;
