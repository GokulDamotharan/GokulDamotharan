import React, { useContext, useMemo } from "react";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsideDoctor";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../Auth/AuthContext";
import { motion } from "framer-motion";
import { User, Stethoscope, Phone, DollarSign } from "lucide-react";

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
    }
  ];

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

              {/* Additional Info Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass-panel p-4 mt-3"
              >
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="icon-container"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h6 className="mb-1 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                      Professional Profile
                    </h6>
                    <p className="mb-0" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      Your profile is visible to patients searching for {doctor.specialization} specialists.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
