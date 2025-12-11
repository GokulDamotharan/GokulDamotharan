import React, { useContext, useMemo } from "react";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsideDoctor";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../Auth/AuthContext";
import { motion } from "framer-motion";
import { User, Stethoscope, Phone, DollarSign, MapPin, Award, FileText, Calendar, Shield, CheckCircle, XCircle, Clock } from "lucide-react";

const PersonalDetails = () => {
  const { token } = useContext(AuthContext);
  const doctor = useMemo(() => jwt_decode(token), [token]);

  const detailItems = [
    { 
      label: "Name", 
      value: doctor.name, 
      icon: User,
      gradient: "var(--gradient-primary)"
    },
    { 
      label: "Specialization", 
      value: doctor.specialization, 
      icon: Stethoscope,
      gradient: "var(--gradient-secondary)"
    },
    { 
      label: "Phone Number", 
      value: doctor.phoneNumber, 
      icon: Phone,
      gradient: "linear-gradient(135deg, #845EC2 0%, #D65DB1 100%)"
    },
    { 
      label: "Fees Per Session", 
      value: `₹${doctor.feesPerSession}`, 
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)"
    },
    {
      label: "Qualification",
      value: doctor.qualification || 'Not specified',
      icon: Award,
      gradient: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
    },
    {
      label: "Experience",
      value: doctor.experience ? `${doctor.experience} years` : 'Not specified',
      icon: Calendar,
      gradient: "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
    }
  ];
  
  const getVerificationBadge = (status) => {
    const badges = {
      verified: { icon: CheckCircle, color: '#43E97B', text: 'Verified', bg: 'rgba(67, 233, 123, 0.1)' },
      pending: { icon: Clock, color: '#FFB75E', text: 'Pending Verification', bg: 'rgba(255, 183, 94, 0.1)' },
      rejected: { icon: XCircle, color: '#FF6B9D', text: 'Rejected', bg: 'rgba(255, 107, 157, 0.1)' },
      expired: { icon: XCircle, color: '#FF6B9D', text: 'Expired', bg: 'rgba(255, 107, 157, 0.1)' }
    };
    return badges[status] || badges.pending;
  };
  
  const verificationBadge = getVerificationBadge(doctor.verificationStatus || 'pending');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-0">
            <Leftside />
          </div>

          <div className="col-md-9 col-lg-10 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-4">
                <h2 className="font-weight-bold d-flex align-items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <User size={32} style={{ color: 'var(--color-teal)' }} />
                  Personal Details
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Your professional profile information
                </p>
              </div>

              {/* Details Cards */}
              <div className="row">
                {detailItems.map((item, index) => (
                  <div key={item.label} className="col-md-6 mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="glass-panel p-4 h-100"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="icon-container"
                          style={{ background: item.gradient }}
                        >
                          <item.icon size={24} />
                        </div>
                        <div className="flex-grow-1">
                          <small className="d-block mb-1" style={{ 
                            color: 'var(--color-text-light)', 
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: '600'
                          }}>
                            {item.label}
                          </small>
                          <h5 className="mb-0 font-weight-bold" style={{ 
                            color: 'var(--color-text-primary)',
                            fontSize: '1.25rem'
                          }}>
                            {item.value}
                          </h5>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* License Verification Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass-panel p-4 mt-3"
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="mb-0 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                    <Shield size={20} className="me-2" />
                    License Verification
                  </h6>
                  <div 
                    className="px-3 py-1 rounded-pill d-flex align-items-center gap-2"
                    style={{ 
                      background: verificationBadge.bg,
                      color: verificationBadge.color,
                      border: `1px solid ${verificationBadge.color}`
                    }}
                  >
                    <verificationBadge.icon size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{verificationBadge.text}</span>
                  </div>
                </div>
                
                {doctor.licenseNumber && (
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <small style={{ color: 'var(--color-text-light)' }}>License Number</small>
                      <p className="mb-0" style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>
                        {doctor.licenseNumber}
                      </p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small style={{ color: 'var(--color-text-light)' }}>Issuing Authority</small>
                      <p className="mb-0" style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>
                        {doctor.issuingAuthority || 'Not specified'}
                      </p>
                    </div>
                    {doctor.licenseExpiryDate && (
                      <div className="col-md-6 mb-2">
                        <small style={{ color: 'var(--color-text-light)' }}>Expiry Date</small>
                        <p className="mb-0" style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>
                          {new Date(doctor.licenseExpiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
              
              {/* Location Information */}
              {doctor.location && doctor.location.city && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="glass-panel p-4 mt-3"
                >
                  <h6 className="mb-3 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                    <MapPin size={20} className="me-2" />
                    Practice Location
                  </h6>
                  <p className="mb-0" style={{ color: 'var(--color-text-secondary)' }}>
                    {doctor.location.city}, {doctor.location.state}, {doctor.location.country}
                  </p>
                </motion.div>
              )}
              
              {/* Personal Details */}
              {(doctor.dateOfBirth || doctor.gender || doctor.address) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="glass-panel p-4 mt-3"
                >
                  <h6 className="mb-3 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                    <User size={20} className="me-2" />
                    Additional Information
                  </h6>
                  <div className="row">
                    {doctor.dateOfBirth && (
                      <div className="col-md-6 mb-2">
                        <small style={{ color: 'var(--color-text-light)' }}>Date of Birth</small>
                        <p className="mb-0" style={{ color: 'var(--color-text-primary)' }}>
                          {new Date(doctor.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {doctor.gender && (
                      <div className="col-md-6 mb-2">
                        <small style={{ color: 'var(--color-text-light)' }}>Gender</small>
                        <p className="mb-0" style={{ color: 'var(--color-text-primary)' }}>
                          {doctor.gender}
                        </p>
                      </div>
                    )}
                    {doctor.address && doctor.address.street && (
                      <div className="col-12 mb-2">
                        <small style={{ color: 'var(--color-text-light)' }}>Address</small>
                        <p className="mb-0" style={{ color: 'var(--color-text-primary)' }}>
                          {doctor.address.street}, {doctor.address.city}, {doctor.address.state} - {doctor.address.postalCode}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
