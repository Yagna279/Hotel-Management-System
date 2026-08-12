import React, { useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaBell,
  FaLock,
  FaEnvelope,
  FaSave,
  FaKey,
} from "react-icons/fa";

import "./CustomerSettings.css";

function CustomerSettings() {

  // =====================================================
  // SETTINGS STATE
  // =====================================================

  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingNotifications: true,
    promotionalEmails: false,
  });

  // =====================================================
  // PASSWORD STATE
  // =====================================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =====================================================
  // HANDLE SETTINGS CHANGE
  // =====================================================

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;

    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  // =====================================================
  // HANDLE PASSWORD CHANGE
  // =====================================================

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password changed successfully!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // =====================================================
  // RETURN
  // =====================================================

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

            {/* CARD HEADER */}

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


            {/* SETTINGS OPTIONS */}

            <div className="settings-options">

              {/* =================================================
                  EMAIL NOTIFICATIONS
              ================================================= */}

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
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleSettingChange}
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
                    name="bookingNotifications"
                    checked={settings.bookingNotifications}
                    onChange={handleSettingChange}
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
                    name="promotionalEmails"
                    checked={settings.promotionalEmails}
                    onChange={handleSettingChange}
                  />

                  <span className="settings-slider"></span>

                </label>

              </div>

            </div>

          </div>


          {/* =================================================
              SECURITY / PASSWORD
          ================================================= */}

          <div className="settings-card">

            {/* CARD HEADER */}

            <div className="settings-card-header">

              <div className="settings-header-icon red">
                <FaLock />
              </div>

              <div>

                <h2>
                  Security
                </h2>

                <p>
                  Update your account password
                </p>

              </div>

            </div>


            {/* PASSWORD FORM */}

            <form
              className="password-form"
              onSubmit={handleChangePassword}
            >

              {/* =================================================
                  CURRENT PASSWORD
              ================================================= */}

              <div className="password-form-group">

                <label>
                  Current Password
                </label>

                <div className="password-input">

                  <FaLock />

                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />

                </div>

              </div>


              {/* =================================================
                  NEW PASSWORD
              ================================================= */}

              <div className="password-form-group">

                <label>
                  New Password
                </label>

                <div className="password-input">

                  <FaKey />

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />

                </div>

              </div>


              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="password-form-group">

                <label>
                  Confirm New Password
                </label>

                <div className="password-input">

                  <FaKey />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />

                </div>

              </div>


              {/* =================================================
                  CHANGE PASSWORD BUTTON
              ================================================= */}

              <button
                type="submit"
                className="change-password-btn"
              >
                <FaLock />
                Change Password
              </button>

            </form>

          </div>


          {/* =================================================
              SAVE SETTINGS
          ================================================= */}

          <div className="settings-save-section">

            <button
              type="button"
              className="settings-save-btn"
              onClick={handleSaveSettings}
            >
              <FaSave />
              Save Settings
            </button>

          </div>

        </main>

      </div>

    </>
  );
}

export default CustomerSettings;