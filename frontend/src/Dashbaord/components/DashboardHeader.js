import React, { useContext } from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { AuthContext } from '../../Auth/AuthContext';

const DashboardHeader = () => {
  const { googleId } = useContext(AuthContext);
  // Mock user data or fetch from context/local storage
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Gokul" };

  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
      <div>
        <div className="d-flex align-items-center gap-3 mb-1">
          <div className="bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <span style={{ fontSize: 20 }}>🏥</span>
          </div>
          <h4 className="font-weight-bold m-0 text-dark" style={{ letterSpacing: '-0.5px' }}>MediSched</h4>
        </div>
        <p className="text-secondary small mb-0 font-weight-medium" style={{ letterSpacing: '1px' }}>AI HEALTH COMMAND CENTER</p>
      </div>

      <div className="d-flex align-items-center gap-4">
        <div className="position-relative">
          <div className="position-absolute" style={{ 
            top: -5, 
            right: -5, 
            width: 10, 
            height: 10, 
            background: 'var(--color-danger)', 
            borderRadius: '50%',
            border: '2px solid #F8FAFC'
          }}></div>
          <Bell size={20} className="text-secondary" style={{ cursor: 'pointer' }} />
        </div>
        <Settings size={20} className="text-secondary" style={{ cursor: 'pointer' }} />
        
        <div className="d-flex align-items-center gap-3 pl-4 border-left">
          <div className="text-right d-none d-md-block">
            <p className="font-weight-bold mb-0 text-dark" style={{ fontSize: '0.9rem' }}>{user.name}</p>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.75rem' }}>Premium Member</p>
          </div>
          <div className="position-relative">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm overflow-hidden" style={{ width: 45, height: 45 }}>
              {user.picture ? (
                <img src={user.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={20} className="text-secondary" />
              )}
            </div>
            <div className="position-absolute animate-pulse-glow" style={{ 
              bottom: 0, 
              right: 0, 
              width: 12, 
              height: 12, 
              background: 'var(--color-success)', 
              borderRadius: '50%',
              border: '2px solid white'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
