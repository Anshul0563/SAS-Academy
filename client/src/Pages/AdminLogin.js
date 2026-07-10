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
        <main className="sas-shell grid place-items-center px-4 py-8">
            <div aria-hidden="true" className="sas-aurora" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 sas-dot-grid opacity-60" />
                <motion.div
                    className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute left-1/2 top-1/2 h-[27rem] w-[27rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
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
                    className="absolute -inset-px rounded-[2rem] bg-[linear-gradient(135deg,rgba(103,232,249,0.72),rgba(167,139,250,0.34),rgba(110,231,183,0.55))] opacity-80 blur-md"
                    animate={{ opacity: [0.44, 0.86, 0.44] }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="sas-panel sas-glass-edge relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
                        <div className="mx-auto w-full max-w-sm">
                            <div className="mb-5 flex items-center gap-3 text-left">
                                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.08] shadow-[0_18px_48px_rgba(34,211,238,0.14)]">
                                    <img src="/logo.png" alt="SAS Academy" className="h-11 w-11 rounded-full object-contain" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl font-semibold leading-none text-white">SAS Academy</h1>
                                    <p className="mt-1.5 text-sm text-slate-400">Admin Panel</p>
                                </div>
                            </div>

                            <div className="mb-5 text-center">
                                <h2 className="text-2xl font-bold tracking-tight text-white">Login</h2>
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
                                            className="sas-input h-[54px] pl-11"
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
                                            className="sas-input h-[54px] pl-11 pr-14"
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
                                    whileHover={loading ? undefined : { y: -2 }}
                                    whileTap={loading ? undefined : { scale: 0.985 }}
                                    className="sas-button-primary mt-2 h-[54px] w-full disabled:cursor-not-allowed disabled:opacity-60"
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
                                    className="sas-button-secondary h-12 w-full"
                                >
                                    <ArrowLeft size={17} />
                                    User Login
                                </button>
                            </form>
                        </div>
                    </div>
            </motion.section>
        </main>
    );
}

export default AdminLogin;
