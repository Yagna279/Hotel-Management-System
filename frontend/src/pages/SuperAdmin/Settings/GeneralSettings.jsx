import React, { useState } from "react";

import {
  FaUserShield,
  FaSave,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

import "./GeneralSettings.css";

function GeneralSettings() {
  // =====================================================
  // DEFAULT VALUES
  // =====================================================

  const defaultSettings = {
    systemName: "Shnoor Hotel Management System",
    systemEmail: "admin@shnoorhotel.com",
    contactNumber: "+91 98765 43210",
    website: "www.shnoorhotel.com",
    hotelName: "Shnoor Hotel",
    hotelAddress: "Hyderabad, Telangana, India",
    description:
      "Premium hotel management system for managing rooms, bookings, customers and hotel operations.",
  };

  // =====================================================
  // STATES
  // =====================================================

  const [systemName, setSystemName] = useState(
    defaultSettings.systemName
  );

  const [systemEmail, setSystemEmail] = useState(
    defaultSettings.systemEmail
  );

  const [contactNumber, setContactNumber] = useState(
    defaultSettings.contactNumber
  );

  const [website, setWebsite] = useState(
    defaultSettings.website
  );

  const [hotelName, setHotelName] = useState(
    defaultSettings.hotelName
  );

  const [hotelAddress, setHotelAddress] = useState(
    defaultSettings.hotelAddress
  );

  const [description, setDescription] = useState(
    defaultSettings.description
  );

  const [message, setMessage] = useState("");

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = () => {
    setMessage("General settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    setSystemName(defaultSettings.systemName);
    setSystemEmail(defaultSettings.systemEmail);
    setContactNumber(defaultSettings.contactNumber);
    setWebsite(defaultSettings.website);
    setHotelName(defaultSettings.hotelName);
    setHotelAddress(defaultSettings.hotelAddress);
    setDescription(defaultSettings.description);

    setMessage("Changes cancelled.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="general-settings-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="general-settings-heading">

        <div className="general-heading-icon">
          <FaUserShield />
        </div>

        <div>
          <h2>General Settings</h2>

          <p>
            Configure the basic information and preferences
            of your hotel management system.
          </p>
        </div>

      </div>


      {/* =================================================
          SUCCESS / MESSAGE
      ================================================= */}

      {message && (
        <div className="general-settings-success">
          <FaCheckCircle />
          <span>{message}</span>
        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="general-settings-card">


        {/* =================================================
            CARD HEADER
        ================================================= */}

        <div className="general-card-header">

          <div className="general-card-icon">
            <FaBuilding />
          </div>

          <div>
            <h3>System Information</h3>

            <p>
              Manage your hotel's general system information.
            </p>
          </div>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <div className="general-settings-form">


          {/* SYSTEM NAME */}

          <div className="general-form-group">

            <label>
              <FaBuilding />
              System Name
            </label>

            <input
              type="text"
              value={systemName}
              onChange={(e) =>
                setSystemName(e.target.value)
              }
              placeholder="Enter system name"
            />

          </div>


          {/* SYSTEM EMAIL */}

          <div className="general-form-group">

            <label>
              <FaEnvelope />
              System Email
            </label>

            <input
              type="email"
              value={systemEmail}
              onChange={(e) =>
                setSystemEmail(e.target.value)
              }
              placeholder="Enter system email"
            />

          </div>


          {/* CONTACT */}

          <div className="general-form-group">

            <label>
              <FaPhone />
              Contact Number
            </label>

            <input
              type="text"
              value={contactNumber}
              onChange={(e) =>
                setContactNumber(e.target.value)
              }
              placeholder="Enter contact number"
            />

          </div>


          {/* WEBSITE */}

          <div className="general-form-group">

            <label>
              <FaGlobe />
              Website
            </label>

            <input
              type="text"
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
              placeholder="Enter website"
            />

          </div>


          {/* HOTEL NAME */}

          <div className="general-form-group">

            <label>
              <FaBuilding />
              Hotel Name
            </label>

            <input
              type="text"
              value={hotelName}
              onChange={(e) =>
                setHotelName(e.target.value)
              }
              placeholder="Enter hotel name"
            />

          </div>


          {/* HOTEL ADDRESS */}

          <div className="general-form-group">

            <label>
              <FaMapMarkerAlt />
              Hotel Address
            </label>

            <input
              type="text"
              value={hotelAddress}
              onChange={(e) =>
                setHotelAddress(e.target.value)
              }
              placeholder="Enter hotel address"
            />

          </div>


          {/* DESCRIPTION */}

          <div className="general-form-group full-width">

            <label>
              <FaInfoCircle />
              System Description
            </label>

            <textarea
              rows="6"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter system description"
            />

          </div>

        </div>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        {/* ACTIONS */}
<div className="general-settings-actions">

  <button
    type="button"
    className="general-cancel-btn"
    onClick={() => {
      setSystemName("Shnoor Hotel Management System");
      setSystemEmail("admin@shnoorhotel.com");
      setContactNumber("+91 98765 43210");
      setWebsite("www.shnoorhotel.com");
      setHotelName("Shnoor Hotel");
      setHotelAddress("Hyderabad, Telangana, India");
      setDescription(
        "Premium hotel management system for managing rooms, bookings, customers and hotel operations."
      );
      setMessage("");
    }}
  >
    Cancel
  </button>

  <button
    type="button"
    className="general-save-btn"
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

export default GeneralSettings;