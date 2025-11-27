import React, { useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Calendar, User, Clock, LogOut, FileText, MessageSquare } from "lucide-react";
import { AuthContext } from "../Auth/AuthContext";
import { motion } from "framer-motion";

const LeftsideDoctor = () => {
  const location = useLocation();
  const history = useHistory();
  const { setToken, setGoogleId } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/doctor", icon: Calendar, label: "Today's Schedule" },
    { path: "/doctor/perosnaldetails", icon: User, label: "Personal Details" },
    { path: "/doctor/payment-history", icon: Clock, label: "Previous Appointments" },
    { path: "/doctor/health-tips", icon: FileText, label: "Manage Health Tips" },
    { path: "/doctor/questions", icon: MessageSquare, label: "Patient Questions" },
  ];

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear auth context
    setToken(null);
    setGoogleId(null);
    
    // Redirect to home
    history.push("/");
  };

  return (
    <div className="glass-panel h-100 p-3 d-flex flex-column">
      <div className="mb-4 px-3 pt-2">
        <small className="text-uppercase font-weight-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--color-text-light)' }}>
          Doctor Portal
        </small>
      </div>
      <ul className="nav flex-column flex-grow-1">
        {menuItems.map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center rounded-pill px-3 py-2 ${
                isActive(item.path) ? 'active-nav-link' : 'inactive-nav-link'
              }`}
              style={{ 
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
            >
              <item.icon size={18} className="mr-3" />
              <span className="font-weight-medium" style={{ fontSize: '0.95rem' }}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="px-3 pb-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill px-3 py-2"
          style={{
            background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
          }}
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default LeftsideDoctor;
