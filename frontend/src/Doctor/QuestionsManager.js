import React, { useState, useEffect } from "react";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsideDoctor";
import { motion } from "framer-motion";
import { MessageSquare, Check, X, AlertCircle } from "lucide-react";

const QuestionsManager = () => {
  const [questions, setQuestions] = useState([]);
  const [answerInput, setAnswerInput] = useState({});
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
    const fetchQuestions = async () => {
      try {
        const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/questions/pending`);
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDoctor = async () => {
        try {
            const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/doctors/getDoctorDetails/${doctorId}`);
            setDoctor(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    fetchQuestions();
    if(doctorId) fetchDoctor();
  }, [doctorId]);

  const handleAnswerChange = (id, value) => {
    setAnswerInput(prev => ({ ...prev, [id]: value }));
  };

  const handleAnswer = async (id) => {
    try {
      await Axios.post(`${process.env.REACT_APP_SERVER_URL}/questions/answer/${id}`, {
        answer: answerInput[id],
        doctorName: doctor.name || "Dr. Unknown"
      });
      setQuestions(prev => prev.filter(q => q._id !== id));
      alert("Question Answered!");
    } catch (err) {
      console.error(err);
      alert("Error answering question");
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Are you sure you want to reject this question?")) return;
    try {
      await Axios.post(`${process.env.REACT_APP_SERVER_URL}/questions/reject/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error rejecting question");
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
                <MessageSquare className="mr-2" /> Patient Questions
              </h4>

              <div className="row">
                {questions.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">No pending questions.</p>
                    </div>
                ) : (
                    questions.map((q) => (
                        <div key={q._id} className="col-12 mb-3">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-light">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <span className={`badge badge-pill ${q.aiClassification.includes('Medical') ? 'badge-success' : 'badge-warning'}`}>
                                        AI: {q.aiClassification}
                                    </span>
                                    <small className="text-muted">{new Date(q.date).toLocaleDateString()}</small>
                                </div>
                                <h5 className="font-weight-bold text-dark mb-3">"{q.content}"</h5>
                                
                                <div className="form-group">
                                    <textarea 
                                        className="form-control bg-light border-0" 
                                        placeholder="Type your answer here..."
                                        rows="3"
                                        value={answerInput[q._id] || ""}
                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-primary btn-sm font-weight-bold d-flex align-items-center"
                                        onClick={() => handleAnswer(q._id)}
                                        disabled={!answerInput[q._id]}
                                    >
                                        <Check size={16} className="mr-1" /> Answer & Approve
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger btn-sm font-weight-bold d-flex align-items-center"
                                        onClick={() => handleReject(q._id)}
                                    >
                                        <X size={16} className="mr-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsManager;
