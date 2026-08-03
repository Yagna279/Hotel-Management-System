import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/shnoor-logo.jpeg";

function Navbar() {
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
        <img src={logo} alt="Shnoor Logo" />

        <div className="logo-text">
          <h2>SHNOOR INTERNATIONAL LLC</h2>
          <p>Hotel Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-links">
        <span onClick={() => scrollToSection("home")}>Home</span>
        <span onClick={() => scrollToSection("about")}>About</span>
        <span onClick={() => scrollToSection("services")}>Services</span>
        <span onClick={() => scrollToSection("demo")}>Book Demo</span>
        <span onClick={() => scrollToSection("contact")}>Contact Us</span>
      </nav>

      {/* Right Side Buttons */}
      <div className="nav-buttons">

        <Link to="/get-started" className="get-started-btn">
          Get Started
        </Link>

        <Link to="/login" className="login-btn">
          Login
        </Link>

      </div>

    </header>
  );
}

export default Navbar;