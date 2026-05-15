import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";


function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/api/auth/login", { email, password });


        // IMPORTANT: Keep user/admin login separated.
        // Even if backend returns role=admin, do NOT auto-redirect to admin login here.
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        // Student auth token (must match UserPrivateRoute)
        localStorage.setItem("userToken", res.data.token);

        // Backward-compatible storage
        localStorage.setItem("token", res.data.token);

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        navigate("/dashboard");
      } else {
        await API.post("/api/auth/register", { name, email, password });


        setIsLogin(true);
        setError("Account created! Please login.");
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
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] px-3 py-5 sm:px-4">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl md:flex-row">
        {/* LEFT PANEL */}
        <div className="hidden flex-col justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white md:flex md:w-1/2 lg:p-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">SAS Academy</h1>
          <p className="text-base lg:text-lg opacity-90">
            Train like real SSC exams. Improve speed, accuracy, and confidence.
          </p>
          <div className="mt-6 text-sm opacity-80 space-y-1">
            <p>🚀 Real Exam Mode</p>
            <p>⚡ Instant Results</p>
            <p>🎯 Accurate Analysis</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex w-full flex-col justify-center p-5 sm:p-8 md:w-1/2 lg:p-10">
          <h2 className="text-2xl sm:text-3xl text-white font-bold mb-2 text-center md:text-left">
            {isLogin ? "Login" : "Register"}
          </h2>
          <p className="text-gray-400 mb-6 text-center md:text-left text-sm sm:text-base">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>

          {error && (
            <div className="bg-red-500/20 text-red-300 p-2 mb-3 rounded text-sm text-center">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="relative mb-5">
              <input
                placeholder=" "
                className="peer w-full p-3 pt-6 bg-transparent border border-white/20 rounded text-white outline-none focus:border-indigo-500"
                onChange={(e) => setName(e.target.value)}
              />
              <label
                className="absolute left-3 top-3 text-gray-400 text-sm 
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400
                peer-[&:not(:placeholder-shown)]:-top-2 
                peer-[&:not(:placeholder-shown)]:text-xs
                transition-all duration-200"
              >
                Full Name
              </label>
            </div>
          )}

          <div className="relative mb-5">
            <input
              type="email"
              placeholder=" "
              className="peer w-full p-3 pt-6 bg-transparent border border-white/20 rounded text-white outline-none focus:border-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              className="absolute left-3 top-3 text-gray-400 text-sm 
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400
                peer-[&:not(:placeholder-shown)]:-top-2 
                peer-[&:not(:placeholder-shown)]:text-xs
                transition-all duration-200"
            >
              Email
            </label>
          </div>

          <div className="relative mb-5">
            <input
              type={showPass ? "text" : "password"}
              placeholder=" "
              className="peer w-full p-3 pt-6 bg-transparent border border-white/20 rounded text-white outline-none focus:border-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              className="absolute left-3 top-3 text-gray-400 text-sm 
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400
                peer-[&:not(:placeholder-shown)]:-top-2 
                peer-[&:not(:placeholder-shown)]:text-xs
                transition-all duration-200"
            >
              Password
            </label>

            <span
              className="absolute right-3 top-3 text-gray-400 cursor-pointer text-xs sm:text-sm"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded text-white font-semibold flex justify-center items-center hover:opacity-90 transition"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isLogin ? "Login" : "Register"
            )}
          </button>

          <p
            className="text-gray-400 text-center mt-4 cursor-pointer hover:text-white text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </p>

          {/* ADMIN LOGIN */}
          <p
            className="text-indigo-400 text-center mt-2 cursor-pointer hover:underline text-sm"
            onClick={() => navigate("/admin-login")}
          >
            Login as Admin 🔐
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;

