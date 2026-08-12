import React, { useState } from "react";

import {
  FaBell,
  FaEnvelope,
  FaHotel,
  FaDatabase,
  FaSave,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

import "./NotificationSettings.css";


function NotificationSettings() {

  const [notifications, setNotifications] = useState(true);

  const [emailAlerts, setEmailAlerts] = useState(true);

  const [bookingAlerts, setBookingAlerts] = useState(true);

  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const [message, setMessage] = useState("");


  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = () => {

    setMessage(
      "Notification settings saved successfully."
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);

  };


  // =====================================================
  // CANCEL / RESET
  // =====================================================

  const handleCancel = () => {

    setNotifications(true);

    setEmailAlerts(true);

    setBookingAlerts(true);

    setPaymentAlerts(true);

    setMessage("");

  };


  return (

    <div className="notification-settings-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="notification-settings-heading">


        <div className="notification-heading-icon">
          <FaBell />
        </div>


        <div>

          <h2>
            Notification Settings
          </h2>


          <p>
            Control system and administrator notification
            preferences.
          </p>

        </div>


      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (

        <div className="notification-settings-success">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>

      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="notification-settings-card">


        {/* =================================================
            CARD HEADER
        ================================================= */}

        <div className="notification-card-header">


          <div className="notification-card-icon">
            <FaBell />
          </div>


          <div>

            <h3>
              Notification Preferences
            </h3>


            <p>
              Choose which alerts your administrators
              should receive.
            </p>

          </div>


        </div>


        {/* =================================================
            NOTIFICATION OPTIONS
        ================================================= */}

        <div className="notification-settings-options">


          {/* SYSTEM NOTIFICATIONS */}

          <NotificationOption
            icon={<FaBell />}
            title="System Notifications"
            description="Receive notifications about important system events."
            enabled={notifications}
            setEnabled={setNotifications}
          />


          {/* EMAIL ALERTS */}

          <NotificationOption
            icon={<FaEnvelope />}
            title="Email Alerts"
            description="Send important hotel updates through email."
            enabled={emailAlerts}
            setEnabled={setEmailAlerts}
          />


          {/* BOOKING ALERTS */}

          <NotificationOption
            icon={<FaHotel />}
            title="Booking Alerts"
            description="Receive alerts whenever a new booking is created."
            enabled={bookingAlerts}
            setEnabled={setBookingAlerts}
          />


          {/* PAYMENT ALERTS */}

          <NotificationOption
            icon={<FaDatabase />}
            title="Payment Alerts"
            description="Receive notifications when payment activity occurs."
            enabled={paymentAlerts}
            setEnabled={setPaymentAlerts}
          />


        </div>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="notification-settings-actions">


          <button
            type="button"
            className="notification-cancel-btn"
            onClick={handleCancel}
          >

            <FaTimes />

            Cancel

          </button>


          <button
            type="button"
            className="notification-save-btn"
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


/* =====================================================
   NOTIFICATION OPTION COMPONENT
===================================================== */

function NotificationOption({
  icon,
  title,
  description,
  enabled,
  setEnabled,
}) {

  return (

    <div className="notification-option">


      {/* ICON */}

      <div className="notification-option-icon">
        {icon}
      </div>


      {/* TEXT */}

      <div className="notification-option-content">

        <strong>
          {title}
        </strong>


        <span>
          {description}
        </span>

      </div>


      {/* TOGGLE */}

      <button
        type="button"
        className={`notification-toggle ${
          enabled ? "active" : ""
        }`}
        onClick={() => setEnabled(!enabled)}
        aria-label={`Toggle ${title}`}
      >

        <span className="notification-toggle-circle"></span>

        <span className="notification-toggle-text">
          {enabled ? "ON" : "OFF"}
        </span>

      </button>


    </div>

  );
}


export default NotificationSettings;