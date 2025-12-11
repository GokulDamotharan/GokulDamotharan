import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
    Clock, Plus, Trash2, Power, PowerOff, Calendar as CalendarIcon,
    CheckCircle, XCircle, AlertCircle, Lock, User
} from 'lucide-react';
import Navbar from '../Basic/Navbar';
import LeftsideDoctor from '../Dashbaord/LeftsideDoctor';
import { AuthContext } from '../Auth/AuthContext';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import '../index.css';

const TimeSlotManager = () => {
    const { token } = useContext(AuthContext);
    const history = useHistory();
    const [doctorId, setDoctorId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [dateId, setDateId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newSlotTime, setNewSlotTime] = useState('');
    const [showAddSlot, setShowAddSlot] = useState(false);

    useEffect(() => {
        if (!token) {
            history.push('/doctorlogin');
            return;
        }
        
        const decoded = jwt_decode(token);
        setDoctorId(decoded._id);
    }, [token, history]);

    useEffect(() => {
        if (doctorId && selectedDate) {
            fetchSlotsForDate();
        }
    }, [doctorId, selectedDate]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchSlotsForDate = async () => {
        setLoading(true);
        try {
            const dateStr = formatDate(selectedDate);
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/doctors/my-slots`,
                {
                    params: {
                        doctorId: doctorId,
                        date: dateStr
                    }
                }
            );

            if (response.data.dates && response.data.dates.length > 0) {
                const dateData = response.data.dates[0];
                setSlots(dateData.slots || []);
                setDateId(dateData._id);
            } else {
                setSlots([]);
                setDateId(null);
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setSlots([]);
            setDateId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async () => {
        if (!newSlotTime) {
            toast.error('Please enter a time');
            return;
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(newSlotTime)) {
            toast.error('Invalid time format. Use HH:MM (e.g., 09:00)');
            return;
        }

        try {
            const dateStr = formatDate(selectedDate);
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/doctors/add-slots`,
                {
                    doctorId: doctorId,
                    date: dateStr,
                    slots: [{ time: newSlotTime }]
                }
            );

            toast.success(response.data.message);
            setNewSlotTime('');
            setShowAddSlot(false);
            fetchSlotsForDate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add slot');
        }
    };

    const handleToggleAvailability = async (slot) => {
        if (slot.isBooked) {
            toast.warning('Cannot modify booked slot');
            return;
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/doctors/toggle-slot-availability`,
                {
                    doctorId: doctorId,
                    dateId: dateId,
                    slotId: slot._id,
                    isAvailable: !slot.isAvailable
                }
            );

            toast.success(response.data.message);
            fetchSlotsForDate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to toggle availability');
        }
    };

    const handleDeleteSlot = async (slot) => {
        let cancellationReason = '';

        // If slot is booked, require cancellation reason
        if (slot.isBooked) {
            cancellationReason = window.prompt(
                `This slot is booked by ${slot.patientName}.\n\n` +
                `Please provide a cancellation reason (minimum 10 characters):\n` +
                `The patient will be notified with this reason.`
            );

            if (cancellationReason === null) {
                // User cancelled the prompt
                return;
            }

            if (!cancellationReason || cancellationReason.trim().length < 10) {
                toast.error('Cancellation reason must be at least 10 characters');
                return;
            }
        } else {
            // For unbooked slots, just confirm deletion
            if (!window.confirm(`Are you sure you want to delete the ${formatTime(slot.time)} slot?`)) {
                return;
            }
        }

        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_SERVER_URL}/doctors/remove-slot`,
                {
                    data: {
                        doctorId: doctorId,
                        dateId: dateId,
                        slotId: slot._id,
                        cancellationReason: cancellationReason || undefined
                    }
                }
            );

            toast.success(response.data.message);
            if (response.data.wasBooked) {
                toast.info(`Patient ${response.data.patientName} will be notified about the cancellation`);
            }
            fetchSlotsForDate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete slot');
        }
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getSlotStatus = (slot) => {
        if (slot.isBooked) {
            return {
                label: 'Booked',
                color: '#4FACFE',
                bg: 'rgba(79, 172, 254, 0.1)',
                icon: Lock
            };
        } else if (!slot.isAvailable) {
            return {
                label: 'Unavailable',
                color: '#FF6B9D',
                bg: 'rgba(255, 107, 157, 0.1)',
                icon: PowerOff
            };
        } else {
            return {
                label: 'Available',
                color: '#43E97B',
                bg: 'rgba(67, 233, 123, 0.1)',
                icon: CheckCircle
            };
        }
    };

    const addQuickSlots = async () => {
        const quickSlots = [];
        for (let hour = 9; hour <= 17; hour++) {
            quickSlots.push({ time: `${String(hour).padStart(2, '0')}:00` });
        }

        try {
            const dateStr = formatDate(selectedDate);
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/doctors/add-slots`,
                {
                    doctorId: doctorId,
                    date: dateStr,
                    slots: quickSlots
                }
            );

            toast.success(`Added ${response.data.addedSlots} slots (9 AM - 5 PM)`);
            fetchSlotsForDate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add quick slots');
        }
    };

    const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-fluid flex-grow-1">
                <div className="row h-100">
                    <div className="col-md-3 col-lg-2 d-none d-md-block p-0">
                        <LeftsideDoctor />
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
                                    Manage Time Slots
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Add, edit, and manage your availability schedule
                                </p>
                            </div>

                            <div className="row">
                                {/* Calendar Section */}
                                <div className="col-lg-5 mb-4">
                                    <div className="glass-panel p-4">
                                        <h5 className="mb-3 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                                            <CalendarIcon size={20} className="me-2" />
                                            Select Date
                                        </h5>
                                        <Calendar
                                            onChange={setSelectedDate}
                                            value={selectedDate}
                                            minDate={new Date()}
                                            className="modern-calendar"
                                        />
                                        
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-3 p-3 text-center"
                                            style={{
                                                background: 'var(--gradient-primary)',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                        >
                                            <small style={{ opacity: 0.9 }}>Selected Date</small>
                                            <h6 className="mb-0 mt-1 font-weight-bold">
                                                {selectedDate.toLocaleDateString('en-US', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </h6>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Slots Management Section */}
                                <div className="col-lg-7">
                                    <div className="glass-panel p-4 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                                                Time Slots ({slots.length})
                                            </h5>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm d-flex align-items-center gap-1"
                                                    onClick={addQuickSlots}
                                                    style={{
                                                        background: 'var(--glass-bg)',
                                                        border: '1px solid var(--glass-border)',
                                                        color: 'var(--color-text-primary)',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <Clock size={14} />
                                                    Quick Add (9-5)
                                                </button>
                                                <button
                                                    className="btn btn-sm d-flex align-items-center gap-1"
                                                    onClick={() => setShowAddSlot(!showAddSlot)}
                                                    style={{
                                                        background: 'var(--gradient-primary)',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <Plus size={14} />
                                                    Add Slot
                                                </button>
                                            </div>
                                        </div>

                                        {/* Add Slot Form */}
                                        <AnimatePresence>
                                            {showAddSlot && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mb-3 p-3"
                                                    style={{
                                                        background: 'var(--glass-bg)',
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--glass-border)'
                                                    }}
                                                >
                                                    <label className="form-label" style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                                                        Time (24-hour format)
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <input
                                                            type="time"
                                                            className="form-control glass-input"
                                                            value={newSlotTime}
                                                            onChange={(e) => setNewSlotTime(e.target.value)}
                                                            placeholder="HH:MM"
                                                        />
                                                        <button
                                                            className="btn"
                                                            onClick={handleAddSlot}
                                                            style={{
                                                                background: 'var(--gradient-secondary)',
                                                                border: 'none',
                                                                color: 'white',
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                    <small style={{ color: 'var(--color-text-light)' }}>
                                                        Example: 09:00, 14:30
                                                    </small>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Slots Grid */}
                                    {loading ? (
                                        <div className="glass-panel p-5 text-center">
                                            <div className="spinner-border" style={{ color: 'var(--color-teal)' }} role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <p className="mt-3" style={{ color: 'var(--color-text-secondary)' }}>Loading slots...</p>
                                        </div>
                                    ) : slots.length === 0 ? (
                                        <div className="glass-panel p-5 text-center">
                                            <Clock size={48} style={{ color: 'var(--color-text-light)', opacity: 0.5 }} />
                                            <h5 className="mt-3" style={{ color: 'var(--color-text-primary)' }}>No Slots Added</h5>
                                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                                Add time slots for this date to start accepting appointments
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="row">
                                            {slots.map((slot, index) => {
                                                const status = getSlotStatus(slot);
                                                const StatusIcon = status.icon;
                                                
                                                return (
                                                    <div key={slot._id} className="col-md-6 mb-3">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="glass-panel p-3"
                                                            style={{
                                                                opacity: slot.isBooked || !slot.isAvailable ? 0.7 : 1
                                                            }}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <Clock size={20} style={{ color: status.color }} />
                                                                    <h6 className="mb-0 font-weight-bold" style={{ 
                                                                        color: 'var(--color-text-primary)',
                                                                        textDecoration: !slot.isAvailable && !slot.isBooked ? 'line-through' : 'none'
                                                                    }}>
                                                                        {formatTime(slot.time)}
                                                                    </h6>
                                                                </div>
                                                                <StatusIcon size={18} style={{ color: status.color }} />
                                                            </div>

                                                            <div className="mb-2">
                                                                <span
                                                                    className="px-2 py-1 rounded-pill d-inline-block"
                                                                    style={{
                                                                        background: status.bg,
                                                                        color: status.color,
                                                                        border: `1px solid ${status.color}`,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    {status.label}
                                                                </span>
                                                            </div>

                                                            {slot.isBooked && slot.patientName && (
                                                                <div className="mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                                                                    <User size={14} style={{ color: 'var(--color-text-light)' }} />
                                                                    <span style={{ color: 'var(--color-text-secondary)' }}>
                                                                        {slot.patientName}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            <div className="d-flex gap-2 mt-2">
                                                                {!slot.isBooked ? (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                                                                            onClick={() => handleToggleAvailability(slot)}
                                                                            style={{
                                                                                background: slot.isAvailable ? 'rgba(255, 107, 157, 0.1)' : 'rgba(67, 233, 123, 0.1)',
                                                                                border: `1px solid ${slot.isAvailable ? '#FF6B9D' : '#43E97B'}`,
                                                                                color: slot.isAvailable ? '#FF6B9D' : '#43E97B',
                                                                                padding: '4px 8px',
                                                                                borderRadius: '6px',
                                                                                fontSize: '0.75rem'
                                                                            }}
                                                                        >
                                                                            {slot.isAvailable ? <PowerOff size={12} /> : <Power size={12} />}
                                                                            {slot.isAvailable ? 'Disable' : 'Enable'}
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm d-flex align-items-center justify-content-center"
                                                                            onClick={() => handleDeleteSlot(slot)}
                                                                            style={{
                                                                                background: 'rgba(255, 107, 157, 0.1)',
                                                                                border: '1px solid #FF6B9D',
                                                                                color: '#FF6B9D',
                                                                                padding: '4px 8px',
                                                                                borderRadius: '6px'
                                                                            }}
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex-grow-1 text-center" style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                                                                            <Lock size={12} className="me-1" />
                                                                            Booked
                                                                        </div>
                                                                        <button
                                                                            className="btn btn-sm d-flex align-items-center justify-content-center gap-1"
                                                                            onClick={() => handleDeleteSlot(slot)}
                                                                            style={{
                                                                                background: 'rgba(255, 107, 157, 0.1)',
                                                                                border: '1px solid #FF6B9D',
                                                                                color: '#FF6B9D',
                                                                                padding: '4px 8px',
                                                                                borderRadius: '6px',
                                                                                fontSize: '0.75rem'
                                                                            }}
                                                                            title="Cancel appointment (requires reason)"
                                                                        >
                                                                            <AlertCircle size={12} />
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
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
                    padding: 15px 8px !important;
                    background: var(--glass-bg) !important;
                    border: 1px solid var(--glass-border) !important;
                    color: var(--color-text-primary) !important;
                    border-radius: 8px !important;
                    margin: 3px !important;
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
                    font-size: 0.7rem !important;
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

export default TimeSlotManager;
