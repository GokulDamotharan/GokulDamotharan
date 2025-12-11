import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from '../Basic/Navbar';
import Footer from '../Basic/Footer';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [token, setToken] = useState('');
    
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        // Extract token from URL query parameters
        const params = new URLSearchParams(location.search);
        const resetToken = params.get('token');
        
        if (!resetToken) {
            setMessage({
                type: 'error',
                text: 'Invalid or missing reset token. Please request a new password reset.'
            });
        } else {
            setToken(resetToken);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (newPassword.length < 6) {
            setMessage({
                type: 'error',
                text: 'Password must be at least 6 characters long.'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({
                type: 'error',
                text: 'Passwords do not match.'
            });
            return;
        }

        if (!token) {
            setMessage({
                type: 'error',
                text: 'Invalid reset token. Please request a new password reset.'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL || 'http://localhost:5001'}/doctors/reset-password`,
                { token, newPassword }
            );

            setMessage({
                type: 'success',
                text: response.data.message || 'Password reset successfully!'
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                history.push('/doctorlogin');
            }, 2000);

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
                            Reset Password
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Enter your new password below.
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

                    {message.type === 'success' && (
                        <div className="text-center mb-4">
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                Redirecting to login page...
                            </p>
                        </div>
                    )}

                    {!message.type || message.type === 'error' ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                                <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                    <Lock size={18} className="mr-2" />New Password
                                </label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control glass-input pr-5"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        disabled={isSubmitting}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-link position-absolute"
                                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <small style={{ color: 'var(--color-text-light)' }}>
                                    Must be at least 6 characters long
                                </small>
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                    <Lock size={18} className="mr-2" />Confirm Password
                                </label>
                                <div className="position-relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="form-control glass-input pr-5"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        disabled={isSubmitting}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-link position-absolute"
                                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary-gradient w-100 py-3 mb-4"
                                disabled={isSubmitting || !token}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    ) : null}

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
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default ResetPassword;
