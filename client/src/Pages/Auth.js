import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";

import API from "../api/axios";
import { storeUserAuth } from "../utils/authStorage";

function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });

        storeUserAuth({
          token: res.data.token,
          user: res.data.user,
        });

        navigate("/dashboard");
      } else {
        await API.post("/auth/register", { name, email, password });
        setIsLogin(true);
        setError("Account created. Please login.");
      }
    } catch (err) {
      console.error("Auth error:", err);

      let errorMsg = "Login/Register failed";

      if (!err.response) {
        errorMsg = "Network error - server unavailable";
      } else if (err.response.status >= 400 && err.response.status < 500) {
        errorMsg = err.response.data?.message || "Invalid credentials";
      } else {
        errorMsg = "Server error - please try again";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sas-shell grid place-items-center px-4 py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-[440px]"
      >
        <div className="sas-panel overflow-hidden p-6 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
              <img src="/logo.png" alt="SAS Academy" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">SAS Academy</h1>
              <p className="text-sm text-slate-400">{isLogin ? "Student Login" : "Create Account"}</p>
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
                className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  error.includes("created")
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                    : "border-red-400/20 bg-red-500/10 text-red-100"
                }`}
              >
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Full Name</span>
                <span className="relative block">
                  <UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="sas-input h-[52px] pl-11"
                    placeholder="Your name"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
              <span className="relative block">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sas-input h-[52px] pl-11"
                  placeholder="student@example.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
              <span className="relative block">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sas-input h-[52px] pl-11 pr-14"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
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
              className="sas-button-primary h-[52px] w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 size={19} className="animate-spin" /> : null}
              {loading ? "Please wait" : isLogin ? "Login" : "Register"}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="sas-button-secondary h-12 w-full"
            >
              {isLogin ? "Create an account" : "Already have an account? Login"}
            </button>
          </form>
        </div>
      </motion.section>
    </main>
  );
}

export default Auth;
