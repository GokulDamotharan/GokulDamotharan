import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../Basic/Navbar';
import Footer from '../Basic/Footer';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL || 'http://localhost:5001'}/doctors/forgot-password`,
                { email }
            );

            setMessage({
                type: 'success',
                text: response.data.message || 'Password reset link has been sent to your email.'
            });
            setEmail('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-5"
                    style={{ maxWidth: '500px', width: '100%' }}
                >
                    <div className="text-center mb-4">
                        <h2 className="font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                            Forgot Password?
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-4`}
                            style={{ borderRadius: '10px' }}
                        >
                            {message.type === 'success' ? (
                                <CheckCircle size={20} className="mr-2" />
                            ) : (
                                <AlertCircle size={20} className="mr-2" />
                            )}
                            <span>{message.text}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Mail size={18} className="mr-2" />Email Address
                            </label>
                            <input
                                type="email"
                                className="form-control glass-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary-gradient w-100 py-3 mb-4"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
                        <Link
                            to="/doctorlogin"
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                color: 'var(--color-primary)',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Login
                        </Link>
                    </div>

                    <div className="mt-4 p-3" style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '10px'
                    }}>
                        <p className="mb-0" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            <strong>Note:</strong> For security reasons, you'll receive an email only if an account exists with this email address. The reset link will expire in 1 hour.
                        </p>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default ForgotPassword;
