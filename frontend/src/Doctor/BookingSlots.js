import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Basic/Navbar";
import LeftsidePatient from "../Dashbaord/LeftsidePatient";
import Axios from "axios";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";

const BookingSlots = (props) => {
  const { date, doctor } = props.location.state;
  const [dateId, setdateId] = useState();
  const [Slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDate = async (dateToPost) => {
      try {
        const { data } = await Axios.post(
          `${process.env.REACT_APP_SERVER_URL}/doctors/get-slots/`,
          {
            doctorId: doctor._id,
            date: dateToPost
          }
        );
        console.log(data);
        setdateId(data._id);
        setSlots(data.slots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };

    function getDateString() {
      let finalDate = date.getFullYear().toString()
      const month = date.getMonth() + 1
      const day = date.getDate();
  
      if(month < 10) {
        finalDate += ('-0' + month.toString())
      }
      else {
        finalDate += '-' + month.toString()
      }
  
      if(day < 10) {
        finalDate += ('-0' + day.toString())
      }
      else {
        finalDate += '-' + day.toString()
      }
  
      return finalDate
    }
    const dateToSend = getDateString()
    fetchDate(dateToSend);
  }, []);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-0">
            <LeftsidePatient />
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
                  <Clock size={32} style={{ color: 'var(--color-teal)' }} />
                  Select Time Slot
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Choose an available time slot for your appointment with Dr. {doctor.name}
                </p>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <CalendarIcon size={18} style={{ color: 'var(--color-teal)' }} />
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Slots Grid */}
              <div className="row">
                <div className="col-lg-10 mx-auto">
                  {loading ? (
                    <div className="glass-panel p-5 text-center">
                      <div className="spinner-border" style={{ color: 'var(--color-teal)' }} role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p className="mt-3" style={{ color: 'var(--color-text-secondary)' }}>Loading available slots...</p>
                    </div>
                  ) : (
                    <div className="row">
                      {Slots.map((slot, index) => (
                        <div key={slot._id} className="col-md-6 col-lg-4 mb-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={!slot.isBooked ? { scale: 1.03, y: -4 } : {}}
                            className="glass-panel p-4 h-100"
                            style={{
                              cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                              opacity: slot.isBooked ? 0.6 : 1,
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Time Display */}
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center gap-2">
                                <Clock size={24} style={{ color: slot.isBooked ? 'var(--color-text-light)' : 'var(--color-teal)' }} />
                                <h4 className="mb-0 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                                  {formatTime(slot.time)}
                                </h4>
                              </div>
                              {slot.isBooked ? (
                                <XCircle size={24} style={{ color: '#FF6B9D' }} />
                              ) : (
                                <CheckCircle size={24} style={{ color: '#43E97B' }} />
                              )}
                            </div>

                            {/* Status */}
                            <div className="mb-3">
                              <span
                                className="px-3 py-1 rounded-pill d-inline-block"
                                style={{
                                  background: slot.isBooked ? 'rgba(255, 107, 157, 0.1)' : 'rgba(67, 233, 123, 0.1)',
                                  color: slot.isBooked ? '#FF6B9D' : '#43E97B',
                                  border: `1px solid ${slot.isBooked ? '#FF6B9D' : '#43E97B'}`,
                                  fontSize: '0.85rem',
                                  fontWeight: '600'
                                }}
                              >
                                {slot.isBooked ? 'Booked' : 'Available'}
                              </span>
                            </div>

                            {/* Action Button */}
                            {slot.isBooked ? (
                              <button
                                className="btn w-100"
                                disabled
                                style={{
                                  background: 'var(--glass-bg)',
                                  border: '1px solid var(--glass-border)',
                                  color: 'var(--color-text-light)',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  cursor: 'not-allowed'
                                }}
                              >
                                Not Available
                              </button>
                            ) : (
                              <Link
                                to={{
                                  pathname: "/patient/payment",
                                  data: {
                                    dateId: dateId,
                                    doctor: doctor,
                                    slotId: slot._id,
                                  },
                                }}
                                className="w-100"
                              >
                                <button
                                  className="btn w-100"
                                  style={{
                                    background: 'var(--gradient-primary)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontWeight: '600'
                                  }}
                                >
                                  Book This Slot
                                </button>
                              </Link>
                            )}
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Slots Message */}
                  {!loading && Slots.length === 0 && (
                    <div className="glass-panel p-5 text-center">
                      <Clock size={48} style={{ color: 'var(--color-text-light)', opacity: 0.5 }} />
                      <h5 className="mt-3" style={{ color: 'var(--color-text-primary)' }}>No Slots Available</h5>
                      <p style={{ color: 'var(--color-text-secondary)' }}>
                        Please select a different date
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSlots;
