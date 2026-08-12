import React, { useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import "./CustomerProfile.css";

function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Guest User",
    email: "guest@example.com",
    phone: "+91 98765 43210",
    address: "Hyderabad, Telangana, India",
  });

  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    setProfile(formData);
    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  return (
    <div className="customer-layout">

      {/* ================= SIDEBAR ================= */}

      <CustomerSidebar />

      {/* ================= MAIN ================= */}

      <div className="customer-main">

        {/* ================= TOPBAR ================= */}

        <CustomerTopbar />

        {/* ================= PROFILE CONTENT ================= */}

        <main className="customer-profile-page">

          {/* PAGE HEADER */}

          <div className="customer-profile-header">

            <div>
              <h1>My Profile</h1>
              <p>Manage your personal information</p>
            </div>

            {!isEditing && (
              <button
                className="profile-edit-btn"
                onClick={handleEdit}
              >
                <FaEdit />
                Edit Profile
              </button>
            )}

          </div>


          {/* ================= PROFILE CARD ================= */}

          <div className="customer-profile-card">

            {/* PROFILE HEADER */}

            <div className="profile-card-header">

              <div className="profile-avatar">
                <FaUser />
              </div>

              <div className="profile-name-section">
                <h2>{profile.fullName}</h2>
                <p>Customer</p>
              </div>

            </div>


            {/* PROFILE FORM */}

            <form
              className="profile-form"
              onSubmit={handleSave}
            >

              {/* FULL NAME */}

              <div className="profile-form-group">

                <label>
                  Full Name
                </label>

                <div className="profile-input-wrapper">

                  <FaUser />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="profile-form-group">

                <label>
                  Email Address
                </label>

                <div className="profile-input-wrapper">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="profile-form-group">

                <label>
                  Phone Number
                </label>

                <div className="profile-input-wrapper">

                  <FaPhone />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />

                </div>

              </div>


              {/* ADDRESS */}

              <div className="profile-form-group profile-full-width">

                <label>
                  Address
                </label>

                <div className="profile-input-wrapper profile-textarea-wrapper">

                  <FaMapMarkerAlt />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    rows="4"
                  />

                </div>

              </div>


              {/* ACTION BUTTONS */}

              {isEditing && (
                <div className="profile-form-actions">

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-btn"
                  >
                    <FaSave />
                    Save Changes
                  </button>

                </div>
              )}

            </form>

          </div>


          {/* ================= ACCOUNT INFORMATION ================= */}

          <div className="profile-information-card">

            <div className="profile-information-header">
              <h2>Account Information</h2>
              <p>Your account details</p>
            </div>

            <div className="profile-information-grid">

              <div className="profile-information-item">
                <span>Account Type</span>
                <strong>Customer</strong>
              </div>

              <div className="profile-information-item">
                <span>Account Status</span>
                <strong className="profile-active-status">
                  Active
                </strong>
              </div>

              <div className="profile-information-item">
                <span>Email Verification</span>
                <strong className="profile-verified-status">
                  Verified
                </strong>
              </div>

              <div className="profile-information-item">
                <span>Member Since</span>
                <strong>August 2026</strong>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default CustomerProfile;