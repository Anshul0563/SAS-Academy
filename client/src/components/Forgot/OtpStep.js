import { useState, useEffect } from "react";

function OtpStep({ email, otp, setOtp, verifyOtp, resendOtp, loading, error }) {

    const [timer, setTimer] = useState(600); // 10 minutes
    const [otpError, setOtpError] = useState("");
    const [isResending, setIsResending] = useState(false);

    // ⏳ TIMER
    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = () => {
        setOtpError("");

        if (!otp.trim()) {
            setOtpError("OTP is required");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setOtpError("OTP must be exactly 6 digits");
            return;
        }

        verifyOtp();
    };

    const handleResend = async () => {
        setIsResending(true);
        await resendOtp();
        setIsResending(false);
    };

    return (
        <div className="space-y-4">

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Verification Code
                </label>
                <p className="text-xs text-gray-400 mb-3">
                    Enter the 6-digit code sent to {email}
                </p>
                <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                        // Only allow digits and limit to 6 characters
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                        setOtpError("");
                    }}
                    maxLength="6"
                    disabled={loading || isResending}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-900 border ${
                        otpError ? 'border-red-500' : 'border-slate-700'
                    } text-white text-center text-3xl tracking-widest placeholder-gray-600 outline-none focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono`}
                />
                {otpError && (
                    <p className="text-red-400 text-sm mt-2">⚠️ {otpError}</p>
                )}
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                    ❌ {error}
                </div>
            )}

            <button
                onClick={handleVerify}
                disabled={loading || isResending}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 ${
                    loading || isResending
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
                {loading ? (
                    <>
                        <span className="animate-spin">⏳</span>
                        Verifying...
                    </>
                ) : (
                    <>
                        ✓ Verify OTP
                    </>
                )}
            </button>

            <div className="flex items-center gap-2 justify-center">
                <div className={`text-sm font-semibold ${
                    timer < 120 ? 'text-red-400' : 'text-gray-400'
                }`}>
                    ⏱️ {formatTime(timer)}
                </div>
            </div>

            <button
                onClick={handleResend}
                disabled={timer > 0 || isResending || loading}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition duration-200 ${
                    timer > 0 || isResending || loading
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-slate-800 text-indigo-400 hover:bg-slate-700'
                }`}
            >
                {isResending ? '⏳ Resending...' : '🔄 Resend OTP'}
            </button>

            {timer > 0 && timer <= 120 && (
                <p className="text-amber-400 text-xs text-center">
                    ⚠️ OTP expires in {formatTime(timer)}
                </p>
            )}

        </div>
    );
}

export default OtpStep;