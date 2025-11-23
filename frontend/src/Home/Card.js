import { Button } from 'react-bootstrap';
import React, { useContext } from 'react';
// import GoogleLogin from 'react-google-login';
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';

const Card = ({ login = "Doctor", Image, link }) => {
  const { token, googleId, setToken, setGoogleId } = useContext(AuthContext);
  const history = useHistory();

  async function loginWithGoogle(e) {
    try {
      // Check if Google API is loaded and initialized
      if (!window.gapi || !window.gapi.auth2) {
        console.error("[Google] Google API is not loaded yet. Please wait...");
        alert("Google sign-in is still loading. Please wait a moment and try again.");
        return;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        console.error("[Google] Auth instance is not initialized yet.");
        alert("Google sign-in is still initializing. Please wait a moment and try again.");
        return;
      }

      // Sign in with Google
      await authInstance.signIn();
      
      // Get the auth instance again after sign in
      const auth2 = window.gapi.auth2.getAuthInstance();
      
      if (auth2 && auth2.isSignedIn.get()) {
        console.log("[Google] Signed in successfully!");
        var profile = auth2.currentUser.get();
        console.log(profile);
        
        if (!profile || !profile.getAuthResponse || !profile.getId) {
          throw new Error("Failed to get user profile from Google");
        }
        
        window.localStorage.setItem("token", profile.getAuthResponse().id_token);
        window.localStorage.setItem("googleId", profile.getId());

        const serverRes = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/patients/google-login/`,
          {
            tokenId: profile.getAuthResponse().id_token,
          }
        );

        if (serverRes) {
          console.log(serverRes.data.phoneNumberExists);

          setToken(profile.getAuthResponse().id_token);
          setGoogleId(profile.getId());

          if (serverRes.data.phoneNumberExists === true) {
            history.push("/patient");
          } else {
            history.push("/patient/update-phone");
          }
        }
        else {
          const err = {err : "Server Didn't respond"}
          throw err;
        }
      } else {
        console.log("[Google] Sign in was cancelled or failed.");
      }
    } catch (err) {
      console.error(`[Google] Some error occurred while signing in!`, err);
      if (err.error === 'popup_closed_by_user') {
        alert("Sign-in was cancelled. Please try again.");
      } else {
        alert(`Error signing in: ${err.message || JSON.stringify(err)}`);
      }
    }
  }

  return (
    <div className="card mb-3" style={{ width: "18rem" }}>
      <img src={Image} className="card-img-top" alt="..." height="240" />
      <div className="card-body">
        {((!token || googleId) && login === "Doctor") && <Link to={link} className="btn btn-primary justify-content-center w-100">Login As A Doctor</Link>}
        {((token && !googleId) && login === "Doctor") && <Link to={link} className="btn btn-primary justify-content-center w-100">My Dashboard</Link>}
        {((!googleId && login === "Patient") && <Button onClick={loginWithGoogle} disabled={false} className="btn btn-primary justify-content-center w-100">Login As A Patient</Button>)}
        {((token && googleId) && login === "Patient") && <Link to={link} className="btn btn-primary justify-content-center w-100">My Dashboard</Link>}
      </div>
    </div>
  )
}

export default Card;