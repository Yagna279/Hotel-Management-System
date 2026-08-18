import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import logo from "../assets/shnoor-logo.jpeg";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    // Close mobile menu after clicking
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      {/* ================= Logo ================= */}
      <div className="logo-section">
        <img src={logo} alt="Shnoor Logo" />

        <div className="logo-text">
          <h2>SHNOOR INTERNATIONAL LLC</h2>
          <p>Hotel Management System</p>
        </div>
      </div>


      {/* ================= Desktop Navigation ================= */}
      <nav className="nav-links">
        <span onClick={() => scrollToSection("home")}>
          Home
        </span>

        <span onClick={() => scrollToSection("about")}>
          About
        </span>

        <span onClick={() => scrollToSection("services")}>
          Services
        </span>

        <span onClick={() => scrollToSection("demo")}>
          Book Demo
        </span>

        <span onClick={() => scrollToSection("contact")}>
          Contact Us
        </span>
      </nav>


      {/* ================= Desktop Buttons ================= */}
      <div className="nav-buttons">

        <Link
          to="/get-started"
          className="get-started-btn"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="login-btn"
        >
          Login
        </Link>

      </div>


      {/* ================= Mobile Menu Button ================= */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>


      {/* ================= Mobile Menu ================= */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

        <span onClick={() => scrollToSection("home")}>
          Home
        </span>

        <span onClick={() => scrollToSection("about")}>
          About
        </span>

        <span onClick={() => scrollToSection("services")}>
          Services
        </span>

        <span onClick={() => scrollToSection("demo")}>
          Book Demo
        </span>

        <span onClick={() => scrollToSection("contact")}>
          Contact Us
        </span>


        {/* Mobile Buttons */}
        <div className="mobile-buttons">

          <Link
            to="/get-started"
            className="get-started-btn"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="login-btn"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

        </div>

      </div>

    </header>
  );
}

export default Navbar;