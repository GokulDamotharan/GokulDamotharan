import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsidePatient";
import StripeCheckoutButton from "react-stripe-checkout";
import { toast } from "react-toastify";
import axios from "axios";
// import { Toast } from "react-toastify/dist/components";

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
    <div className="bg-dark" style={{ height: "100vh" }}>
      <Navbar />
      <div>
        <div className="row m-5" style={{ maxWidth: "100%" }}>
          <div
            className="col-3 col-md-3 p-4 bg-white "
            style={{ height: "80vh" }}
          >
            <Leftside />
          </div>
          <div
            className="col-9 col-md-9 p-4 "
            style={{
              border: "15px solid yellow ",
              height: "80vh",
              backgroundColor: "#6c757d",
            }}
          >
            <div className="container text-white">
              <div className="row">
                <div className="well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
                  <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <address>
                        <strong>Elf Cafe</strong>
                        <br />
                        2135 Sunset Blvd
                        <br />
                        Los Angeles, CA 90026
                        <br />
                        <abbr title="Phone">P:</abbr> (213) 484-6829
                      </address>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 text-right">
                      <p>
                        <em>Date: 1st November, 2013</em>
                      </p>
                      <p>
                        <em>Receipt #: 34522677W</em>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-center">
                      <h1>Receipt</h1>
                    </div>
                    <table className="table table-hover text-white">
                      <thead>
                        <tr>
                          <th>Doctor Name</th>
                          <th>Specialization</th>

                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="col-md-9">
                            <em>{doctor.name}</em>
                          </td>
                          <td
                            className="col-md-1"
                            style={{ textAlign: "center" }}
                          >
                            {doctor.specialization}
                          </td>

                          <td className="col-md-1 text-center">
                            {doctor.feesPerSession}
                          </td>
                        </tr>

                        <tr>
                          <td> &nbsp; </td>

                          <td className="text-right">
                            <p>
                              <strong>Subtotal:&nbsp;</strong>
                            </p>
                            <p>
                              <strong>Tax:&nbsp;</strong>
                            </p>
                          </td>
                          <td className="text-center">
                            <p>
                              <strong>{doctor.feesPerSession}</strong>
                            </p>
                            <p>
                              <strong>{0.18 * doctor.feesPerSession}</strong>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td> &nbsp; </td>

                          <td className="text-right">
                            <h4>
                              <strong>Total:&nbsp;</strong>
                            </h4>
                          </td>
                          <td className="text-center text-danger">
                            <h4>
                              <strong>{finalBalnce}</strong>
                            </h4>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                        className="btn btn-success btn-lg btn-block"
                      >
                        Pay Now&nbsp;&nbsp;&nbsp;
                        <span className="glyphicon glyphicon-chevron-right" />
                      </button>
                    </StripeCheckoutButton>
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
