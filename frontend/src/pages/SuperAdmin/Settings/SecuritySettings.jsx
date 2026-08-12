import React, { useState } from "react";

import {
  FaLock,
  FaBell,
  FaShieldAlt,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";

import "./SecuritySettings.css";


function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);

  const [loginAlerts, setLoginAlerts] = useState(true);

  const [sessionTimeout, setSessionTimeout] = useState("30");

  const [message, setMessage] = useState("");


  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSave = () => {
    setMessage("Security settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };


  /* =====================================================
     CANCEL / RESET SETTINGS
  ===================================================== */

  const handleCancel = () => {
    setTwoFactor(false);
    setLoginAlerts(true);
    setSessionTimeout("30");
    setMessage("");
  };


  return (
    <div className="security-settings-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="security-settings-heading">

        <div className="security-heading-icon">
          <FaShieldAlt />
        </div>

        <div>

          <h2>
            Security Settings
          </h2>

          <p>
            Manage administrator security and login protection.
          </p>

        </div>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (
        <div className="security-settings-success">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="security-settings-card">


        {/* =================================================
            CARD HEADER
        ================================================= */}

        <div className="security-card-header">

          <div className="security-card-icon">
            <FaShieldAlt />
          </div>

          <div>

            <h3>
              Security Controls
            </h3>

            <p>
              Configure login protection and administrator security.
            </p>

          </div>

        </div>


        {/* =================================================
            SECURITY OPTIONS
        ================================================= */}

        <div className="security-settings-options">


          {/* =================================================
              TWO FACTOR AUTHENTICATION
          ================================================= */}

          <div className="security-option">

            <div className="security-option-icon">
              <FaLock />
            </div>

            <div className="security-option-content">

              <strong>
                Two-Factor Authentication
              </strong>

              <span>
                Add an additional security layer for administrators.
              </span>

            </div>

            <button
              type="button"
              className={`security-toggle ${
                twoFactor ? "active" : ""
              }`}
              onClick={() =>
                setTwoFactor(!twoFactor)
              }
            >
              {twoFactor ? "ON" : "OFF"}
            </button>

          </div>


          {/* =================================================
              LOGIN ALERTS
          ================================================= */}

          <div className="security-option">

            <div className="security-option-icon">
              <FaBell />
            </div>

            <div className="security-option-content">

              <strong>
                Login Alerts
              </strong>

              <span>
                Notify administrators when a new login is detected.
              </span>

            </div>

            <button
              type="button"
              className={`security-toggle ${
                loginAlerts ? "active" : ""
              }`}
              onClick={() =>
                setLoginAlerts(!loginAlerts)
              }
            >
              {loginAlerts ? "ON" : "OFF"}
            </button>

          </div>


        </div>


        {/* =================================================
            SESSION TIMEOUT
        ================================================= */}

        <div className="security-field-container">

          <div className="security-field">

            <label>
              Session Timeout
            </label>

            <span className="security-field-description">
              Automatically log out inactive administrators
              after the selected period.
            </span>

            <select
              value={sessionTimeout}
              onChange={(e) =>
                setSessionTimeout(e.target.value)
              }
            >

              <option value="15">
                15 minutes
              </option>

              <option value="30">
                30 minutes
              </option>

              <option value="60">
                1 hour
              </option>

              <option value="120">
                2 hours
              </option>

            </select>

          </div>

        </div>


        {/* =================================================
            SECURITY STATUS
        ================================================= */}

        <div className="security-status-section">


          <div className="security-status-card">

            <div className="security-status-icon green">
              <FaLock />
            </div>

            <div className="security-status-content">

              <strong>
                Password Protection
              </strong>

              <small>
                Strong password protection is enabled.
              </small>

            </div>

            <span className="security-status-badge enabled">
              Enabled
            </span>

          </div>


          <div className="security-status-card">

            <div className="security-status-icon purple">
              <FaShieldAlt />
            </div>

            <div className="security-status-content">

              <strong>
                Two-Factor Authentication
              </strong>

              <small>
                Additional authentication layer.
              </small>

            </div>

            <span
              className={`security-status-badge ${
                twoFactor ? "enabled" : "disabled"
              }`}
            >
              {twoFactor ? "Enabled" : "Disabled"}
            </span>

          </div>


        </div>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="security-settings-actions">

          <button
            type="button"
            className="security-cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>


          <button
            type="button"
            className="security-save-btn"
            onClick={handleSave}
          >
            <FaSave />

            Save Changes
          </button>

        </div>


      </div>

    </div>
  );
}


export default SecuritySettings;