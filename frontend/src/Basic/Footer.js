import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", path: "/" },
    { name: "Doctors", path: "/doctorlogin" },
    { name: "Services", path: "/" },
    { name: "Contact", path: "/" }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, path: "#!", color: "#1877F2" },
    { icon: <Instagram size={20} />, path: "#!", color: "#E4405F" },
    { icon: <Twitter size={20} />, path: "#!", color: "#1DA1F2" },
    { icon: <Linkedin size={20} />, path: "#!", color: "#0A66C2" }
  ];

  return (
    <footer className="glass-panel mt-5 mx-3 mb-3 p-4">
      <div className="container-fluid">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="icon-container" style={{ background: 'var(--gradient-primary)', width: '40px', height: '40px' }}>
                <Heart size={20} />
              </div>
              <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                HealthCare
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Next-generation healthcare platform connecting patients with top specialists.
              Secure, fast, and intelligent.
            </p>
            <div className="d-flex gap-2">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={social.path}
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'white',
                      color: social.color,
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all var(--transition-base)'
                    }}
                  >
                    {social.icon}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="font-weight-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Quick Links
            </h6>
            <ul className="list-unstyled">
              {quickLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={link.path}
                    style={{
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color var(--transition-base)'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-teal)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h6 className="font-weight-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Contact Us
            </h6>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-start gap-2">
                <MapPin size={18} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  50, EVR Street, Chennai, India
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={18} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  +91 94457 4349
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={18} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  support@healthcare.com
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6 className="font-weight-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Stay Updated
            </h6>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Subscribe to get the latest health tips and updates.
            </p>
            <div className="d-flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="input-modern"
                style={{ fontSize: '0.875rem', padding: '10px 16px', flex: 1 }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient-primary"
                style={{ padding: '10px 20px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="mt-4 pt-4 text-center"
          style={{ borderTop: '1px solid var(--color-border-grey)' }}
        >
          <small style={{ color: 'var(--color-text-light)' }}>
            © 2025 HealthCare Platform. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
