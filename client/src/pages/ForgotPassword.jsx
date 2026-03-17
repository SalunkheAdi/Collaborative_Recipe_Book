import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/forgotpassword', { email });
            // For privacy, show same message even if user doesn't exist
            setSubmitted(true);
        } catch (err) {
            // If user not found, still show submitted to avoid leaking
            if (err.response && err.response.status === 404) {
                setSubmitted(true);
            } else {
                setError(err.response?.data?.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-950 px-4 transition-colors duration-300">
            <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-lg w-full max-w-md transition-colors duration-300">
                <div className="flex items-center justify-center gap-2 text-orange-600 font-bold text-2xl mb-8">
                    <ChefHat size={32} />
                    <span>CookBook</span>
                </div>

                {!submitted ? (
                    <>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center">Forgot Password?</h2>
                        <p className="text-stone-600 dark:text-stone-400 text-center mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 dark:focus:border-orange-700 outline-none transition-all"
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            {error && (
                                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Check your email</h2>
                        <p className="text-stone-600 dark:text-stone-400 mb-6">
                            If an account exists for {email}, we have sent a password reset link.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-orange-600 dark:text-orange-500 font-bold hover:underline"
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login" className="inline-flex items-center text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
