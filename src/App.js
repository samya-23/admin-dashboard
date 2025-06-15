import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

// Helper: Check if user is logged in AND session is valid
const isAuthenticated = () => {
  const loggedIn = localStorage.getItem("loggedIn");
  const expiry = localStorage.getItem("sessionExpiry");
  const now = new Date().getTime();

  return loggedIn === "true" && expiry && now < parseInt(expiry, 10);
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />}
        />
        {/* Optional: 404 fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

