import React from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaBell,
  FaLock,
  FaEnvelope,
  FaKey,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./CustomerSettings.css";

function CustomerSettings() {

  const navigate = useNavigate();

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>

      {/* =================================================
          CUSTOMER SIDEBAR
      ================================================= */}

      <CustomerSidebar />


      {/* =================================================
          CUSTOMER MAIN
      ================================================= */}

      <div className="customer-main">

        {/* =================================================
            CUSTOMER TOPBAR
        ================================================= */}

        <CustomerTopbar />


        {/* =================================================
            SETTINGS PAGE
        ================================================= */}

        <main className="customer-settings-page">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="customer-settings-header">

            <div>

              <h1>Settings</h1>

              <p>
                Manage your account preferences and security
              </p>

            </div>

          </div>


          {/* =================================================
              NOTIFICATION SETTINGS
          ================================================= */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-header-icon blue">
                <FaBell />
              </div>

              <div>

                <h2>
                  Notification Preferences
                </h2>

                <p>
                  Choose how you want to receive notifications
                </p>

              </div>

            </div>


            {/* =================================================
                EMAIL NOTIFICATIONS
            ================================================= */}

            <div className="settings-options">

              <div className="settings-option">

                <div className="settings-option-icon">
                  <FaEnvelope />
                </div>

                <div className="settings-option-content">

                  <strong>
                    Email Notifications
                  </strong>

                  <span>
                    Receive important account notifications
                    through email
                  </span>

                </div>

                <label className="settings-switch">

                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span className="settings-slider"></span>

                </label>

              </div>


              {/* =================================================
                  BOOKING NOTIFICATIONS
              ================================================= */}

              <div className="settings-option">

                <div className="settings-option-icon">
                  <FaBell />
                </div>

                <div className="settings-option-content">

                  <strong>
                    Booking Notifications
                  </strong>

                  <span>
                    Get updates about your reservations
                  </span>

                </div>

                <label className="settings-switch">

                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span className="settings-slider"></span>

                </label>

              </div>


              {/* =================================================
                  PROMOTIONAL EMAILS
              ================================================= */}

              <div className="settings-option">

                <div className="settings-option-icon">
                  <FaEnvelope />
                </div>

                <div className="settings-option-content">

                  <strong>
                    Promotional Emails
                  </strong>

                  <span>
                    Receive special offers and hotel promotions
                  </span>

                </div>

                <label className="settings-switch">

                  <input
                    type="checkbox"
                  />

                  <span className="settings-slider"></span>

                </label>

              </div>

            </div>

          </div>


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-header-icon red">
                <FaLock />
              </div>

              <div>

                <h2>
                  Security
                </h2>

                <p>
                  Manage your account password
                </p>

              </div>

            </div>


            {/* =================================================
                CHANGE PASSWORD
            ================================================= */}

            <div
              style={{
                padding: "30px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >

              <button
                type="button"
                className="change-password-btn"
                onClick={handleChangePassword}
              >

                <FaKey />

                Change Password

              </button>

            </div>

          </div>

        </main>

      </div>

    </>
  );
}

export default CustomerSettings;