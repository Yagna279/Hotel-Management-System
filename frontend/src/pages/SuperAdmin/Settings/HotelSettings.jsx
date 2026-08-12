import React, { useState } from "react";

import {
  FaHotel,
  FaSave,
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaBed,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

import "./HotelSettings.css";

function HotelSettings() {
  const [hotelName, setHotelName] = useState("Shnoor Hotel");

  const [location, setLocation] = useState(
    "Hyderabad, Telangana"
  );

  const [address, setAddress] = useState(
    "Hyderabad, Telangana, India"
  );

  const [checkIn, setCheckIn] = useState("14:00");

  const [checkOut, setCheckOut] = useState("11:00");

  const [roomTypes, setRoomTypes] = useState(
    "Standard, Deluxe, Suite"
  );

  const [message, setMessage] = useState("");

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = () => {
    setMessage("Hotel settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    setHotelName("Shnoor Hotel");

    setLocation("Hyderabad, Telangana");

    setAddress("Hyderabad, Telangana, India");

    setCheckIn("14:00");

    setCheckOut("11:00");

    setRoomTypes("Standard, Deluxe, Suite");

    setMessage("");
  };

  return (
    <div className="hotel-settings-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="hotel-settings-heading">

        <div className="hotel-heading-icon">
          <FaHotel />
        </div>

        <div>
          <h2>Hotel Settings</h2>

          <p>
            Manage your hotel information and operational settings.
          </p>
        </div>

      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {message && (
        <div className="hotel-settings-success">

          <FaCheckCircle />

          <span>{message}</span>

        </div>
      )}

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="hotel-settings-card">

        {/* =====================================================
            CARD HEADER
        ===================================================== */}

        <div className="hotel-card-header">

          <div className="hotel-card-icon">
            <FaBuilding />
          </div>

          <div>
            <h3>Hotel Information</h3>

            <p>
              Configure your hotel's basic information,
              address and operational timings.
            </p>
          </div>

        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="hotel-settings-form">

          {/* HOTEL NAME */}

          <div className="hotel-form-group">

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

          {/* HOTEL LOCATION */}

          <div className="hotel-form-group">

            <label>
              <FaMapMarkerAlt />
              Hotel Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Enter hotel location"
            />

          </div>

          {/* HOTEL ADDRESS */}

          <div className="hotel-form-group full-width">

            <label>
              <FaMapMarkerAlt />
              Hotel Address
            </label>

            <input
              type="text"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Enter complete hotel address"
            />

          </div>

          {/* CHECK IN */}

          <div className="hotel-form-group">

            <label>
              <FaClock />
              Check-in Time
            </label>

            <input
              type="time"
              value={checkIn}
              onChange={(e) =>
                setCheckIn(e.target.value)
              }
            />

          </div>

          {/* CHECK OUT */}

          <div className="hotel-form-group">

            <label>
              <FaClock />
              Check-out Time
            </label>

            <input
              type="time"
              value={checkOut}
              onChange={(e) =>
                setCheckOut(e.target.value)
              }
            />

          </div>

          {/* ROOM TYPES */}

          <div className="hotel-form-group full-width">

            <label>
              <FaBed />
              Available Room Types
            </label>

            <input
              type="text"
              value={roomTypes}
              onChange={(e) =>
                setRoomTypes(e.target.value)
              }
              placeholder="Standard, Deluxe, Suite"
            />

            <small className="hotel-help-text">
              Separate room types using commas.
            </small>

          </div>

        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="hotel-settings-actions">

          <button
            type="button"
            className="hotel-cancel-btn"
            onClick={handleCancel}
          >
            <FaTimes />
            Cancel
          </button>

          <button
            type="button"
            className="hotel-save-btn"
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

export default HotelSettings;