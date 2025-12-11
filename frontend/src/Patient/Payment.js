import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Leftside from "../Dashbaord/LeftsidePatient";
import DashboardHeader from "../Dashbaord/components/DashboardHeader";
import StripeCheckoutButton from "react-stripe-checkout";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { CreditCard, User, Stethoscope, DollarSign, FileText, CheckCircle } from "lucide-react";

function getEndDateTime(dateTime) {
  const hrs = (parseInt(dateTime.split("T")[1].split(":")[0]) + 1)
    .toString()
    .padStart(2, "0");
  const time = hrs + ":00:00";
  const date = dateTime.split("T")[0];
  return date + "T" + time;
}

const Payment = (props) => {
  const [finalBalnce, setFinalBalnce] = useState(0);
  const history = useHistory();

  async function createEvent(id, dateTime, doctorEmail) {
    var virtualEvent = {
      summary: "Appointment",
      location: "Virtual",
      description: "Doctor-Patient appointment",
      start: {
        dateTime: dateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: getEndDateTime(dateTime),
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: "7qxalsvy0e",
        },
      },
      attendees: doctorEmail ? [{ email: doctorEmail }] : [],
      guestsCanModify: true,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    };

    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        console.error("No access token found for Calendar API");
        return;
      }

      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
        virtualEvent,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Event created!", response.data);

      // Add meet link
      if (response.data) {
        axios.put(
          `${process.env.REACT_APP_SERVER_URL}/appointments/add-meet-link`,
          {
            appointmentId: id,
            meetLink: response.data.hangoutLink
          }
        ).then((x) => {
          console.log(`Updated Meet Link!`);
        })
      }
    } catch (error) {
      console.error("Error creating calendar event:", error);
      console.error("Error response:", error.response);
      toast.error(`Failed to create calendar event: ${error.message}`);
      if (error.response) {
        toast.error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
    }
  }

  const { dateId, doctor, slotId } = props.location.data;

  const bookSlot = async () => {
    const googleId = localStorage.getItem("googleId");
    if (!googleId) {
      toast.error("User ID missing. Please logout and login again.");
      return;
    }

    const { data } = await Axios.post(
      `${process.env.REACT_APP_SERVER_URL}/doctors/book-slot/`,
      {
        googleId: googleId,
        patientName: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : "Unknown Patient",
        slotId: slotId,
        dateId: dateId,
        doctorId: doctor._id,
      }
    );

    // Create event even if doctorEmail is missing (it will just not have attendees)
    createEvent(data._id, data.date + "T" + data.slotTime, data.doctorEmail);
  };

  useEffect(() => {
    setFinalBalnce(1.18 * doctor.feesPerSession);
  }, []);

  const makePayment = async (token) => {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_SERVER_URL}/patients/payment`,
      {
        token,
        finalBalnce,
      }
    );

    if (data) {
      bookSlot();
      setFinalBalnce(0);
      toast("Appointment booked successfully", {
        type: "success"
      })
      history.push("/patient");
    }

    console.log(data);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container-fluid flex-grow-1 p-0">
        <div className="row h-100 no-gutters">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-3 sticky-top vh-100">
            <Leftside />
          </div>

          <div className="col-md-9 col-lg-10 p-4 overflow-auto" style={{ height: '100vh' }}>
            {/* Header */}
            <DashboardHeader />
            
            <div>
              {/* Header */}
              <div className="mb-4">
                <h2 className="font-weight-bold d-flex align-items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <CreditCard size={32} style={{ color: 'var(--color-teal)' }} />
                  Payment & Confirmation
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Review your appointment details and complete the payment
                </p>
              </div>

              <div className="row">
                <div className="col-lg-8 mx-auto">
                  {/* Doctor Info Card */}
                  <div className="glass-panel p-4 mb-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '60px',
                          height: '60px',
                          background: 'var(--gradient-primary)'
                        }}
                      >
                        <Stethoscope size={28} color="white" />
                      </div>
                      <div>
                        <h5 className="mb-1 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                          Dr. {doctor.name}
                        </h5>
                        <p className="mb-0" style={{ color: 'var(--color-text-secondary)' }}>
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Receipt */}
                  <div className="glass-panel p-4 mb-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <FileText size={24} style={{ color: 'var(--color-teal)' }} />
                      <h5 className="mb-0 font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                        Payment Summary
                      </h5>
                    </div>

                    {/* Appointment Details */}
                    <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <small style={{ color: 'var(--color-text-light)' }}>Service</small>
                          <p className="mb-0 font-weight-600" style={{ color: 'var(--color-text-primary)' }}>
                            Medical Consultation
                          </p>
                        </div>
                        <div className="text-right">
                          <small style={{ color: 'var(--color-text-light)' }}>Doctor</small>
                          <p className="mb-0 font-weight-600" style={{ color: 'var(--color-text-primary)' }}>
                            Dr. {doctor.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small style={{ color: 'var(--color-text-light)' }}>Specialization</small>
                          <p className="mb-0 font-weight-600" style={{ color: 'var(--color-text-primary)' }}>
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ color: 'var(--color-text-secondary)' }}>Consultation Fee</span>
                        <span className="font-weight-600" style={{ color: 'var(--color-text-primary)' }}>
                          ₹{doctor.feesPerSession}
                        </span>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ color: 'var(--color-text-secondary)' }}>Tax (18%)</span>
                        <span className="font-weight-600" style={{ color: 'var(--color-text-primary)' }}>
                          ₹{(0.18 * doctor.feesPerSession).toFixed(2)}
                        </span>
                      </div>
                      
                      <div 
                        className="d-flex justify-content-between align-items-center p-3 mt-3"
                        style={{
                          background: 'var(--gradient-primary)',
                          borderRadius: '8px'
                        }}
                      >
                        <span className="font-weight-bold" style={{ color: 'white', fontSize: '1.1rem' }}>
                          Total Amount
                        </span>
                        <span className="font-weight-bold" style={{ color: 'white', fontSize: '1.3rem' }}>
                          ₹{finalBalnce.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <StripeCheckoutButton
                      stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
                      token={makePayment}
                      amount={finalBalnce * 100}
                      name="Place Appointment"
                      shippingAddress
                      billingAddress
                    >
                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{
                          background: 'var(--gradient-secondary)',
                          border: 'none',
                          color: 'white',
                          padding: '14px 24px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '1.05rem'
                        }}
                      >
                        <CreditCard size={20} />
                        Proceed to Payment
                      </button>
                    </StripeCheckoutButton>
                  </div>

                  {/* Security Notice */}
                  <div 
                    className="p-3 text-center"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <CheckCircle size={18} style={{ color: '#43E97B' }} />
                      <small className="font-weight-600" style={{ color: 'var(--color-text-primary)' }}>
                        Secure Payment
                      </small>
                    </div>
                    <small style={{ color: 'var(--color-text-secondary)' }}>
                      Your payment information is encrypted and secure. We use Stripe for payment processing.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
