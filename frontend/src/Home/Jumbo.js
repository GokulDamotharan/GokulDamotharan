import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Shield,
  Activity,
  Zap,
  Heart,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Jumbo = () => {
  const features = [
    {
      icon: <Activity size={28} />,
      title: "Real-time Availability",
      description: "Live updates from 500+ doctors",
      gradient: "var(--gradient-primary)",
    },
    {
      icon: <Shield size={28} />,
      title: "Secure & Private",
      description: "End-to-end encrypted records",
      gradient: "var(--gradient-secondary)",
    },
    {
      icon: <Zap size={28} />,
      title: "Smart Scheduling",
      description: "AI-powered slot optimization",
      gradient: "linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)",
    },
  ];

  const stats = [
    { value: "500+", label: "Expert Doctors", icon: <Heart size={20} /> },
    { value: "10K+", label: "Happy Patients", icon: <TrendingUp size={20} /> },
    { value: "24/7", label: "Support Available", icon: <Activity size={20} /> },
  ];

  return (
    <div className="container mt-5 mb-5">
      <div className="row align-items-center" style={{ minHeight: "70vh" }}>
        {/* Left Content */}
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="badge-primary d-inline-flex align-items-center gap-2 mb-4"
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.875rem",
              }}
            >
              <Zap size={16} />
              AI-Powered Healthcare Platform
            </motion.div>

            {/* Main Heading */}
            <h1
              className="display-4 font-weight-bold mb-4"
              style={{ lineHeight: "1.2" }}
            >
              <span className="text-gradient">Next-Gen</span> Healthcare
              <br />
              <span style={{ color: "var(--color-text-primary)" }}>
                Appointment System
              </span>
            </h1>

            {/* Description */}
            <p
              className="lead mb-4"
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "1.125rem",
              }}
            >
              Experience the future of medical scheduling. Book appointments
              with top specialists, manage your health records, and consult
              digitally with our secure, AI-powered platform.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex flex-wrap gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => {
                    const loginSection =
                      document.getElementById("login-section");
                    if (loginSection) {
                      loginSection.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                  className="btn-gradient-primary d-flex align-items-center gap-2"
                  style={{
                    border: "none",
                    cursor: "pointer",
                    padding: "14px 32px",
                    fontSize: "1rem",
                  }}
                >
                  <Calendar size={20} />
                  Book Appointment
                  <ChevronRight size={20} />
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/doctorlogin"
                  className="btn-outline d-flex align-items-center gap-2"
                  style={{
                    textDecoration: "none",
                    padding: "14px 32px",
                    fontSize: "1rem",
                  }}
                >
                  <Shield size={20} />
                  Doctor Portal
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="d-flex flex-wrap gap-4 mt-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="d-flex align-items-center gap-2"
                >
                  <div style={{ color: "var(--color-teal)" }}>{stat.icon}</div>
                  <div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-light)",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Content - Feature Cards */}
        <div className="col-lg-6 mt-5 mt-lg-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="position-relative">
              {/* Decorative Background */}
              <div
                className="position-absolute"
                style={{
                  width: "400px",
                  height: "400px",
                  background: "var(--gradient-primary)",
                  borderRadius: "50%",
                  filter: "blur(100px)",
                  opacity: "0.15",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
              />

              {/* Feature Cards Stack */}
              <div className="position-relative" style={{ zIndex: 1 }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="glass-panel p-4 mb-3"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="icon-container"
                        style={{ background: feature.gradient }}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-grow-1 ml-3">
                        <h5
                          className="mb-1 font-weight-bold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {feature.title}
                        </h5>
                        <small style={{ color: "var(--color-text-light)" }}>
                          {feature.description}
                        </small>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        style={{ color: "var(--color-teal)" }}
                      >
                        <ChevronRight size={20} />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Jumbo;
