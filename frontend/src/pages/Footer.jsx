import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import React from "react";
import "./Footer.css";
import logo from "../assets/shnoor-logo.jpeg";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Company */}
        <div className="footer-column company-column">

          <div className="footer-logo">

            <img src={logo} alt="Shnoor Logo" />

            <div className="footer-logo-text">
              <h3>SHNOOR INTERNATIONAL LLC</h3>
              <p>Hotel Management System</p>
            </div>

          </div>

          <p className="footer-text">
            Simplify Hotel operations with one integrated platform for
            Reservations, Guest management, Billing, Restaurant services,
            Housekeeping and Reporting.
          </p>

        </div>

        {/* Quick Links */}
        <div className="footer-column">

          <h4>Quick Links</h4>

          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#demo">Book Demo</a>
          <a href="#contact">Contact Us</a>

        </div>

        {/* Contact */}
        <div className="footer-column">
  <h4>Contact Us</h4>

  <a href="mailto:info@shnoor.com">
    <FaEnvelope className="footer-icon" />
    info@shnoor.com
  </a>

  <a href="tel:+919876543210">
    <FaPhoneAlt className="footer-icon" />
    +91 9876543210
  </a>

  <p className="footer-address">
    <FaMapMarkerAlt className="footer-icon" />
    <span>
      10009 Mount Tabor Road<br />
      Odessa, Missouri<br />
      United States
    </span>
  </p>
</div>

      </div>

      <hr />

      <div className="footer-bottom">

        <p>© 2026 SHNOOR INTERNATIONAL LLC. All Rights Reserved.</p>

        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;