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

  const canSubmit = isLogin
    ? email.trim() && password
    : name.trim() && email.trim() && password;

  const switchMode = (mode) => {
    setIsLogin(mode === "login");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Please fill all fields.");
      return;
    }

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
      <div aria-hidden="true" className="sas-aurora" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 sas-dot-grid opacity-60" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-5xl"
      >
        <motion.div
          aria-hidden="true"
          className="absolute -inset-px rounded-[2rem] bg-[linear-gradient(135deg,rgba(103,232,249,0.68),rgba(167,139,250,0.28),rgba(110,231,183,0.52))] opacity-75 blur-md"
          animate={{ opacity: [0.4, 0.82, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="sas-panel sas-glass-edge relative grid overflow-hidden rounded-[2rem] p-0 md:grid-cols-[0.82fr_1fr]">
          <div className="relative hidden min-h-[560px] overflow-hidden border-r border-white/10 p-8 md:grid md:place-items-center">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.28),transparent_34%),radial-gradient(circle_at_78%_80%,rgba(167,139,250,0.18),transparent_34%)]" />

            <div className="relative flex w-full max-w-xs flex-col items-center text-center">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-white/15 bg-white/[0.08] shadow-[0_24px_80px_rgba(34,211,238,0.16)] backdrop-blur-xl">
                <img src="/logo.png" alt="SAS Academy" className="h-20 w-20 rounded-full object-contain" />
              </div>
              <h1 className="mt-6 text-center text-3xl font-semibold leading-none text-white">SAS Academy</h1>
              <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-200 via-sky-300 to-emerald-200" />
            </div>
          </div>

          <div className="relative flex min-h-[540px] items-start justify-center p-5 pt-8 sm:p-8 sm:pt-10">
            <div className="mx-auto w-full max-w-[360px]">
              <div className="mb-8 md:hidden">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.06]">
                    <img src="/logo.png" alt="SAS Academy" className="h-8 w-8 rounded-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-white">SAS Academy</h1>
                    <p className="text-sm text-slate-400">{isLogin ? "Student Login" : "Create Account"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-7 text-center">
                <p className="sas-kicker hidden md:block">Student Access</p>
                <h2 className="mt-3 text-3xl font-bold leading-none tracking-tight text-white">
                  {isLogin ? "Login" : "Register"}
                </h2>
                <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

                <div className="mt-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      isLogin ? "bg-cyan-300 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      !isLogin ? "bg-cyan-300 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Register
                  </button>
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

              <form onSubmit={handleSubmit} className="relative h-[360px] overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {isLogin ? (
                    <motion.div
                      key="login-fields"
                      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="absolute inset-x-0 top-[56px] space-y-4"
                    >
                      <label className="block text-left">
                        <span className="mb-2 block pl-1 text-sm font-medium text-slate-300">Email</span>
                        <span className="relative block">
                          <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="sas-input h-[54px] pl-11"
                            placeholder="student@example.com"
                            autoComplete="email"
                            required
                          />
                        </span>
                      </label>

                      <label className="block text-left">
                        <span className="mb-2 block pl-1 text-sm font-medium text-slate-300">Password</span>
                        <span className="relative block">
                          <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            name="password"
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="sas-input h-[54px] pl-11 pr-14"
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
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
                        disabled={loading || !canSubmit}
                        whileHover={loading ? undefined : { y: -2 }}
                        whileTap={loading ? undefined : { scale: 0.985 }}
                        className="sas-button-primary h-[54px] w-full disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {loading ? <Loader2 size={19} className="animate-spin" /> : null}
                        {loading ? "Please wait" : "Login"}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register-fields"
                      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="absolute inset-x-0 top-0 space-y-4"
                    >
                      <label className="block text-left">
                        <span className="mb-2 block pl-1 text-sm font-medium text-slate-300">Full Name</span>
                        <span className="relative block">
                          <UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="sas-input h-[54px] pl-11"
                            placeholder="Your name"
                            autoComplete="name"
                            required={!isLogin}
                          />
                        </span>
                      </label>

                      <label className="block text-left">
                        <span className="mb-2 block pl-1 text-sm font-medium text-slate-300">Email</span>
                        <span className="relative block">
                          <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="sas-input h-[54px] pl-11"
                            placeholder="student@example.com"
                            autoComplete="email"
                            required
                          />
                        </span>
                      </label>

                      <label className="block text-left">
                        <span className="mb-2 block pl-1 text-sm font-medium text-slate-300">Password</span>
                        <span className="relative block">
                          <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            name="password"
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="sas-input h-[54px] pl-11 pr-14"
                            placeholder="Enter password"
                            autoComplete="new-password"
                            required
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
                        disabled={loading || !canSubmit}
                        whileHover={loading ? undefined : { y: -2 }}
                        whileTap={loading ? undefined : { scale: 0.985 }}
                        className="sas-button-primary h-[54px] w-full disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {loading ? <Loader2 size={19} className="animate-spin" /> : null}
                        {loading ? "Please wait" : "Register"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default Auth;
