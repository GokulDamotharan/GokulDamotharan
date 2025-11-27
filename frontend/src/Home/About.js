import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Heart, Users, Clock, Award } from "lucide-react";

const About = () => {
  const benefits = [
    { icon: <CheckCircle size={20} />, text: "Instant appointment booking with real-time availability" },
    { icon: <CheckCircle size={20} />, text: "Secure and encrypted health record management" },
    { icon: <CheckCircle size={20} />, text: "AI-powered doctor recommendations" },
    { icon: <CheckCircle size={20} />, text: "24/7 telehealth consultation support" }
  ];

  const highlights = [
    { icon: <Heart size={32} />, value: "99%", label: "Patient Satisfaction", color: "var(--gradient-secondary)" },
    { icon: <Users size={32} />, value: "500+", label: "Verified Doctors", color: "var(--gradient-primary)" },
    { icon: <Clock size={32} />, value: "< 2min", label: "Avg. Booking Time", color: "linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)" },
    { icon: <Award size={32} />, value: "4.9/5", label: "App Rating", color: "linear-gradient(135deg, #00C9A7 0%, #92FE9D 100%)" }
  ];

  return (
    <div className="container my-5 py-5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Section Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="badge-primary d-inline-flex align-items-center gap-2 mb-3"
            style={{ padding: '8px 20px' }}
          >
            <Heart size={16} />
            Why Choose Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="display-5 font-weight-bold mb-3"
          >
            Healthcare Made <span className="text-gradient">Simple</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="lead"
            style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}
          >
            In these challenging times, accessing quality healthcare shouldn't be a struggle.
            We've built a seamless, secure platform to bridge the gap.
          </motion.p>
        </div>

        {/* Highlights Grid */}
        <div className="row g-4 mb-5">
          {highlights.map((item, index) => (
            <div key={index} className="col-6 col-md-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass-panel text-center p-4 h-100"
              >
                <div 
                  className="icon-container mx-auto mb-3"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                  {item.label}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="glass-panel p-5"
        >
          <div className="row align-items-center">
            <div className="col-md-6">
              <h3 className="font-weight-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                What Makes Us Different
              </h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="d-flex align-items-start gap-3 mb-3"
                  >
                    <div style={{ color: 'var(--color-teal)', flexShrink: 0 }}>
                      {benefit.icon}
                    </div>
                    <p className="mb-0" style={{ color: 'var(--color-text-secondary)' }}>
                      {benefit.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="col-md-6 mt-4 mt-md-0">
              <div className="position-relative">
                {/* Decorative gradient background */}
                <div 
                  className="position-absolute"
                  style={{
                    width: '350px',
                    height: '350px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    opacity: '0.2',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="position-relative text-center p-5"
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                >
                  <div className="text-gradient-secondary" style={{ fontSize: '4rem', fontWeight: '800' }}>
                    2025
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    Medical Platform
                  </div>
                  <p className="mt-2 mb-0" style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                    Built with cutting-edge AI technology
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
