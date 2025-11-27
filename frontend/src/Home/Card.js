import { Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from '../Auth/AuthContext';
import { motion } from 'framer-motion';
import { User, Stethoscope, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Card = ({ login = "Doctor", Image, link }) => {
  const { token, googleId, setToken, setGoogleId } = useContext(AuthContext);
  const history = useHistory();

  const loginWithGoogle = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar',
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const profile = userInfo.data;
        console.log("[Google] Signed in successfully!", profile);

        window.localStorage.setItem("token", tokenResponse.access_token);
        window.localStorage.setItem("googleId", profile.sub);
        window.localStorage.setItem("user", JSON.stringify(profile));

        const serverRes = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/patients/google-login/`,
          {
            googleId: profile.sub,
            email: profile.email,
            name: profile.name,
            picture: profile.picture
          }
        );

        if (serverRes) {
          console.log(serverRes.data.phoneNumberExists);

          setToken(tokenResponse.access_token);
          setGoogleId(profile.sub);

          if (serverRes.data.phoneNumberExists === true) {
            history.push("/patient");
          } else {
            history.push("/patient/update-phone");
          }
        } else {
          const err = { err: "Server Didn't respond" };
          throw err;
        }
      } catch (err) {
        console.error(`[Google] Some error occurred while signing in!`, err);
        alert(`Error signing in: ${err.message || JSON.stringify(err)}`);
      }
    },
    onError: (error) => {
      console.error(`[Google] Login Failed:`, error);
      alert(`Google Login Failed: ${error}`);
    },
  });

  const icon = login === "Doctor" ? <Stethoscope size={28} /> : <User size={28} />;
  const gradient = login === "Doctor" 
    ? "var(--gradient-secondary)" 
    : "var(--gradient-primary)";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-4 h-100"
      style={{ cursor: 'pointer' }}
    >
      {/* Icon Header */}
      <div className="d-flex justify-content-center mb-4">
        <div 
          className="icon-container-lg"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      </div>

      {/* Image */}
      <div className="mb-4" style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={Image} 
          className="w-100" 
          alt={login}
          style={{ 
            height: "200px", 
            objectFit: "cover",
            borderRadius: 'var(--radius-lg)'
          }}
        />
      </div>

      {/* Title */}
      <h5 className="font-weight-bold mb-3 text-center" style={{ color: 'var(--color-text-primary)' }}>
        {login} Portal
      </h5>

      {/* Login Button */}
      {((!token || googleId) && login === "Doctor") && (
        <Link to={link} className="text-decoration-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-gradient-secondary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            Login As A Doctor
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      )}
      
      {((token && !googleId) && login === "Doctor") && (
        <Link to={link} className="text-decoration-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-gradient-secondary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            My Dashboard
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      )}

      {(!googleId && login === "Patient") && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loginWithGoogle}
          disabled={false}
          className="btn-gradient-primary w-100 d-flex align-items-center justify-content-center gap-2 ripple"
        >
          Login With Google
          <ArrowRight size={18} />
        </motion.button>
      )}
      
      {((token && googleId) && login === "Patient") && (
        <Link to={link} className="text-decoration-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-gradient-primary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            My Dashboard
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      )}
    </motion.div>
  );
}

export default Card;