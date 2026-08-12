import React, { useState } from "react";

import {
  FaGlobe,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";

import "./RegionalSettings.css";


function RegionalSettings() {
  const [language, setLanguage] = useState("English");

  const [currency, setCurrency] = useState("INR");

  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const [message, setMessage] = useState("");


  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSave = () => {
    setMessage("Regional settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };


  /* =====================================================
     CANCEL / RESET SETTINGS
  ===================================================== */

  const handleCancel = () => {
    setLanguage("English");
    setCurrency("INR");
    setTimezone("Asia/Kolkata");
    setDateFormat("DD/MM/YYYY");
    setMessage("");
  };


  return (
    <div className="regional-settings-container">


      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <div className="regional-settings-heading">

        <div className="regional-heading-icon">
          <FaGlobe />
        </div>

        <div>

          <h2>
            Regional Settings
          </h2>

          <p>
            Configure language, timezone, currency and date preferences.
          </p>

        </div>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (
        <div className="regional-settings-success">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="regional-settings-card">


        {/* =================================================
            CARD HEADER
        ================================================= */}

        <div className="regional-card-header">

          <div className="regional-card-icon">
            <FaGlobe />
          </div>

          <div>

            <h3>
              Regional Preferences
            </h3>

            <p>
              Configure the regional preferences used throughout
              the hotel management system.
            </p>

          </div>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <div className="regional-settings-form">


          {/* =================================================
              LANGUAGE
          ================================================= */}

          <div className="regional-form-group">

            <label>
              Language
            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >

              <option value="English">
                English
              </option>

              <option value="Telugu">
                Telugu
              </option>

              <option value="Hindi">
                Hindi
              </option>

            </select>

            <small>
              Select the default system language.
            </small>

          </div>


          {/* =================================================
              CURRENCY
          ================================================= */}

          <div className="regional-form-group">

            <label>
              Currency
            </label>

            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value)
              }
            >

              <option value="INR">
                Indian Rupee (INR)
              </option>

              <option value="USD">
                US Dollar (USD)
              </option>

              <option value="EUR">
                Euro (EUR)
              </option>

              <option value="GBP">
                British Pound (GBP)
              </option>

            </select>

            <small>
              Currency used for hotel payments and reports.
            </small>

          </div>


          {/* =================================================
              TIMEZONE
          ================================================= */}

          <div className="regional-form-group">

            <label>
              Timezone
            </label>

            <select
              value={timezone}
              onChange={(e) =>
                setTimezone(e.target.value)
              }
            >

              <option value="Asia/Kolkata">
                India Standard Time
              </option>

              <option value="UTC">
                Coordinated Universal Time
              </option>

              <option value="Asia/Dubai">
                Gulf Standard Time
              </option>

              <option value="Europe/London">
                London
              </option>

            </select>

            <small>
              Timezone used for bookings, reports and system activity.
            </small>

          </div>


          {/* =================================================
              DATE FORMAT
          ================================================= */}

          <div className="regional-form-group">

            <label>
              Date Format
            </label>

            <select
              value={dateFormat}
              onChange={(e) =>
                setDateFormat(e.target.value)
              }
            >

              <option value="DD/MM/YYYY">
                DD/MM/YYYY
              </option>

              <option value="MM/DD/YYYY">
                MM/DD/YYYY
              </option>

              <option value="YYYY-MM-DD">
                YYYY-MM-DD
              </option>

            </select>

            <small>
              Date format displayed throughout the system.
            </small>

          </div>


        </div>


        {/* =================================================
            CURRENT SETTINGS
        ================================================= */}

        <div className="regional-summary">

          <div className="regional-summary-title">
            Current Configuration
          </div>


          <div className="regional-summary-grid">


            <div className="regional-summary-item">

              <span>
                Language
              </span>

              <strong>
                {language}
              </strong>

            </div>


            <div className="regional-summary-item">

              <span>
                Currency
              </span>

              <strong>
                {currency}
              </strong>

            </div>


            <div className="regional-summary-item">

              <span>
                Timezone
              </span>

              <strong>
                {timezone}
              </strong>

            </div>


            <div className="regional-summary-item">

              <span>
                Date Format
              </span>

              <strong>
                {dateFormat}
              </strong>

            </div>


          </div>

        </div>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="regional-settings-actions">

          <button
            type="button"
            className="regional-cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>


          <button
            type="button"
            className="regional-save-btn"
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


export default RegionalSettings;