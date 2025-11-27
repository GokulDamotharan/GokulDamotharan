import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../Auth/AuthContext";

const Navbar = () => {
  const history = useHistory();
  const { token, googleId } = useContext(AuthContext);

  // Scroll to login section if on homepage, otherwise navigate to homepage
  const handleScrollToLogin = () => {
    if (window.location.pathname === '/') {
      // Already on homepage, scroll to login section
      const loginSection = document.getElementById('login-section');
      if (loginSection) {
        loginSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Navigate to homepage first, then scroll will happen via URL hash
      history.push('/#login-section');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-panel mx-3 mt-3 p-3"
      style={{ position: 'sticky', top: '12px', zIndex: 1000 }}
    >
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="icon-container me-3"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Sparkles size={24} />
            </motion.div>
            <div>
              <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                HealthCare
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', marginTop: '-4px' }}>
                Next-Gen Medical Platform
              </div>
            </div>
          </Link>
          
          <div className="d-flex gap-2 align-items-center">
            {(!token && !googleId) && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={handleScrollToLogin}
                  className="btn-gradient-primary d-flex align-items-center gap-2"
                  style={{ fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
                >
                  <span>Get Started</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
