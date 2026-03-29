import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            return setError("All fields are required");
        }

        try {
            setLoading(true);
            setError("");

            const res = await axios.post(
                "http://localhost:5000/api/auth/admin-login",
                form
            );

            // 🔥 Admin check
            if (res.data.user.role !== "admin") {
                return setError("Access denied: Not an admin");
            }

            // ✅ Save
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/admin");

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
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
                    Admin Login 🔐
                </h2>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-500/20 text-red-300 p-2 mb-4 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                {/* EMAIL */}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 bg-transparent border border-white/20 rounded-lg outline-none focus:border-indigo-500 transition"
                    onChange={handleChange}
                />

                {/* PASSWORD */}
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-4 bg-transparent border border-white/20 rounded-lg outline-none focus:border-indigo-500 transition"
                    onChange={handleChange}
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg font-semibold flex justify-center items-center hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Login"
                    )}
                </button>

                {/* BACK TO USER LOGIN */}
                <p
                    onClick={() => navigate("/")}
                    className="text-sm mt-2 text-center cursor-pointer text-gray-400 hover:text-white"
                >
                    Back to User Login
                </p>

            </form>
        </div>
    );
}

export default AdminLogin;