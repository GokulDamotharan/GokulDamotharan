import React, { useState } from "react";
import Leftside from "../Dashbaord/LeftsidePatient";
import DashboardHeader from "../Dashbaord/components/DashboardHeader";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";

const Selectdate = (props) => {
  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
  };
  
  var pervious = new Date();
  pervious.setDate(pervious.getDate() - 1);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container-fluid flex-grow-1 p-0">
        <div className="row h-100 no-gutters">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-3 sticky-top vh-100">
            <Leftside />
          </div>

          <div className="col-md-9 col-lg-10 p-4 overflow-auto" style={{ height: '100vh' }}>
            {/* Header */}
            <DashboardHeader />
            
            <div>
              {/* Header */}
              <div className="mb-4">
                <h2 className="font-weight-bold d-flex align-items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <CalendarIcon size={32} style={{ color: 'var(--color-teal)' }} />
                  Select Appointment Date
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Choose a date for your appointment with Dr. {props.location.doctor?.doctor?.name}
                </p>
              </div>

              {/* Calendar Panel */}
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="glass-panel p-4 mb-4">
                    <div className="d-flex justify-content-center">
                      <div style={{ width: '100%', maxWidth: '600px' }}>
                        <Calendar
                          tileDisabled={({ date }) =>
                            date.getDay() === 0 || date < pervious
                          }
                          onChange={onChange}
                          value={date}
                          className="modern-calendar"
                        />
                        
                        {/* Selected Date Display */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 p-3 text-center"
                          style={{
                            background: 'var(--gradient-primary)',
                            borderRadius: '12px',
                            color: 'white'
                          }}
                        >
                          <small style={{ opacity: 0.9 }}>Selected Date</small>
                          <h4 className="mb-0 mt-1 font-weight-bold">
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h4>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between gap-3">
                    <Link to="/patient/searchdoctor" className="flex-grow-1">
                      <button
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{
                          background: 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--color-text-primary)',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontWeight: '600'
                        }}
                      >
                        <ArrowLeft size={18} />
                        Go Back
                      </button>
                    </Link>

                    <Link
                      to={{
                        pathname: "/patient/book-slot",
                        state: {
                          date: date,
                          doctor: props.location.doctor.doctor,
                        },
                      }}
                      className="flex-grow-1"
                    >
                      <button
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{
                          background: 'var(--gradient-primary)',
                          border: 'none',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontWeight: '600'
                        }}
                      >
                        Continue to Time Slots
                        <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .modern-calendar {
          width: 100% !important;
          border: none !important;
          background: transparent !important;
          font-family: inherit !important;
        }
        
        .modern-calendar .react-calendar__tile {
          padding: 20px 10px !important;
          background: var(--glass-bg) !important;
          border: 1px solid var(--glass-border) !important;
          color: var(--color-text-primary) !important;
          border-radius: 8px !important;
          margin: 4px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-calendar .react-calendar__tile:hover:not(:disabled) {
          background: var(--gradient-secondary) !important;
          color: white !important;
          transform: scale(1.05);
        }
        
        .modern-calendar .react-calendar__tile--active {
          background: var(--gradient-primary) !important;
          color: white !important;
          border-color: transparent !important;
        }
        
        .modern-calendar .react-calendar__tile:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }
        
        .modern-calendar .react-calendar__month-view__weekdays {
          color: var(--color-text-secondary) !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
        }
        
        .modern-calendar .react-calendar__navigation button {
          background: var(--glass-bg) !important;
          border: 1px solid var(--glass-border) !important;
          color: var(--color-text-primary) !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          min-width: 44px !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-calendar .react-calendar__navigation button:hover:not(:disabled) {
          background: var(--gradient-primary) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default Selectdate;
