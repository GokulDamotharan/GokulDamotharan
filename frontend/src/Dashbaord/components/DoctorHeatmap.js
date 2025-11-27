import React from 'react';

const DoctorHeatmap = () => {
  // Mock data for heatmap
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['9AM', '11AM', '1PM', '3PM', '5PM'];
  
  // Random intensity for demo
  const getIntensity = () => Math.floor(Math.random() * 4);
  
  const getColor = (intensity) => {
    switch(intensity) {
      case 0: return '#F1F5F9'; // Empty
      case 1: return '#CFFAFE'; // Low
      case 2: return '#67E8F9'; // Medium
      case 3: return '#06B6D4'; // High
      default: return '#F1F5F9';
    }
  };

  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="font-weight-bold m-0 text-dark">Doctor Availability</h5>
        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-light border text-secondary font-weight-normal">Weekly View</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-borderless mb-0">
          <thead>
            <tr>
              <th className="text-secondary font-weight-normal small">Time</th>
              {days.map(day => (
                <th key={day} className="text-center text-secondary font-weight-normal small">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="text-secondary small font-weight-bold align-middle py-2">{time}</td>
                {days.map(day => {
                  const intensity = getIntensity();
                  return (
                    <td key={`${day}-${time}`} className="p-1">
                      <div 
                        className="rounded transition-all hover-scale"
                        style={{ 
                          height: 36, 
                          background: getColor(intensity),
                          cursor: 'pointer',
                          opacity: 0.9
                        }}
                        title={`${day} ${time}: ${intensity === 0 ? 'Unavailable' : 'Available'}`}
                      ></div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="d-flex align-items-center justify-content-end gap-3 mt-3">
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 12, height: 12, background: '#CFFAFE', borderRadius: 2 }}></div>
          <small className="text-secondary">Low</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 12, height: 12, background: '#67E8F9', borderRadius: 2 }}></div>
          <small className="text-secondary">Med</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 12, height: 12, background: '#06B6D4', borderRadius: 2 }}></div>
          <small className="text-secondary">High</small>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeatmap;
