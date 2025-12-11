import React, { useContext, useState } from 'react';
import { Redirect, useHistory, Link } from "react-router-dom";
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [status, setStatus] = useState(0);
	const { token, setToken, googleId, setGoogleId } = useContext(AuthContext);
	const history = useHistory();

	async function login(e) {
		if (e) e.preventDefault();
		try {
			const res = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/doctors/login/`,
				{ email, password }
			);
			setStatus(res.status);
			const token = res.data.token;

			if (res.status === 200) {
				window.localStorage.setItem("token", token);
				window.localStorage.removeItem("googleId");
				setGoogleId(null);
				setToken(token);
				history.push('/doctor');
			}
		} catch (err) {
			console.log(err);
			setStatus(401); // Assume error is auth failure for simplicity
		}
	}

	if (token && !googleId) {
		return <Redirect to="/doctor" />
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
			className="glass-panel p-5"
			style={{ maxWidth: '450px', width: '100%' }}
		>
			<div className="text-center mb-5">
				<h2 className="font-weight-bold text-primary">Doctor Portal</h2>
				<p className="text-muted">Secure access for medical professionals</p>
			</div>

			<form onSubmit={login}>
				<div className="form-group mb-4">
					<label className="text-secondary font-weight-bold ml-2">Email Address</label>
					<div className="input-group">
						<div className="input-group-prepend">
							<span className="input-group-text bg-transparent border-0 pl-0">
								<Mail size={20} className="text-primary" />
							</span>
						</div>
						<input
							type="email"
							className="form-control bg-transparent border-top-0 border-left-0 border-right-0 rounded-0 px-2"
							placeholder="your.email@example.com"
							style={{ boxShadow: 'none', borderBottom: '2px solid rgba(0,0,0,0.1)' }}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="form-group mb-3">
					<label className="text-secondary font-weight-bold ml-2">Password</label>
					<div className="input-group">
						<div className="input-group-prepend">
							<span className="input-group-text bg-transparent border-0 pl-0">
								<Lock size={20} className="text-primary" />
							</span>
						</div>
						<input
							type="password"
							className="form-control bg-transparent border-top-0 border-left-0 border-right-0 rounded-0 px-2"
							placeholder="Enter your password"
							style={{ boxShadow: 'none', borderBottom: '2px solid rgba(0,0,0,0.1)' }}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>

				<div className="text-right mb-4">
					<Link 
						to="/doctor/forgot-password" 
						style={{ 
							color: 'var(--color-primary)', 
							textDecoration: 'none',
							fontSize: '0.9rem'
						}}
						className="hover-underline"
					>
						Forgot Password?
					</Link>
				</div>

				{status === 201 || status === 401 ? (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="alert alert-danger rounded-pill text-center py-2 mb-4"
					>
						Invalid email or password. Please try again.
					</motion.div>
				) : null}

				<button type="submit" className="btn btn-primary-gradient w-100 d-flex align-items-center justify-content-center py-3 mb-4">
					Sign In <ArrowRight size={18} className="ml-2" />
				</button>
			</form>

			<div className="text-center pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
				<p className="text-muted mb-2">New to Medisched?</p>
				<Link 
					to="/doctor/register" 
					style={{ 
						color: 'var(--color-primary)', 
						textDecoration: 'none',
						fontWeight: 'bold'
					}}
					className="hover-underline"
				>
					Register as a Doctor →
				</Link>
			</div>
		</motion.div>
	);
}

export default LoginForm;