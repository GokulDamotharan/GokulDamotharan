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
import Pfeedback from './Patient/Feedback';
import FeedbackDetails from './Doctor/FeedbackDetails';

function App() {
	const [token, setToken] = useState(window.localStorage.getItem("token"));
	const [googleId, setGoogleId] = useState(
		window.localStorage.getItem("googleId")
	);

	const [apiLoaded, setApiLoaded] = useState(false);

	// Wait for Google Identity Services to load
	useEffect(() => {
		// Function to check if Google Identity Services is loaded
		const checkGoogleLoaded = () => {
			if (window.google && window.google.accounts && window.google.accounts.id) {
				return true;
			}
			return false;
		};

		// Check if already loaded
		if (checkGoogleLoaded()) {
			setApiLoaded(true);
		} else {
			// Wait for Google Identity Services to load (check every 100ms, max 10 seconds)
			let attempts = 0;
			const maxAttempts = 100;
			const checkInterval = setInterval(() => {
				attempts++;
				if (checkGoogleLoaded()) {
					clearInterval(checkInterval);
					console.log("[Google] Identity Services loaded successfully");
					setApiLoaded(true);
				} else if (attempts >= maxAttempts) {
					clearInterval(checkInterval);
					console.error("[Google] Failed to load Google Identity Services after 10 seconds");
					// Set apiLoaded to true anyway so app can render
					setApiLoaded(true);
				}
			}, 100);
		}

	}, []);

	return apiLoaded ? (
		<Router>
			<AuthContext.Provider value={{ token, setToken, googleId, setGoogleId }}>
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
					<Route exact path="/doctor/feedback/:id" component={FeedbackDetails} />

					<Route exact path="/patient/selectdate" component={Selectdate} />
					<Route exact path="/patient/book-slot" component={BookingSlots} />
					<Route exact path="/patient/payment" component={Payment} />
					<Route exact path="/patient/appointment-status" component={AppointmentStatus} />
					<Route exact path="/patient/feedback/:id" component={Pfeedback} />

					<Route path="*">
						<Error />
					</Route>
				</Switch>
			</AuthContext.Provider>
		</Router>
	) : (
		<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
			<Spinner animation="border" variant="danger" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</div>
	);
}

export default App;
