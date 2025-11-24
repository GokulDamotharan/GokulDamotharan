import React, { useContext, useEffect, useCallback } from "react";
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

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      if (response.error) {
        console.error("[Google] Sign-in error:", response.error);
        alert(`Sign-in error: ${response.error}`);
        return;
      }

      console.log("[Google] Sign-in successful!");
      const credential = response.credential; // This is the ID token (JWT)
      
      // Decode the ID token to get user info
      const tokenParts = credential.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      console.log("[Google] Decoded token:", payload);

      const googleId = payload.sub;
      window.localStorage.setItem("token", credential);
      window.localStorage.setItem("googleId", googleId);

      // Send to backend
      const serverRes = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/google-login/`,
        {
          tokenId: credential, // This is the ID token (JWT) that backend expects
        }
      );

      if (serverRes) {
        console.log(serverRes.data.phoneNumberExists);
        setToken(credential);
        setGoogleId(googleId);

        if (serverRes.data.phoneNumberExists === true) {
          history.push("/patient");
        } else {
          history.push("/patient/update-phone");
        }
      } else {
        throw new Error("Server didn't respond");
      }
    } catch (err) {
      console.error("[Google] Error processing sign-in:", err);
      alert(`Error: ${err.message || JSON.stringify(err)}`);
    }
  }, [history, setToken, setGoogleId]);

  useEffect(() => {
    // Wait for Google Identity Services to load, then initialize
    const initializeGoogleSignIn = () => {
      const clientId = process.env.REACT_APP_CLIENT_ID;
      if (clientId && window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false, // Don't auto-select accounts
            cancel_on_tap_outside: true // Cancel if user clicks outside
          });
          console.log("[Google] Identity Services initialized successfully");
        } catch (err) {
          console.error("[Google] Error initializing Identity Services:", err);
        }
      }
    };

    // Check if already loaded
    if (window.google && window.google.accounts && window.google.accounts.id) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google Identity Services to load
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.google && window.google.accounts && window.google.accounts.id) {
          clearInterval(checkInterval);
          initializeGoogleSignIn();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.warn("[Google] Identity Services not loaded after 5 seconds");
        }
      }, 100);
    }

    // Cleanup function to remove any button containers when component unmounts
    return () => {
      const buttonContainer = document.getElementById('google-signin-button-container');
      if (buttonContainer) {
        buttonContainer.remove();
      }
    };
  }, [handleCredentialResponse]);

  async function loginWithGoogle(e) {
    try {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        alert("Google sign-in is still loading. Please wait a moment and try again.");
        return;
      }

      const clientId = process.env.REACT_APP_CLIENT_ID;
      if (!clientId) {
        alert("Google Client ID is not configured. Please check your .env file.");
        return;
      }

      // Clean up any existing button containers first
      const existingContainer = document.getElementById('google-signin-button-container');
      if (existingContainer) {
        existingContainer.remove();
      }

      // Check current origin
      const currentOrigin = window.location.origin;
      console.log("[Google] Current origin:", currentOrigin);
      console.log("[Google] Make sure this origin is added to Google Cloud Console authorized JavaScript origins");

      // Try One Tap prompt first (non-intrusive)
      window.google.accounts.id.prompt((notification) => {
        console.log("[Google] One Tap notification:", notification);
        
        // If One Tap doesn't show or was dismissed, use button approach
        if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
          console.log("[Google] One Tap not available, using button approach");
          
          // Create a completely hidden container (off-screen)
          const tempContainer = document.createElement('div');
          tempContainer.id = 'google-signin-button-container';
          tempContainer.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 0; height: 0; overflow: hidden; visibility: hidden;';
          document.body.appendChild(tempContainer);
          
          try {
            // Render the button in the hidden container
            window.google.accounts.id.renderButton(
              tempContainer,
              {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                type: 'standard'
              }
            );
            
            // Wait for button to render, then click it programmatically
            let attempts = 0;
            const maxAttempts = 20; // 2 seconds max
            const clickButton = () => {
              attempts++;
              const button = tempContainer.querySelector('div[role="button"], iframe');
              if (button) {
                console.log("[Google] Button found, clicking...");
                // Try to click the button
                if (button.click) {
                  button.click();
                } else if (button.contentWindow) {
                  // If it's an iframe, try to trigger click on the iframe content
                  try {
                    const iframeDoc = button.contentDocument || button.contentWindow.document;
                    const iframeButton = iframeDoc.querySelector('div[role="button"]');
                    if (iframeButton) {
                      iframeButton.click();
                    }
                  } catch (e) {
                    console.warn("[Google] Could not access iframe content:", e);
                  }
                }
                
                // Remove container after a delay
                setTimeout(() => {
                  if (tempContainer && tempContainer.parentNode) {
                    tempContainer.remove();
                  }
                }, 2000);
              } else if (attempts < maxAttempts) {
                // Retry if button not ready yet
                setTimeout(clickButton, 100);
              } else {
                console.error("[Google] Button not found after multiple attempts");
                tempContainer.remove();
                alert("Unable to initialize Google sign-in. Please check:\n1. Popup blockers are disabled\n2. http://localhost:3000 is added to authorized JavaScript origins in Google Cloud Console\n3. Try refreshing the page");
              }
            };
            
            // Start trying to click after a short delay
            setTimeout(clickButton, 500);
          } catch (renderError) {
            console.error("[Google] Error rendering button:", renderError);
            tempContainer.remove();
            alert(`Error initializing sign-in: ${renderError.message}\n\nPlease ensure:\n1. http://localhost:3000 is in authorized JavaScript origins\n2. Your Client ID is correct`);
          }
        }
      });
    } catch (err) {
      console.error(`[Google] Some error occurred while signing in!`, err);
      alert(`Error signing in: ${err.message || JSON.stringify(err)}\n\nPlease check:\n1. http://localhost:3000 is added to authorized JavaScript origins\n2. Popup blockers are disabled`);
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
