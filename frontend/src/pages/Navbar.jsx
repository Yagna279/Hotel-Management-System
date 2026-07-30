import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/shnoor-logo.jpeg";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="navbar">

      <div className="logo-section">
        <img src={logo} alt="logo" />

        <div>
          <h2>SHNOOR INTERNATIONAL LLC</h2>
          <p>Hotel Management System</p>
        </div>
      </div>

      <ul className="menu">
        <li>About</li>
        <li>Services</li>
        <li>Pricing</li>
        <li>Book Demo</li>
        <li>Contact Us</li>
      </ul>

      <div className="login">
        <button
          onClick={() => setShowLogin(!showLogin)}
          className="login-btn"
        >
          Login ▼
        </button>

        {showLogin && (
          <div className="dropdown">
            <a href="/customer-login">Customer Login</a>
            <a href="/admin-login">Admin Login</a>
          </div>
        )}
      </div>

    </nav>
  );
}

export default Navbar;