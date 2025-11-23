/* global gapi */
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

	// To load only when gapi is loaded
	useEffect(() => {
		// Function to check if gapi is loaded
		const checkGapiLoaded = () => {
			if (window.gapi && window.gapi.load) {
				return true;
			}
			return false;
		};

		// Function to initialize Google API
		const initGoogleAPI = () => {
			setApiLoaded(false);
			window.gapi.load("client:auth2", initClient);
			
			function initClient() {
				window.gapi.client
					.init({
						apiKey: process.env.REACT_APP_API_KEY,
						clientId: process.env.REACT_APP_CLIENT_ID,
						discoveryDocs: [process.env.REACT_APP_DISCOVERY_DOCS],
						scope: process.env.REACT_APP_SCOPE,
					})
					.then(
						function () {
							const authInstance = window.gapi?.auth2?.getAuthInstance();
							if (authInstance && authInstance.isSignedIn.get()) {
								console.log(
									`Is signed in? ${authInstance.isSignedIn.get()}`
								);
							} else {
								console.log("Currently Logged Out!!");
							}
							setApiLoaded(true);
						},
						function (error) {
							console.error(`[Google] Initialization error: ${JSON.stringify(error)}`);
							// Still set apiLoaded to true so app can render, but Google sign-in won't work
							setApiLoaded(true);
						}
					);
			}
		};

		// Check if gapi is already loaded
		if (checkGapiLoaded()) {
			initGoogleAPI();
		} else {
			// Wait for gapi to load (check every 100ms, max 10 seconds)
			let attempts = 0;
			const maxAttempts = 100;
			const checkInterval = setInterval(() => {
				attempts++;
				if (checkGapiLoaded()) {
					clearInterval(checkInterval);
					initGoogleAPI();
				} else if (attempts >= maxAttempts) {
					clearInterval(checkInterval);
					console.error("[Google] Failed to load Google API after 10 seconds");
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
