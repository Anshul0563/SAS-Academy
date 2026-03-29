import { useState, useEffect } from "react";

function OtpStep({ otp, setOtp, verifyOtp }) {

    const [timer, setTimer] = useState(30);

    // ⏳ TIMER
    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className="space-y-4">

            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 rounded bg-black border border-white/20 outline-none"
            />

            <button
                onClick={verifyOtp}
                className="w-full bg-green-500 p-3 rounded hover:bg-green-600 transition"
            >
                Verify OTP
            </button>

            <p className="text-sm text-gray-400 text-center">
                {timer > 0 ? `Resend in ${timer}s` : "You can resend OTP"}
            </p>

        </div>
    );
}

export default OtpStep;