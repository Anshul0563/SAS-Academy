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
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (!form.email || !form.password) {
            return setError("Please fill all fields");
        }
        const email = form.email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return setError("Please enter a valid email");
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "/api/auth/admin-login",
                form,
                {
                    timeout: 10000
                }
            );

            // SEPARATE ADMIN STORAGE
            localStorage.setItem("adminToken", res.data.token);
            localStorage.setItem("adminUser", JSON.stringify(res.data.user));
            
            // Clear user token to prevent conflicts
            localStorage.removeItem("userToken");
            localStorage.removeItem("user");

            navigate("/admin");

        } catch (err) {
            console.error("Admin login error:", err);
            
            if (!err.response) {
                setError("Network error - Server unavailable");
            } else if (err.response.status >= 400 && err.response.status < 500) {
                setError(err.response.data?.message || "Invalid credentials");
            } else {
                setError("Server error - Please try again later");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] px-3 py-5 text-white">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
            >

                <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
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
                    value={form.email}
                    className="w-full p-3 mb-4 bg-transparent border border-white/20 rounded-lg outline-none focus:border-indigo-500 transition"
                    onChange={handleChange}
                />

                {/* PASSWORD */}
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
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
