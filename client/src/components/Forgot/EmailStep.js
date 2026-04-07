function EmailStep({ email, setEmail, sendOtp }) {

    return (
        <div className="space-y-4">

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-black border border-white/20 outline-none"
            />

            <button
                onClick={sendOtp}
                className="w-full bg-indigo-500 p-3 rounded hover:bg-indigo-600 transition"
            >
                Send OTP
            </button>

        </div>
    );
}

export default EmailStep;