import React, { useState, useEffect } from "react";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Video, AlertCircle } from "lucide-react";

const TodaysSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        var token = localStorage.getItem("token");
        var decoded = jwt_decode(token);
        const { data } = await Axios.post(
          `${process.env.REACT_APP_SERVER_URL}/doctors/todays-appointments`,
          {
            doctorId: decoded._id,
          }
        );
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <AnimatePresence>
        {appointments.length > 0 ? (
          <div className="row">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="col-12 mb-3"
              >
                <div className="glass-panel p-4 d-flex align-items-center justify-content-between hover-lift transition-all bg-white-glass">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary-gradient rounded-circle p-3 mr-4 text-white shadow-sm">
                      <User size={24} />
                    </div>
                    <div>
                      <h5 className="font-weight-bold mb-1 text-primary">{appointment.patientName}</h5>
                      <div className="d-flex align-items-center text-secondary">
                        <Calendar size={16} className="mr-2" />
                        <span className="mr-3">{appointment.date}</span>
                        <Clock size={16} className="mr-2" />
                        <span>{appointment.slotTime}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {appointment.googleMeetLink ? (
                      <a
                        href={appointment.googleMeetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary-gradient d-flex align-items-center rounded-pill px-4 shadow-sm"
                      >
                        <Video size={18} className="mr-2" />
                        Join Meet
                      </a>
                    ) : (
                      <span className="badge badge-light text-muted px-3 py-2 rounded-pill d-flex align-items-center">
                        <AlertCircle size={16} className="mr-2" />
                        No Link
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-5"
          >
            <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
              <Calendar size={48} className="text-muted" />
            </div>
            <h5 className="text-muted">No appointments scheduled for today.</h5>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodaysSchedule;
