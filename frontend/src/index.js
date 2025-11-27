import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <GoogleOAuthProvider clientId="18076221050-jb7vnepph67lhvfi5fbq8am9htpe1pi3.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
