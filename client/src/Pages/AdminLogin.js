import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { storeAdminAuth } from "../utils/authStorage";

function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({

        email: "",
        password: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

            const res = await API.post(
                "/auth/admin-login",
                { email: email, password: form.password },
                { timeout: 10000 }
            );

            if (!res.data?.token || res.data?.user?.role !== "admin") {
                setError("Admin login response is invalid");
                return;
            }

            storeAdminAuth({
                token: res.data.token,
                user: res.data.user,
            });

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
        <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] px-4 py-8 text-white">
            {/* Background glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />

            <div className="mx-auto flex w-full max-w-6xl items-stretch justify-center">
                <div className="flex w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl md:flex-row">
                    {/* LEFT PANEL */}
                    <div className="hidden w-full bg-gradient-to-br from-indigo-500/60 via-purple-500/50 to-pink-500/40 p-8 md:block md:w-1/2">
                        <div className="flex h-full flex-col justify-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                    <span className="text-2xl">🔐</span>
                                </div>
                                <div>
                                    <div className="text-xl font-semibold tracking-wide">SAS Academy</div>
                                    <div className="text-sm text-white/80">Admin Console</div>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold leading-tight">
                                Manage students, monitor results,
                                <span className="text-white/90"> stay in control.</span>
                            </h1>
                            <p className="text-white/85">
                                Clean, fast and secure admin access — built to match the overall SAS Academy website UI.
                            </p>

                            <div className="mt-2 space-y-2 text-sm text-white/90">
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-200">⚡</span>
                                    <span>Instant auth feedback</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-200">🛡️</span>
                                    <span>Role-checked admin login</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-200">✨</span>
                                    <span>Glass UI + smooth interactions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL (FORM) */}
                    <div className="w-full p-5 sm:p-8 md:w-1/2">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-4 md:mb-6">
                                <h2 className="text-2xl font-bold sm:text-3xl">Admin Login</h2>
                                <p className="mt-1 text-sm text-white/70">Enter your admin credentials to continue.</p>
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    aria-live="polite"
                                    className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                                >
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* EMAIL */}
                                <div className="relative">
                                    <input
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder=" "
                                        value={form.email}
                                        onChange={handleChange}
                                        className="peer w-full rounded-xl border border-white/15 bg-white/5 px-4 pb-2 pt-5 text-white outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <label
                                        className="absolute left-4 top-3 origin-left -translate-y-3 scale-75 transform text-xs text-white/60 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-indigo-200"
                                    >
                                        Email
                                    </label>
                                </div>

                                {/* PASSWORD */}
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPass ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder=" "
                                        value={form.password}
                                        onChange={handleChange}
                                        className="peer w-full rounded-xl border border-white/15 bg-white/5 px-4 pb-2 pt-5 text-white outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <label
                                        className="absolute left-4 top-3 origin-left -translate-y-3 scale-75 transform text-xs text-white/60 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-indigo-200"
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowPass((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white transition"
                                    >
                                        {showPass ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2 justify-center">
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            <span>Logging in...</span>
                                        </span>
                                    ) : (
                                        "Login"
                                    )}
                                </button>

                                <div className="pt-1">
                                    <p
                                        onClick={() => navigate("/")}
                                        className="cursor-pointer text-center text-sm text-white/60 hover:text-white transition"
                                    >
                                        Back to User Login
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;

