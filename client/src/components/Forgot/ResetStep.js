import { useState } from "react";

function ResetStep({ password, setPassword, confirmPassword, setConfirmPassword, resetPassword, loading, error }) {

    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const validatePassword = (pwd) => {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    };

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { strength: 0, color: '', text: '' };
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[@$!%*?&]/.test(pwd)) strength++;

        const strengths = [
            { strength: 0, color: 'bg-gray-600', text: '' },
            { strength: 1, color: 'bg-red-500', text: 'Weak' },
            { strength: 2, color: 'bg-orange-500', text: 'Fair' },
            { strength: 3, color: 'bg-yellow-500', text: 'Good' },
            { strength: 4, color: 'bg-green-500', text: 'Strong' },
            { strength: 5, color: 'bg-green-600', text: 'Very Strong' }
        ];

        return strengths[strength];
    };

    const handleReset = () => {
        setPasswordError("");

        if (!password.trim() || !confirmPassword.trim()) {
            setPasswordError("Both password fields are required");
            return;
        }

        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError("Password must contain uppercase, lowercase, and number");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        resetPassword();
    };

    const strength = getPasswordStrength(password);

    return (
        <div className="space-y-4">

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError("");
                        }}
                        disabled={loading}
                        className={`w-full px-4 py-3 pr-10 rounded-lg bg-slate-900 border ${
                            passwordError ? 'border-red-500' : 'border-slate-700'
                        } text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                {password && (
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                            <div className={`h-1 flex-1 rounded ${strength.color}`}></div>
                            {strength.text && (
                                <span className={`${strength.color === 'bg-red-500' ? 'text-red-400' : strength.color === 'bg-orange-500' ? 'text-orange-400' : strength.color === 'bg-yellow-500' ? 'text-yellow-400' : 'text-green-400'}`}>
                                    {strength.text}
                                </span>
                            )}
                        </div>
                        <ul className="text-xs text-gray-400 space-y-0.5">
                            <li className={password.length >= 8 ? 'text-green-400' : ''}>
                                {password.length >= 8 ? '✓' : '○'} At least 8 characters
                            </li>
                            <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>
                                {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
                            </li>
                            <li className={/[a-z]/.test(password) ? 'text-green-400' : ''}>
                                {/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter
                            </li>
                            <li className={/\d/.test(password) ? 'text-green-400' : ''}>
                                {/\d/.test(password) ? '✓' : '○'} One number
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError("");
                        }}
                        disabled={loading}
                        className={`w-full px-4 py-3 pr-10 rounded-lg bg-slate-900 border ${
                            passwordError ? 'border-red-500' : 'border-slate-700'
                        } text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                        {showConfirm ? "🙈" : "👁️"}
                    </button>
                </div>

                {password && confirmPassword && (
                    <p className={`text-xs mt-2 ${
                        password === confirmPassword ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                )}
            </div>

            {passwordError && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                    ❌ {passwordError}
                </div>
            )}

            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                    ❌ {error}
                </div>
            )}

            <button
                onClick={handleReset}
                disabled={loading || !password || !confirmPassword}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 ${
                    loading || !password || !confirmPassword
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
            >
                {loading ? (
                    <>
                        <span className="animate-spin">⏳</span>
                        Resetting Password...
                    </>
                ) : (
                    <>
                        🔓 Reset Password
                    </>
                )}
            </button>

        </div>
    );
}

export default ResetStep;