import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaHotel,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaBell,
  FaLock,
  FaSave,
} from "react-icons/fa";

import "./Settings.css";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Topbar />

        <div className="admin-content">
          {/* Header */}

          <div className="settings-header">
            <h1>Settings</h1>
            <p>Manage hotel preferences and admin account</p>
          </div>

          {/* Settings Card */}

          <div className="settings-card">
            {/* Form Grid */}

            <div className="settings-grid">
              <div className="input-box">
                <label>
                  <FaHotel /> Hotel Name
                </label>

                <input
                  type="text"
                  defaultValue="Shnoor Hotel"
                />
              </div>

              <div className="input-box">
                <label>
                  <FaUser /> Admin Name
                </label>

                <input
                  type="text"
                  defaultValue="Administrator"
                />
              </div>

              <div className="input-box">
                <label>
                  <FaEnvelope /> Email
                </label>

                <input
                  type="email"
                  defaultValue="admin@shnoor.com"
                />
              </div>

              <div className="input-box">
                <label>
                  <FaPhone /> Phone
                </label>

                <input
                  type="text"
                  defaultValue="+91 9876543210"
                />
              </div>

              <div className="input-box full-width">
                <label>
                  <FaMapMarkerAlt /> Address
                </label>

                <input
                  type="text"
                  defaultValue="Hyderabad, Telangana, India"
                />
              </div>

              <div className="input-box">
                <label>
                  <FaGlobe /> Currency
                </label>

                <select>
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>

              <div className="input-box">
                <label>
                  <FaGlobe /> Time Zone
                </label>

                <select>
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </select>
              </div>

              <div className="input-box full-width">
                <label>
                  <FaLock /> Change Password
                </label>

                <div className="change-password-wrapper">
                  <button
                    className="change-password-btn"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}

            <div className="notification-row">
              <div>
                <FaBell />
                <span>Enable Email Notifications</span>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />

                <span className="slider"></span>
              </label>
            </div>

            {/* Save Button */}

            <button className="save-btn">
              <FaSave />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;