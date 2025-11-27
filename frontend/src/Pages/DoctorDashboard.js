import React from "react";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsideDoctor";
import TodaysSchedule from "../Doctor/TodaysSchedule";
import { motion } from "framer-motion";

const DoctorDashboard = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
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
              transition={{ duration: 0.5 }}
              className="glass-panel p-4 h-100"
            >
              <h4 className="font-weight-bold mb-4 text-primary">Today's Schedule</h4>
              <TodaysSchedule />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
