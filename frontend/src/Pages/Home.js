import React from "react";
import Footer from "../Basic/Footer";
import Navbar from "../Basic/Navbar";
import About from "../Home/About";
import Jumbo from "../Home/Jumbo";
import Card from "../Home/Card";
import { motion } from "framer-motion";
import patientImage from "../image/patientlogin.png";
import doctorImage from "../image/doctorlogin.png";

const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Jumbo />
        
        {/* Login Cards Section */}
        <div id="login-section" className="container my-5 py-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="font-weight-bold mb-3">
              Get Started <span className="text-gradient">Today</span>
            </h2>
            <p className="lead" style={{ color: 'var(--color-text-secondary)' }}>
              Choose your portal to access personalized healthcare services
            </p>
          </motion.div>

          <div className="row justify-content-center g-4">
            <div className="col-md-6 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card login="Patient" Image={patientImage} link="/patient" />
              </motion.div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card login="Doctor" Image={doctorImage} link="/doctorlogin" />
              </motion.div>
            </div>
          </div>
        </div>

        <About />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
