import React, { useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Sparkles, Activity } from "lucide-react";
import { AuthContext } from "../Auth/AuthContext";
import { motion } from "framer-motion";

const LeftsidePatient = () => {
  const location = useLocation();
  const history = useHistory();
  const { setToken, setGoogleId } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/patient", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/patient/appointment-status", icon: Calendar, label: "Appointments" },
    { path: "/patient/searchdoctor", icon: Users, label: "Find Doctors" },
    { path: "/patient/previousappointments", icon: FileText, label: "History" },
    { path: "/patient/ai-assistant", icon: Sparkles, label: "AI Assistant", badge: "New" },
    { path: "/patient/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setGoogleId(null);
    history.push("/");
  };

  return (
    <div className="glass-panel h-100 p-4 d-flex flex-column">
      <div className="mb-5 px-2 d-flex align-items-center gap-2">
        <div className="bg-gradient-primary rounded p-1">
          <Activity size={20} className="text-white" />
        </div>
        <span className="font-weight-bold text-dark h5 m-0">MediSched</span>
      </div>

      <div className="mb-4 px-3">
        <small className="text-uppercase font-weight-bold text-secondary" style={{ fontSize: '0.7rem', letterSpacing: '1.5px' }}>
          Main Menu
        </small>
      </div>

      <ul className="nav flex-column flex-grow-1 gap-2">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center rounded-xl px-3 py-3 position-relative overflow-hidden ${
                isActive(item.path) ? 'text-primary bg-soft-primary shadow-sm' : 'text-secondary hover-bg-light'
              }`}
              style={{ 
                transition: 'all 0.3s ease',
                background: isActive(item.path) ? 'rgba(24, 197, 210, 0.1)' : 'transparent',
                color: isActive(item.path) ? 'var(--color-teal)' : 'var(--color-text-secondary)'
              }}
            >
              {isActive(item.path) && (
                <div className="position-absolute" style={{ 
                  left: 0, top: 0, bottom: 0, width: 4, 
                  background: 'var(--gradient-primary)',
                  borderRadius: '0 4px 4px 0'
                }}></div>
              )}
              
              <item.icon size={20} className="mr-3" style={{ opacity: isActive(item.path) ? 1 : 0.7 }} />
              <span className="font-weight-medium" style={{ fontSize: '0.95rem' }}>
                {item.label}
              </span>
              
              {item.badge && (
                <span className="ml-auto badge badge-pill bg-gradient-primary text-white" style={{ fontSize: '0.6rem' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-top border-light">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-xl px-3 py-3"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--color-danger)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
};

export default LeftsidePatient;
