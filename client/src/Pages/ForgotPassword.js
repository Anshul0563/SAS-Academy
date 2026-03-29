import { useState } from "react";
import axios from "axios";

import EmailStep from "../components/Forgot/EmailStep";
import OtpStep from "../components/Forgot/OtpStep";
import ResetStep from "../components/Forgot/ResetStep";

function ForgotPassword() {

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    // ✅ SEND OTP
    const sendOtp = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.msg || "Error sending OTP");
        }
    };

    // ✅ VERIFY OTP
    const verifyOtp = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            setStep(3);
        } catch (err) {
            alert(err.response?.data?.msg || "Invalid OTP");
        }
    };

    // ✅ RESET PASSWORD
    const resetPassword = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/reset-password", { email, password });
            alert("✅ Password reset successful");
            setStep(1);
        } catch (err) {
            alert(err.response?.data?.msg || "Error resetting password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

            <div className="bg-white/10 backdrop-blur p-6 sm:p-8 rounded-2xl w-full max-w-md">

                <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
                    🔐 Forgot Password
                </h2>

                {step === 1 && (
                    <EmailStep email={email} setEmail={setEmail} sendOtp={sendOtp} />
                )}

                {step === 2 && (
                    <OtpStep otp={otp} setOtp={setOtp} verifyOtp={verifyOtp} />
                )}

                {step === 3 && (
                    <ResetStep password={password} setPassword={setPassword} resetPassword={resetPassword} />
                )}

            </div>

        </div>
    );
}

export default ForgotPassword;