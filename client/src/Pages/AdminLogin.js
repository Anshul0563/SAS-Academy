import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    ShieldCheck,
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
        <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#080b12] px-4 py-8 text-slate-100">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
                <motion.div
                    className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.13),transparent)]"
                    animate={{ x: ["-90%", "210%"] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.22),transparent_34%),linear-gradient(180deg,rgba(8,11,18,0)_0%,#080b12_86%)]" />
                <motion.div
                    className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <motion.section
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative w-full max-w-[430px]"
            >
                <motion.div
                    aria-hidden="true"
                    className="absolute -inset-px rounded-[28px] bg-[linear-gradient(135deg,rgba(56,189,248,0.75),rgba(99,102,241,0.2),rgba(16,185,129,0.45))] opacity-70 blur-sm"
                    animate={{ opacity: [0.42, 0.82, 0.42] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/78 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-7">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-inner">
                                <img src="/logo.png" alt="SAS Academy" className="h-8 w-8 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-normal text-white">SAS Academy</h1>
                                <p className="text-sm text-slate-400">Admin Login</p>
                            </div>
                        </div>

                        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald-300/15 bg-emerald-400/10 text-emerald-200">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key={error}
                                role="alert"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                            >
                                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
                            <span className="group relative block">
                                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300" />
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-300/10"
                                    placeholder="admin@example.com"
                                />
                            </span>
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
                            <span className="group relative block">
                                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300" />
                                <input
                                    name="password"
                                    type={showPass ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-4 pr-14 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-300/10"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((v) => !v)}
                                    aria-label={showPass ? "Hide password" : "Show password"}
                                    className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/35"
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </span>
                        </label>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={loading ? undefined : { y: -1 }}
                            whileTap={loading ? undefined : { scale: 0.985 }}
                            className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-4 font-semibold text-slate-950 shadow-[0_14px_35px_rgba(34,211,238,0.22)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-cyan-300/25"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Authenticating
                                </>
                            ) : (
                                <>
                                    <KeyRound size={19} />
                                    Login
                                </>
                            )}
                        </motion.button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-4 focus:ring-white/10"
                        >
                            <ArrowLeft size={17} />
                            User Login
                        </button>
                    </form>
                </div>
            </motion.section>
        </main>
    );
}

export default AdminLogin;
