import React, { useState, useEffect } from "react";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsideDoctor";
import { motion } from "framer-motion";
import { Plus, Send, FileText } from "lucide-react";

const HealthTipsManager = () => {
  const [tips, setTips] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [doctor, setDoctor] = useState({});
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    // Decode token to get doctor ID
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwt_decode(token);
        setDoctorId(decoded._id);
      }
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }, []);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/health-tips/all`);
        setTips(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDoctor = async () => {
        // Fetch doctor details to get name
        try {
            const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/doctors/getDoctorDetails/${doctorId}`);
            setDoctor(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    fetchTips();
    if(doctorId) fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that we have a doctor ID
    if (!doctorId) {
      alert("Error: Doctor ID not found. Please log in again.");
      return;
    }
    
    try {
      await Axios.post(`${process.env.REACT_APP_SERVER_URL}/health-tips/add`, {
        title,
        content,
        doctorId: doctorId,
        doctorName: doctor.name || "Dr. Unknown"
      });
      setTitle("");
      setContent("");
      // Refresh tips
      const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/health-tips/all`);
      setTips(res.data);
      alert("Health Tip Posted!");
    } catch (err) {
      console.error(err);
      alert("Error posting tip: " + (err.response?.data || err.message));
    }
  };

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
              <h4 className="font-weight-bold mb-4 text-primary d-flex align-items-center">
                <FileText className="mr-2" /> Health Tips Manager
              </h4>

              <div className="row">
                <div className="col-md-5">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h5 className="font-weight-bold mb-3">Post New Tip</h5>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label className="font-weight-bold small text-secondary">Title</label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Stay Hydrated"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="font-weight-bold small text-secondary">Content</label>
                        <textarea
                          className="form-control bg-light border-0"
                          rows="5"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your health tip here..."
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block font-weight-bold d-flex align-items-center justify-content-center">
                        <Send size={18} className="mr-2" /> Post Tip
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-md-7">
                  <h5 className="font-weight-bold mb-3">Recent Tips</h5>
                  <div className="d-flex flex-column gap-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {tips.map((tip) => (
                      <div key={tip._id} className="bg-white p-3 rounded-xl shadow-sm border border-light">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="font-weight-bold text-dark mb-1">{tip.title}</h6>
                          <small className="text-muted">{new Date(tip.date).toLocaleDateString()}</small>
                        </div>
                        <p className="text-secondary small mb-2">{tip.content}</p>
                        <small className="text-primary font-weight-bold">By: {tip.doctorName}</small>
                      </div>
                    ))}
                    {tips.length === 0 && (
                      <p className="text-center text-muted my-5">No tips posted yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTipsManager;
