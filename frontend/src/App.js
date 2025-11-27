import React, { useEffect, useState } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import DoctorLogin from "./Pages/DoctorLogin";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PaitentDashboard from "./Pages/PaitentDashboard";
import Error from "./Pages/Error";
import { AuthContext } from "./Auth/AuthContext";
import PhoneNumber from "./components/PhoneNumber";
import PersonalDetails from "./Doctor/PersonalDetails";
import SearchDoctor from "./Patient/SearchDoctor";
import PerviousAppointments from "./Patient/PerviousAppointments";
import Spinner from "react-bootstrap/Spinner";
import Selectdate from "./Patient/Selectdate";
import BookingSlots from "./Doctor/BookingSlots";
import Payment from "./Patient/Payment";
import DocAppointments from "./Doctor/PaymentHistory";
import AppointmentStatus from "./Patient/AppointmentStatus";
import Pfeedback from "./Patient/Feedback";
import FeedbackDetails from "./Doctor/FeedbackDetails";
import HealthTipsManager from "./Doctor/HealthTipsManager";
import QuestionsManager from "./Doctor/QuestionsManager";
import AiAssistantPage from "./Patient/AiAssistantPage";
import SettingsPage from "./Patient/SettingsPage";

function App() {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [googleId, setGoogleId] = useState(
    window.localStorage.getItem("googleId")
  );

  return (
    <Router>
      <AuthContext.Provider value={{ token, setToken, googleId, setGoogleId }}>
        <div className="min-vh-100 d-flex flex-column position-relative">
          <div className="fixed-background" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)'
          }}></div>

          {/* We can include Navbar here if we want it global, but Home.js has its own Navbar. 
              Let's remove Navbar from individual pages and put it here if possible, 
              or just provide the background wrapper. 
              For now, just the background wrapper to ensure consistency. */}

          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/doctorlogin" component={DoctorLogin} />
            <Route exact path="/doctor" component={DoctorDashboard} />
            <Route exact path="/patient/searchdoctor" component={SearchDoctor} />
            <Route exact path="/patient" component={PaitentDashboard} />
            <Route exact path="/patient/update-phone" component={PhoneNumber} />
            <Route
              exact
              path="/patient/previousappointments"
              component={PerviousAppointments}
            />
            <Route
              exact
              path="/doctor/perosnaldetails"
              component={PersonalDetails}
            />
            <Route
              exact
              path="/doctor/payment-history"
              component={DocAppointments}
            />
            <Route
              exact
              path="/doctor/feedback/:id"
              component={FeedbackDetails}
            />
            <Route
              exact
              path="/doctor/health-tips"
              component={HealthTipsManager}
            />
            <Route
              exact
              path="/doctor/questions"
              component={QuestionsManager}
            />

            <Route exact path="/patient/selectdate" component={Selectdate} />
            <Route exact path="/patient/book-slot" component={BookingSlots} />
            <Route exact path="/patient/ai-assistant" component={AiAssistantPage} />
            <Route exact path="/patient/settings" component={SettingsPage} />
            <Route exact path="/patient/payment" component={Payment} />
            <Route
              exact
              path="/patient/appointment-status"
              component={AppointmentStatus}
            />
            <Route exact path="/patient/feedback/:id" component={Pfeedback} />

            <Route path="*">
              <Error />
            </Route>
          </Switch>
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
