import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../Basic/Navbar';
import Leftside from '../Dashbaord/LeftsidePatient';

const SettingsPage = () => {
  const [dashboardSettings, setDashboardSettings] = useState({
    showWelcomeBlock: true,
    showStatsCards: true,
    showAppointmentTimeline: true,
    showAiRecommendations: true,
    showDoctorHeatmap: true,
    showAnalyticsChart: true,
    showHealthTips: true,
  });

  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      setDashboardSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (key) => {
    setDashboardSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('dashboardSettings', JSON.stringify(dashboardSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      showWelcomeBlock: true,
      showStatsCards: true,
      showAppointmentTimeline: true,
      showAiRecommendations: true,
      showDoctorHeatmap: true,
      showAnalyticsChart: true,
      showHealthTips: true,
    };
    setDashboardSettings(defaultSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(defaultSettings));
    setSaved(false);
  };

  const widgets = [
    { key: 'showWelcomeBlock', label: 'Welcome Block', description: 'Personalized greeting and quick stats' },
    { key: 'showStatsCards', label: 'Statistics Cards', description: 'Key metrics at a glance' },
    { key: 'showAppointmentTimeline', label: 'Appointment Timeline', description: 'Upcoming appointments list' },
    { key: 'showAiRecommendations', label: 'AI Recommendations', description: 'Smart scheduling insights' },
    { key: 'showDoctorHeatmap', label: 'Doctor Availability Heatmap', description: 'Visual availability calendar' },
    { key: 'showAnalyticsChart', label: 'Analytics Chart', description: 'Health trends and metrics' },
    { key: 'showHealthTips', label: 'Health Tips Banner', description: 'Doctor-posted health advice' },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
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
              className="glass-panel p-4"
            >
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center">
                  <div className="bg-primary-gradient rounded-circle p-3 mr-3 text-white">
                    <SettingsIcon size={28} />
                  </div>
                  <div>
                    <h4 className="font-weight-bold mb-1 text-primary">Dashboard Settings</h4>
                    <p className="text-muted small mb-0">Customize your dashboard layout and widgets</p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-secondary rounded-pill px-4 d-flex align-items-center"
                    onClick={handleReset}
                  >
                    <RotateCcw size={18} className="mr-2" /> Reset
                  </button>
                  <button 
                    className="btn btn-primary rounded-pill px-4 d-flex align-items-center"
                    onClick={handleSave}
                  >
                    <Save size={18} className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="alert alert-success rounded-pill text-center mb-4"
                >
                  ✓ Settings saved successfully!
                </motion.div>
              )}

              {/* Widget Toggles */}
              <div className="row">
                <div className="col-12">
                  <h5 className="font-weight-bold mb-3">Dashboard Widgets</h5>
                  <p className="text-muted small mb-4">Toggle widgets on or off to customize your dashboard view</p>
                  
                  <div className="d-flex flex-column gap-3">
                    {widgets.map((widget) => (
                      <motion.div
                        key={widget.key}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-light d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle p-2 mr-3 ${dashboardSettings[widget.key] ? 'bg-success' : 'bg-secondary'}`}>
                            {dashboardSettings[widget.key] ? (
                              <Eye size={20} className="text-white" />
                            ) : (
                              <EyeOff size={20} className="text-white" />
                            )}
                          </div>
                          <div>
                            <h6 className="font-weight-bold mb-1">{widget.label}</h6>
                            <p className="text-muted small mb-0">{widget.description}</p>
                          </div>
                        </div>
                        <div className="custom-control custom-switch" style={{ transform: 'scale(1.3)' }}>
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={widget.key}
                            checked={dashboardSettings[widget.key]}
                            onChange={() => handleToggle(widget.key)}
                          />
                          <label className="custom-control-label" htmlFor={widget.key}></label>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Note */}
              <div className="mt-4 p-3 bg-light rounded-xl">
                <p className="text-muted small mb-0">
                  <strong>Note:</strong> Changes will take effect on your dashboard after saving. Navigate to the Dashboard to see your customized layout.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
