import React, { useEffect, useState } from "react";
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

  const navigate = useNavigate();

  /* =====================================================
     STATE
  ===================================================== */

  const [formData, setFormData] = useState({
    hotelName: "",
    adminName: "",
    email: "",
    phone: "",
    address: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
    emailNotifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  /* =====================================================
     LOAD SETTINGS FROM DATABASE
  ===================================================== */

  const loadSettings = async () => {

    try {

      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/admin/settings"
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load settings."
        );

      }

      const hotel = data.hotelSettings || {};
      const admin = data.admin || {};

      setFormData({

        hotelName:
          hotel.hotel_name || "",

        adminName:
          admin.full_name || "",

        email:
          admin.email || "",

        phone:
          hotel.phone || "",

        address:
          hotel.address || "",

        currency:
          hotel.currency || "INR",

        timezone:
          hotel.timezone || "Asia/Kolkata",

        emailNotifications:
          hotel.email_notifications ?? true,

      });

    } catch (error) {

      console.error(
        "Settings loading error:",
        error
      );

      setError(
        error.message ||
        "Unable to load settings."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     LOAD WHEN PAGE OPENS
  ===================================================== */

  useEffect(() => {

    loadSettings();

  }, []);


  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({

      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  };


  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSave = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/admin/settings",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save settings."
        );

      }

      setMessage(
        "Settings saved successfully."
      );

      /*
        Reload settings from database
        after saving.
      */

      await loadSettings();

    } catch (error) {

      console.error(
        "Settings save error:",
        error
      );

      setError(
        error.message ||
        "Unable to save settings."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =====================================================
     LOADING SCREEN
  ===================================================== */

  if (loading) {

    return (

      <div className="admin-container">

        <Sidebar />

        <div className="admin-main">

          <Topbar />

          <div className="admin-content">

            <div className="settings-header">

              <h1>
                Settings
              </h1>

              <p>
                Loading hotel settings...
              </p>

            </div>

          </div>

        </div>

      </div>

    );

  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (

    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="settings-header">

            <h1>
              Settings
            </h1>

            <p>
              Manage hotel preferences and admin account
            </p>

          </div>


          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {message && (

            <div className="settings-success">

              {message}

            </div>

          )}


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (

            <div className="settings-error">

              {error}

            </div>

          )}


          {/* =================================================
              SETTINGS CARD
          ================================================= */}

          <form
            className="settings-card"
            onSubmit={handleSave}
          >


            {/* =================================================
                FORM GRID
            ================================================= */}

            <div className="settings-grid">


              {/* =================================================
                  HOTEL NAME
              ================================================= */}

              <div className="input-box">

                <label>

                  <FaHotel />

                  Hotel Name

                </label>

                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* =================================================
                  ADMIN NAME
              ================================================= */}

              <div className="input-box">

                <label>

                  <FaUser />

                  Admin Name

                </label>

                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* =================================================
                  EMAIL - READ ONLY
              ================================================= */}

              <div className="input-box">

                <label>

                  <FaEnvelope />

                  Email

                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="readonly-input"
                />

                <small className="readonly-text">
                  Email cannot be changed from Settings.
                </small>

              </div>


              {/* =================================================
                  PHONE
              ================================================= */}

              <div className="input-box">

                <label>

                  <FaPhone />

                  Phone

                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>


              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div className="input-box full-width">

                <label>

                  <FaMapMarkerAlt />

                  Address

                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />

              </div>


              {/* =================================================
                  CURRENCY
              ================================================= */}

              <div className="input-box">

                <label>

                  <FaGlobe />

                  Currency

                </label>

                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >

                  <option value="INR">
                    INR (₹)
                  </option>

                  <option value="USD">
                    USD ($)
                  </option>

                  <option value="EUR">
                    EUR (€)
                  </option>

                </select>

              </div>


              {/* =================================================
                  TIME ZONE
              ================================================= */}

              <div className="input-box">

                <label>

                  <FaGlobe />

                  Time Zone

                </label>

                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                >

                  <option value="Asia/Kolkata">
                    Asia/Kolkata
                  </option>

                  <option value="UTC">
                    UTC
                  </option>

                  <option value="America/New_York">
                    America/New_York
                  </option>

                </select>

              </div>


              {/* =================================================
                  CHANGE PASSWORD
              ================================================= */}

              <div className="input-box full-width">

                <label>

                  <FaLock />

                  Change Password

                </label>

                <div className="change-password-wrapper">

                  <button
                    type="button"
                    className="change-password-btn"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                  >

                    Change Password

                  </button>

                </div>

              </div>

            </div>


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div className="notification-row">

              <div>

                <FaBell />

                <span>
                  Enable Email Notifications
                </span>

              </div>


              <label className="switch">

                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={
                    formData.emailNotifications
                  }
                  onChange={handleChange}
                />

                <span className="slider"></span>

              </label>

            </div>


            {/* =================================================
                SAVE BUTTON
            ================================================= */}

            <button
              className="save-btn"
              type="submit"
              disabled={saving}
            >

              <FaSave />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Settings;