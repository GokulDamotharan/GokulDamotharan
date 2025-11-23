import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../image/navbaricon1.png";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";
// import GoogleLogin from "react-google-login";
// import axios from "axios";

const Navbar = () => {
  const { token, setToken, setGoogleId } = useContext(AuthContext);
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

  function signOutGoogle() {
    // Different logic for doctor and patient

    // Check if Google API is initialized and user is signed in
    const authInstance = window.gapi?.auth2?.getAuthInstance();
    
    // Patient logic - if Google auth is available and user is signed in
    if (authInstance && authInstance.isSignedIn.get()) {
      authInstance.signOut().then(() => {
        console.log("[Google] Signed out successfully!");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("googleId");
        setToken(null);
        setGoogleId(null);
        history.push("/");
      }).catch((err) => {
        console.log(`[Google] Some error occurred while signing out! ${err}`);
        // Even if signOut fails, clear local storage and redirect
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("googleId");
        setToken(null);
        setGoogleId(null);
        history.push("/");
      });
    }
    // Doctor logic - if Google auth is not available or user is not signed in
    else {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("googleId");
      console.log("[Doctor] Signed out successfully!");
      setToken(null);
      setGoogleId(null);
      history.push("/");
    }
  }

  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg pl-4 pr-4 w-100 "
      style={{ backgroundColor: " #1a1a1a" }}
    >
      <Link to="/" className="navbar-brand">
        <img
          src={logo}
          alt=""
          width="30"
          height="24"
          className="d-inline-block align-top mr-2 mt-1"
        ></img>
        Hospital Management System
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse " id="collapsibleNavbar">
        <ul className="navbar-nav ml-auto text-light bg-dark">
          <li className="navbar-item" style={{ textAlign: "right" }}>
            <link to="/" className="nav-link " style={{ padding: 0 }} />
            {!token && (
              <button
                onClick={loginWithGoogle}
                className="btn btn-outline-primary"
              >
                Login As A Patient
              </button>
            )}
            {token && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={signOutGoogle}
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
