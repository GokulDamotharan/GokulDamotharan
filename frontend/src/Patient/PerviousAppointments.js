import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BsPencilSquare } from "react-icons/bs";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsidePatient";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Star, MessageSquare, AlertCircle } from "lucide-react";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const { data } = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/previous-appointments/`,
        {
          googleId: localStorage.getItem("googleId"),
        }
      );
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
                  <Calendar size={32} style={{ color: 'var(--color-teal)' }} />
                  Previous Appointments
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  View your appointment history and provide feedback
                </p>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="spinner-border" style={{ color: 'var(--color-teal)' }} role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : appointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-5 text-center"
                >
                  <AlertCircle size={64} style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }} />
                  <h4 style={{ color: 'var(--color-text-primary)' }}>No Previous Appointments</h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    You haven't had any appointments yet.
                  </p>
                </motion.div>
              ) : (
                <div className="glass-panel p-4">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border-grey)' }}>
                          <th style={{ color: 'var(--color-text-primary)', fontWeight: '600', padding: '1rem' }}>
                            <Calendar size={18} className="mr-2" />
                            Date
                          </th>
                          <th style={{ color: 'var(--color-text-primary)', fontWeight: '600', padding: '1rem' }}>
                            <Clock size={18} className="mr-2" />
                            Time
                          </th>
                          <th style={{ color: 'var(--color-text-primary)', fontWeight: '600', padding: '1rem' }}>
                            Doctor Name
                          </th>
                          <th style={{ color: 'var(--color-text-primary)', fontWeight: '600', padding: '1rem' }}>
                            <MessageSquare size={18} className="mr-2" />
                            Feedback
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment, index) => (
                          <motion.tr
                            key={appointment._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ borderBottom: '1px solid var(--color-border-grey)' }}
                          >
                            <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                              {appointment.date}
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                              {appointment.slotTime}
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: '500' }}>
                              {appointment.doctorName}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div className="d-flex align-items-center gap-3">
                                <Link 
                                  to={`/patient/feedback/${appointment._id}`}
                                  className="d-flex align-items-center gap-2"
                                  style={{ 
                                    color: 'var(--color-teal)', 
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-sky-blue)'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-teal)'}
                                >
                                  <BsPencilSquare size={18} />
                                  <span className="font-weight-medium">
                                    {appointment.feedback.given ? 'Edit' : 'Add'}
                                  </span>
                                </Link>
                                {appointment.feedback.given && (
                                  <div className="d-flex align-items-center gap-1 badge-success" style={{ padding: '6px 12px' }}>
                                    <Star size={14} fill="white" />
                                    <span className="font-weight-bold">{appointment.feedback.stars}/5</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;