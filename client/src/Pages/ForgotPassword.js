import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import EmailStep from "../components/Forgot/EmailStep";
import OtpStep from "../components/Forgot/OtpStep";
import ResetStep from "../components/Forgot/ResetStep";

function ForgotPassword() {

    const navigate = useNavigate();

    // States
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldownTimer, setCooldownTimer] = useState(0);

    const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/auth";

    // ✅ SEND OTP
    const sendOtp = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/forgot-password`, { email });
            
            // Move to step 2 only if successful
            if (response.status === 200) {
                setStep(2);
                setCooldownTimer(0);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Error sending OTP";
            
            // Check if it's a rate limit error
            if (err.response?.status === 429) {
                const match = errorMsg.match(/\d+/);
                if (match) {
                    setCooldownTimer(parseInt(match[0]));
                }
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ✅ RESEND OTP
    const resendOtp = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/forgot-password`, { email });
            
            if (response.status === 200) {
                setCooldownTimer(0);
                setOtp("");
                // Show success briefly
                setTimeout(() => setError(""), 3000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Error resending OTP";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ✅ VERIFY OTP
    const verifyOtp = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE}/verify-reset-otp`,
                { email, otp }
            );

            if (response.status === 200) {
                setStep(3);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Invalid or expired OTP";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ✅ RESET PASSWORD
    const resetPasswordHandler = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE}/reset-password`,
                {
                    email,
                    otp,
                    newPassword: password,
                    confirmPassword
                }
            );

            if (response.status === 200) {
                // Success! Show message and redirect
                alert("✅ Password reset successful! Please login with your new password.");
                navigate("/");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Error resetting password";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] px-4 py-8">

            <div className="w-full max-w-md">

                {/* Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            🔐 Reset Password
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {step === 1 && "Enter your email to receive an OTP"}
                            {step === 2 && "Verify the code we sent to your email"}
                            {step === 3 && "Create a strong new password"}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1 flex-1 rounded-full transition-all ${
                                    s <= step ? 'bg-indigo-500' : 'bg-slate-700'
                                }`}
                            ></div>
                        ))}
                    </div>

                    {/* Steps */}
                    {step === 1 && (
                        <EmailStep
                            email={email}
                            setEmail={setEmail}
                            sendOtp={sendOtp}
                            loading={loading}
                            error={error}
                        />
                    )}

                    {step === 2 && (
                        <OtpStep
                            email={email}
                            otp={otp}
                            setOtp={setOtp}
                            verifyOtp={verifyOtp}
                            resendOtp={resendOtp}
                            loading={loading}
                            error={error}
                        />
                    )}

                    {step === 3 && (
                        <ResetStep
                            password={password}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            resetPassword={resetPasswordHandler}
                            loading={loading}
                            error={error}
                        />
                    )}

                    {/* Back Button */}
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            disabled={loading}
                            className="w-full mt-4 py-2 px-4 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 transition disabled:opacity-50 text-sm"
                        >
                            ← Back
                        </button>
                    )}

                    {/* Login Link */}
                    <div className="text-center mt-6 pt-6 border-t border-slate-700">
                        <p className="text-gray-400 text-sm">
                            Remember your password?{" "}
                            <button
                                onClick={() => navigate("/")}
                                className="text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                                Login here
                            </button>
                        </p>
                    </div>

                </div>

                {/* Support Text */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    🔒 Your password is encrypted and secure
                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;