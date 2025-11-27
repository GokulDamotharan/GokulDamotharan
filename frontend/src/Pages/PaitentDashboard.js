import React, { useContext, useState, useEffect } from "react";
import Leftside from "../Dashbaord/LeftsidePatient";
import Axios from "axios";
import { AuthContext } from "../Auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Activity, Bell, Info } from "lucide-react";

// Import new components
import DashboardHeader from "../Dashbaord/components/DashboardHeader";
import StatsCard from "../Dashbaord/components/StatsCard";
import AppointmentTimeline from "../Dashbaord/components/AppointmentTimeline";
import AiRecommendations from "../Dashbaord/components/AiRecommendations";
import DoctorHeatmap from "../Dashbaord/components/DoctorHeatmap";
import AnalyticsChart from "../Dashbaord/components/AnalyticsChart";

const PaitentDashboard = () => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const [healthTips, setHealthTips] = useState([]);
  const { googleId } = useContext(AuthContext);
  
  // Load dashboard settings from localStorage
  const [dashboardSettings, setDashboardSettings] = useState({
    showWelcomeBlock: true,
    showStatsCards: true,
    showAppointmentTimeline: true,
    showAiRecommendations: true,
    showDoctorHeatmap: true,
    showAnalyticsChart: true,
    showHealthTips: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      setDashboardSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [patientRes, tipsRes] = await Promise.all([
          Axios.get(`${process.env.REACT_APP_SERVER_URL}/patients/getPatientDetails/${googleId}`),
          Axios.get(`${process.env.REACT_APP_SERVER_URL}/health-tips/all`)
        ]);

        if (patientRes.status === 200) {
          setPatient(patientRes.data);
          window.localStorage.setItem("user", JSON.stringify(patientRes.data));
        }
        setHealthTips(tipsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (googleId) fetchData();
  }, [googleId]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container-fluid flex-grow-1 p-0">
        <div className="row h-100 no-gutters">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 d-none d-md-block p-3 sticky-top vh-100">
            <Leftside />
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 p-4 overflow-auto" style={{ height: '100vh' }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container-fluid px-0"
              >
                {/* Header */}
                <DashboardHeader />

                {/* Health Tips Broadcast */}
                {dashboardSettings.showHealthTips && healthTips.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-white rounded-xl shadow-sm p-3 border-left border-primary" style={{ borderLeftWidth: '4px' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Info size={18} className="text-primary" />
                        <h6 className="font-weight-bold m-0 text-primary">Doctor's Health Tip</h6>
                      </div>
                      <p className="mb-1 font-weight-medium text-dark">{healthTips[0].title}</p>
                      <p className="mb-0 text-secondary small">{healthTips[0].content}</p>
                      <small className="text-muted mt-1 d-block">Posted by {healthTips[0].doctorName}</small>
                    </div>
                  </div>
                )}

                {/* Welcome Section */}
                {dashboardSettings.showWelcomeBlock && (
                  <div className="mb-5 position-relative overflow-hidden rounded-2xl p-5 text-white shadow-lg" style={{ 
                    background: 'var(--gradient-primary)',
                    borderRadius: '32px'
                  }}>
                    <div className="position-absolute" style={{ 
                      top: -50, right: -50, width: 300, height: 300, 
                      background: 'rgba(255,255,255,0.1)', borderRadius: '50%' 
                    }}></div>
                    <div className="position-absolute" style={{ 
                      bottom: -30, left: 50, width: 150, height: 150, 
                      background: 'rgba(255,255,255,0.1)', borderRadius: '50%' 
                    }}></div>
                    
                    <div className="position-relative z-10">
                      <h1 className="font-weight-bold mb-2">Good Evening, {patient.name?.split(' ')[0]}</h1>
                      <p className="lead mb-4" style={{ opacity: 0.9 }}>Your AI assistant has optimized your schedule for today.</p>
                      
                      <div className="d-flex gap-4">
                        <div className="d-flex align-items-center gap-2 bg-white-20 rounded-pill px-3 py-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <Bell size={16} />
                          <span className="small font-weight-bold">2 New Notifications</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 bg-white-20 rounded-pill px-3 py-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <Activity size={16} />
                          <span className="small font-weight-bold">Health Score: 98%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                {dashboardSettings.showStatsCards && (
                  <div className="row mb-4">
                    <div className="col-md-3 mb-4 mb-md-0">
                      <StatsCard 
                        title="Today's Appointments" 
                        value="2" 
                        icon={Calendar} 
                        color="#18C5D2" 
                        delay={0.1}
                      />
                    </div>
                    <div className="col-md-3 mb-4 mb-md-0">
                      <StatsCard 
                        title="Active Doctors" 
                        value="14" 
                        icon={Users} 
                        color="#1F8EFF" 
                        trend={12}
                        delay={0.2}
                      />
                    </div>
                    <div className="col-md-3 mb-4 mb-md-0">
                      <StatsCard 
                        title="New Patients" 
                        value="85" 
                        icon={Activity} 
                        color="#8B5CF6" 
                        trend={5}
                        delay={0.3}
                      />
                    </div>
                    <div className="col-md-3">
                      <StatsCard 
                        title="AI Alerts" 
                        value="3" 
                        icon={Bell} 
                        color="#F59E0B" 
                        delay={0.4}
                      />
                    </div>
                  </div>
                )}

                {/* Main Dashboard Grid */}
                <div className="row mb-4">
                  <div className="col-lg-8">
                    <div className="row h-100">
                      {dashboardSettings.showDoctorHeatmap && (
                        <div className="col-12 mb-4">
                          <DoctorHeatmap />
                        </div>
                      )}
                      {dashboardSettings.showAnalyticsChart && (
                        <div className="col-12">
                          <AnalyticsChart />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="d-flex flex-column gap-4 h-100">
                      {dashboardSettings.showAppointmentTimeline && (
                        <div className="flex-grow-1">
                          <AppointmentTimeline />
                        </div>
                      )}
                      {dashboardSettings.showAiRecommendations && (
                        <div>
                          <AiRecommendations />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaitentDashboard;
