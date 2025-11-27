import React from 'react';
import { Clock, Calendar, MapPin, MoreHorizontal } from 'lucide-react';

const AppointmentTimeline = () => {
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Wilson",
      specialty: "Cardiologist",
      time: "09:00 AM",
      date: "Today",
      status: "Upcoming",
      type: "Check-up",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      doctor: "Dr. James Chen",
      specialty: "Dermatologist",
      time: "02:30 PM",
      date: "Tomorrow",
      status: "Confirmed",
      type: "Consultation",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      doctor: "Dr. Emily Parker",
      specialty: "Neurologist",
      time: "10:00 AM",
      date: "Nov 24",
      status: "Pending",
      type: "Follow-up",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="font-weight-bold m-0 text-dark">Upcoming Schedule</h5>
        <button className="btn btn-sm btn-light rounded-pill px-3 font-weight-bold text-primary">View All</button>
      </div>

      <div className="timeline-container">
        {appointments.map((apt, index) => (
          <div key={apt.id} className="d-flex mb-4 position-relative">
            {/* Timeline Line */}
            {index !== appointments.length - 1 && (
              <div className="position-absolute" style={{ 
                left: 24, 
                top: 50, 
                bottom: -20, 
                width: 2, 
                background: 'rgba(0,0,0,0.05)' 
              }}></div>
            )}

            <div className="mr-3">
              <img 
                src={apt.avatar} 
                alt={apt.doctor} 
                className="rounded-circle shadow-sm" 
                style={{ width: 48, height: 48, objectFit: 'cover', border: '2px solid white' }} 
              />
            </div>

            <div className="flex-grow-1 p-3 rounded-xl bg-white shadow-sm border border-light position-relative hover-lift transition-all">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="font-weight-bold mb-1 text-dark">{apt.doctor}</h6>
                  <p className="text-primary small mb-0 font-weight-bold">{apt.specialty}</p>
                </div>
                <span className={`badge badge-pill py-2 px-3 ${
                  apt.status === 'Upcoming' ? 'bg-soft-primary text-primary' :
                  apt.status === 'Confirmed' ? 'bg-soft-success text-success' : 'bg-soft-warning text-warning'
                }`} style={{ 
                  background: apt.status === 'Upcoming' ? 'rgba(31, 142, 255, 0.1)' : 
                              apt.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: apt.status === 'Upcoming' ? 'var(--color-aqua)' : 
                         apt.status === 'Confirmed' ? 'var(--color-success)' : 'var(--color-warning)'
                }}>
                  {apt.status}
                </span>
              </div>

              <div className="d-flex align-items-center gap-3 mt-3">
                <div className="d-flex align-items-center text-secondary small">
                  <Clock size={14} className="mr-1" />
                  {apt.time}
                </div>
                <div className="d-flex align-items-center text-secondary small">
                  <Calendar size={14} className="mr-1" />
                  {apt.date}
                </div>
                <div className="d-flex align-items-center text-secondary small ml-auto">
                  <MapPin size={14} className="mr-1" />
                  Clinic A
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentTimeline;
