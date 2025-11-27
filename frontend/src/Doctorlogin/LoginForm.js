import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [status, setStatus] = useState(0);
	const { token, setToken, googleId, setGoogleId } = useContext(AuthContext);
	const history = useHistory();

	async function login(e) {
		if (e) e.preventDefault();
		try {
			const res = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/doctors/login/`,
				{ username, password }
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
					<label className="text-secondary font-weight-bold ml-2">Username</label>
					<div className="input-group">
						<div className="input-group-prepend">
							<span className="input-group-text bg-transparent border-0 pl-0">
								<User size={20} className="text-primary" />
							</span>
						</div>
						<input
							type="text"
							className="form-control bg-transparent border-top-0 border-left-0 border-right-0 rounded-0 px-2"
							placeholder="Enter your username"
							style={{ boxShadow: 'none', borderBottom: '2px solid rgba(0,0,0,0.1)' }}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
				</div>

				<div className="form-group mb-5">
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

				{status === 201 || status === 401 ? (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="alert alert-danger rounded-pill text-center py-2 mb-4"
					>
						Invalid credentials. Please try again.
					</motion.div>
				) : null}

				<button type="submit" className="btn btn-primary-gradient w-100 d-flex align-items-center justify-content-center py-3">
					Sign In <ArrowRight size={18} className="ml-2" />
				</button>
			</form>
		</motion.div>
	);
}

export default LoginForm;