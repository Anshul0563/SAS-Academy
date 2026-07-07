import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    KeyRound,
    Building2,
    Sparkles,
    LayoutDashboard,
    Users,
    BadgeCheck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Cpu,
    AlertTriangle,
} from "lucide-react";

import API from "../api/axios";
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

    const floatingTitleId = "admin-login-title";

    return (
        <div className="relative min-h-dvh overflow-hidden bg-[#020617] px-4 py-10 text-white">
            {/* Animated mesh */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
                <div className="absolute -right-24 top-28 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
                <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

                <div className="absolute inset-0 opacity-60">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.30),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(34,211,238,0.18),transparent_50%)]" />
                    <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)] bg-[linear-gradient(120deg,rgba(99,102,241,0.10),rgba(139,92,246,0.10),rgba(34,211,238,0.08))]" />
                </div>

                {/* Light particles */}
                <div className="absolute inset-0 opacity-50">
                    <div className="particle absolute left-[10%] top-[20%] h-1.5 w-1.5 rounded-full bg-white/60" />
                    <div className="particle absolute left-[28%] top-[70%] h-1 w-1 rounded-full bg-indigo-200/70" />
                    <div className="particle absolute left-[50%] top-[35%] h-1.5 w-1.5 rounded-full bg-purple-200/60" />
                    <div className="particle absolute left-[70%] top-[25%] h-1 w-1 rounded-full bg-cyan-200/70" />
                    <div className="particle absolute left-[85%] top-[65%] h-1.5 w-1.5 rounded-full bg-white/50" />
                </div>

                {/* Mouse glow (CSS only) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(99,102,241,0.18),transparent_35%)]" />
            </div>

            {/* CSS for particles + motion */}
            <style>{`
                .particle{animation: drift 7s ease-in-out infinite;}
                .particle:nth-child(1){animation-duration: 8s}
                .particle:nth-child(2){animation-duration: 7.5s}
                .particle:nth-child(3){animation-duration: 9s}
                .particle:nth-child(4){animation-duration: 7s}
                .particle:nth-child(5){animation-duration: 8.5s}
                @keyframes drift{
                    0%{transform: translate3d(0,0,0); opacity:.6}
                    50%{transform: translate3d(0,-16px,0); opacity:1}
                    100%{transform: translate3d(0,0,0); opacity:.6}
                }
            `}</style>

            <div className="mx-auto flex w-full max-w-6xl items-stretch justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative flex w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                >
                    {/* LEFT PANEL */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative hidden w-full md:block md:w-1/2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/60 via-purple-500/50 to-pink-500/35" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.20),transparent_45%)]" />

                        <div className="relative flex h-full flex-col justify-center gap-6 p-10">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.png"
                                    alt="SAS Academy"
                                    className="h-11 w-11 rounded-2xl border border-white/20 bg-white/10 object-cover p-2"
                                />
                                <div>
                                    <div className="text-xl font-semibold tracking-wide">SAS Academy</div>
                                    <div className="text-sm text-white/80">Admin Dashboard</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h1 id={floatingTitleId} className="text-3xl font-bold leading-tight">
                                    Admin access, delivered with confidence.
                                </h1>
                                <p className="text-white/80">
                                    Secure, fast and role-checked authentication designed for enterprise-grade admin operations.
                                </p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
                                className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <LayoutDashboard size={18} className="text-indigo-100" />
                                        <div className="text-sm font-semibold">Dashboard Preview</div>
                                    </div>
                                    <div className="rounded-full bg-black/20 px-3 py-1 text-[11px] text-white/75">
                                        Live metrics
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    <div className="rounded-2xl bg-black/20 p-3">
                                        <div className="text-[11px] text-white/70">Students</div>
                                        <div className="mt-1 text-xl font-bold">1,284</div>
                                    </div>
                                    <div className="rounded-2xl bg-black/20 p-3">
                                        <div className="text-[11px] text-white/70">Results</div>
                                        <div className="mt-1 text-xl font-bold">97%</div>
                                    </div>
                                    <div className="rounded-2xl bg-black/20 p-3">
                                        <div className="text-[11px] text-white/70">Uptime</div>
                                        <div className="mt-1 text-xl font-bold">99.9%</div>
                                    </div>
                                </div>

                                <div className="mt-3 rounded-2xl bg-black/15 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] text-white/70">Secure session</div>
                                        <BadgeCheck size={14} className="text-cyan-200" />
                                    </div>
                                    <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                                        <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" />
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="group rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12">
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} className="text-indigo-100" />
                                        <div className="font-semibold text-sm">Security</div>
                                    </div>
                                    <div className="mt-2 text-xs text-white/75">Role-checked admin auth</div>
                                </div>

                                <div className="group rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-purple-100" />
                                        <div className="font-semibold text-sm">Operations</div>
                                    </div>
                                    <div className="mt-2 text-xs text-white/75">Manage students & results</div>
                                </div>

                                <div className="group rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={16} className="text-cyan-100" />
                                        <div className="font-semibold text-sm">Performance</div>
                                    </div>
                                    <div className="mt-2 text-xs text-white/75">Fast, clean feedback loops</div>
                                </div>
                            </div>

                            <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
                                <Sparkles size={14} />
                                <span>Glass UI + premium animations</span>
                            </div>

                            {/* Floating gradient blobs */}
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute -left-10 top-16 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl"
                                animate={{ y: [0, -14, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl"
                                animate={{ y: [0, 18, 0] }}
                                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL */}
                    <div className="w-full p-6 sm:p-8 md:w-1/2">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-4 md:mb-6">
                                <h2 className="text-2xl font-bold sm:text-3xl">Welcome back</h2>
                                <p className="mt-1 text-sm text-white/70">Sign in to your Admin Console.</p>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        role="alert"
                                        aria-live="polite"
                                        className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start gap-2"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        whileShake={{ x: [0, -6, 6, -4, 4, 0] }}
                                    >
                                        <AlertTriangle size={16} className="mt-0.5" />
                                        <motion.span key={error}>{error}</motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* EMAIL */}
                                <div className="relative">
                                    <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55" />
                                    <input
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder=" "
                                        value={form.email}
                                        onChange={handleChange}
                                        className="peer w-full rounded-3xl border border-white/15 bg-white/5 pl-11 pr-4 pb-2 pt-5 text-white outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <label className="absolute left-11 top-3 origin-left -translate-y-3 scale-75 transform text-xs text-white/60 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-indigo-200">
                                        Email
                                    </label>
                                </div>

                                {/* PASSWORD */}
                                <div className="relative">
                                    <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55" />
                                    <input
                                        name="password"
                                        type={showPass ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder=" "
                                        value={form.password}
                                        onChange={handleChange}
                                        className="peer w-full rounded-3xl border border-white/15 bg-white/5 pl-11 pr-24 pb-2 pt-5 text-white outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <label className="absolute left-11 top-3 origin-left -translate-y-3 scale-75 transform text-xs text-white/60 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-indigo-200">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowPass((v) => !v)}
                                        aria-label={showPass ? "Hide password" : "Show password"}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-2 text-white/70 hover:bg-white/10 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <label className="flex items-center gap-2 text-sm text-white/70 select-none">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-400 focus:ring-indigo-500/30"
                                            // UI-only (no submission logic changed)
                                            onChange={() => {}}
                                            checked={false}
                                        />
                                        Remember Me
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => {}}
                                        className="text-sm text-white/60 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400/40 rounded-md"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={loading ? undefined : { scale: 1.01 }}
                                    whileTap={loading ? undefined : { scale: 0.99 }}
                                    className="w-full rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 font-semibold text-white shadow-[0_14px_40px_rgba(99,102,241,0.25)] shadow-indigo-500/25 transition hover:opacity-95 active:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                >
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2 justify-center">
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            <span>Authenticating...</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 justify-center">
                                            <KeyRound size={18} />
                                            <span>Login</span>
                                        </span>
                                    )}
                                </motion.button>

                                <div className="space-y-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="w-full rounded-3xl border border-white/10 bg-white/5 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                                    >
                                        Back to User Login
                                    </button>

                                    <p className="text-center text-xs text-white/45">
                                        By continuing, you accept secure admin access.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AdminLogin;


