import { useState } from "react";

function EmailStep({ email, setEmail, sendOtp, loading, error }) {

    const [emailError, setEmailError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSend = () => {
        setEmailError("");

        if (!email.trim()) {
            setEmailError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        sendOtp();
    };

    return (
        <div className="space-y-4">

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                    }}
                    disabled={loading}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-900 border ${
                        emailError ? 'border-red-500' : 'border-slate-700'
                    } text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {emailError && (
                    <p className="text-red-400 text-sm mt-2">⚠️ {emailError}</p>
                )}
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                    ❌ {error}
                </div>
            )}

            <button
                onClick={handleSend}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 ${
                    loading
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
                {loading ? (
                    <>
                        <span className="animate-spin">⏳</span>
                        Sending OTP...
                    </>
                ) : (
                    <>
                        📧 Send OTP
                    </>
                )}
            </button>

            <p className="text-gray-400 text-sm text-center">
                We'll send a 6-digit OTP to your email
            </p>

        </div>
    );
}

export default EmailStep;