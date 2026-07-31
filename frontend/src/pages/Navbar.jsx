import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/shnoor-logo.jpeg";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo-section">
        <img src={logo} alt="logo" />

        <div className="logo-text">
          <h2>SHNOOR INTERNATIONAL LLC</h2>
          <p>Hotel Management System</p>
        </div>
      </div>

      <nav className="nav-links">
  <span onClick={() => scrollToSection("home")}>Home</span>
  <span onClick={() => scrollToSection("about")}>About</span>
  <span onClick={() => scrollToSection("services")}>Services</span>
  <span onClick={() => scrollToSection("pricing")}>Pricing</span>
  <span onClick={() => scrollToSection("demo")}>Book Demo</span>
  <span onClick={() => scrollToSection("contact")}>Contact Us</span>
       </nav>

      {/* Login */}
      <div className="nav-actions">
        <button
          className="login-btn"
          onClick={() => setShowLogin(!showLogin)}
        >
          Login 
        </button>

        {showLogin && (
          <div className="dropdown">
            <a href="/admin-login">Admin Login</a>
            <a href="/customer-login">Customer Login</a>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;