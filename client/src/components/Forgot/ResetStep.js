function ResetStep({ password, setPassword, resetPassword }) {

    return (
        <div className="space-y-4">

            <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-black border border-white/20 outline-none"
            />

            <button
                onClick={resetPassword}
                className="w-full bg-purple-500 p-3 rounded hover:bg-purple-600 transition"
            >
                Reset Password
            </button>

        </div>
    );
}

export default ResetStep;