import React from 'react';

const AnalyticsChart = () => {
  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="font-weight-bold m-0 text-dark">Health Trends</h5>
        <select className="custom-select custom-select-sm w-auto border-0 bg-light rounded-pill px-3 font-weight-bold text-secondary">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="position-relative" style={{ height: 200 }}>
        {/* Simple CSS Bar Chart for visual */}
        <div className="d-flex align-items-end justify-content-between h-100 px-2">
          {[40, 65, 45, 80, 55, 90].map((height, i) => (
            <div key={i} className="d-flex flex-column align-items-center gap-2" style={{ width: '10%' }}>
              <div 
                className="w-100 rounded-top transition-all"
                style={{ 
                  height: `${height}%`, 
                  background: i === 5 ? 'var(--gradient-primary)' : '#E2E8F0',
                  opacity: i === 5 ? 1 : 0.7,
                  borderRadius: '8px 8px 0 0'
                }}
              ></div>
              <span className="text-secondary small font-weight-bold">
                {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
              </span>
            </div>
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: -1 }}>
          <div className="border-bottom border-light w-100" style={{ height: '25%' }}></div>
          <div className="border-bottom border-light w-100" style={{ height: '25%' }}></div>
          <div className="border-bottom border-light w-100" style={{ height: '25%' }}></div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4 pt-3 border-top border-light">
        <div>
          <p className="text-secondary small mb-0">Total Visits</p>
          <h4 className="font-weight-bold text-dark m-0">24</h4>
        </div>
        <div>
          <p className="text-secondary small mb-0">Cancellations</p>
          <h4 className="font-weight-bold text-danger m-0">2</h4>
        </div>
        <div>
          <p className="text-secondary small mb-0">Avg. Wait</p>
          <h4 className="font-weight-bold text-success m-0">12m</h4>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
