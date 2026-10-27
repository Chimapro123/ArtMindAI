import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GuideProvider } from "./context/GuideContext.jsx";
import "./css/root.css";
import "./css/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GuideProvider>
          <App />
        </GuideProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
