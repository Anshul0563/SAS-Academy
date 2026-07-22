import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Lock, Mail, UserRound } from "lucide-react";

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

            await API.post(
                "/auth/admin-register",
                form,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            navigate("/admin-login");

        } catch (err) {
            console.error("Admin register error:", err);

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
        <main className="sas-shell grid place-items-center px-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="sas-panel relative w-full max-w-[430px] overflow-hidden p-6 sm:p-7"
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

                <div className="mb-7 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
                        <img src="/logo-icon.png" alt="LEXORA" className="h-8 w-8 rounded-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">LEXORA</h1>
                        <p className="text-sm text-slate-400">Admin Register</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                        <AlertCircle size={17} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-4">
                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-300">Full Name</span>
                        <span className="relative block">
                            <UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                name="name"
                                placeholder="Your name"
                                value={form.name}
                                onChange={handleChange}
                                className="sas-input h-[52px] pl-11"
                            />
                        </span>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
                        <span className="relative block">
                            <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className="sas-input h-[52px] pl-11"
                            />
                        </span>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
                        <span className="relative block">
                            <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleChange}
                                className="sas-input h-[52px] pl-11"
                            />
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="sas-button-primary h-[52px] w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? <Loader2 size={19} className="animate-spin" /> : null}
                        {loading ? "Creating" : "Register"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin-login")}
                        className="sas-button-secondary h-12 w-full"
                    >
                        Already admin? Login
                    </button>
                </div>
            </form>
        </main>
    );
}

export default AdminRegister;
