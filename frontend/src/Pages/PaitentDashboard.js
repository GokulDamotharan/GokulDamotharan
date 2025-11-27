import React, { useContext, useState, useEffect } from "react";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsidePatient";
import Axios from "axios";
import { AuthContext } from "../Auth/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, Activity } from "lucide-react";

const PersonalDetails = () => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const { googleId } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const getPatientDetails = async () => {
      try {
        const res = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}/patients/getPatientDetails/${googleId}`
        );
        if (res.status === 200) {
          setPatient(res.data);
          window.localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching patient details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (googleId) getPatientDetails();
  }, [googleId]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-0">
            <Leftside />
          </div>

          <div className="col-md-9 col-lg-10 p-4">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-5"
              >
                <div className="d-flex align-items-center mb-5 border-bottom border-light pb-4">
                  <div className="position-relative mr-4">
                    <img
                      src={patient.picture}
                      className="rounded-circle shadow-lg"
                      style={{ width: "100px", height: "100px", objectFit: "cover", border: "4px solid white" }}
                      alt="Profile"
                    />
                    <div className="position-absolute bg-success rounded-circle border border-white" style={{ width: 20, height: 20, bottom: 5, right: 5 }}></div>
                  </div>
                  <div>
                    <h2 className="font-weight-bold mb-1 text-primary">{patient.name}</h2>
                    <p className="text-secondary mb-0">Patient ID: {patient._id?.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <h4 className="font-weight-bold mb-4 d-flex align-items-center">
                  <Activity className="mr-2 text-primary" size={24} />
                  Personal Information
                </h4>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="p-3 rounded bg-white shadow-sm d-flex align-items-center h-100">
                      <div className="bg-light rounded-circle p-3 mr-3">
                        <Mail className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block text-uppercase font-weight-bold" style={{ fontSize: '0.7rem' }}>Email Address</small>
                        <span className="font-weight-medium">{patient.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <div className="p-3 rounded bg-white shadow-sm d-flex align-items-center h-100">
                      <div className="bg-light rounded-circle p-3 mr-3">
                        <Phone className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block text-uppercase font-weight-bold" style={{ fontSize: '0.7rem' }}>Phone Number</small>
                        <span className="font-weight-medium">{patient.phoneNumber || "Not provided"}</span>
                      </div>
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
export default PersonalDetails;
