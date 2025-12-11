import React, { useState, useEffect } from "react";
import Axios from "axios";
import Leftside from "../Dashbaord/LeftsidePatient";
import DashboardHeader from "../Dashbaord/components/DashboardHeader";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, AlertCircle } from "lucide-react";

const AppointmentStatus = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                var { data } = await Axios.post(
                    `${process.env.REACT_APP_SERVER_URL}/patients/upcoming-appointments/`,
                    {
                        googleId: localStorage.getItem("googleId"),
                    }
                );
                console.log(data);
                setAppointments(data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

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
                                    <Clock className="text-primary" size={32} />
                                    Upcoming Appointments
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    View and manage your scheduled appointments
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
                                    <h4 style={{ color: 'var(--color-text-primary)' }}>No Upcoming Appointments</h4>
                                    <p style={{ color: 'var(--color-text-secondary)' }}>
                                        You don't have any scheduled appointments at the moment.
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
                                                        <Video size={18} className="mr-2" />
                                                        Meet Link
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
                                                            {appointment.googleMeetLink ? (
                                                                <a
                                                                    href={appointment.googleMeetLink}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="btn-outline d-inline-flex align-items-center gap-2"
                                                                    style={{ 
                                                                        padding: '8px 16px', 
                                                                        fontSize: '0.875rem',
                                                                        textDecoration: 'none'
                                                                    }}
                                                                >
                                                                    <Video size={16} />
                                                                    Join Meet
                                                                </a>
                                                            ) : (
                                                                <span style={{ color: 'var(--color-text-light)' }}>No Link</span>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentStatus;