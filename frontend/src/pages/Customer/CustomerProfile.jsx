import React, { useEffect, useState } from "react";

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

  // =====================================================
  // STATE
  // =====================================================

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });


  // =====================================================
  // API BASE URL
  // =====================================================

  const API_URL =
    "http://localhost:5000/api/customer/account";


  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getToken = () => {

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken")
    );

  };


  // =====================================================
  // FETCH CUSTOMER PROFILE
  // =====================================================

  const fetchProfile = async () => {

    try {

      setLoading(true);

      setError("");

      const token = getToken();


      // =================================================
      // CHECK LOGIN
      // =================================================

      if (!token) {

        setError(
          "You are not logged in. Please login again."
        );

        setLoading(false);

        return;

      }


      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        `${API_URL}/profile`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      // =================================================
      // READ RESPONSE
      // =================================================

      const data =
        await response.json();


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load profile."
        );

      }


      // =================================================
      // CUSTOMER DATA
      // =================================================

      const customer =
        data.customer;


      if (!customer) {

        throw new Error(
          "Customer profile was not returned by the server."
        );

      }


      // =================================================
      // FORMAT PROFILE
      // =================================================

      const profileData = {

        id:
          customer.id || "",

        fullName:
          customer.full_name || "",

        email:
          customer.email || "",

        phone:
          customer.phone || "",

        address:
          customer.address || "",

        role:
          customer.role || "customer",

      };


      // =================================================
      // SAVE PROFILE STATE
      // =================================================

      setProfile(
        profileData
      );


      // =================================================
      // SAVE FORM STATE
      // =================================================

      setFormData({

        fullName:
          profileData.fullName,

        email:
          profileData.email,

        phone:
          profileData.phone,

        address:
          profileData.address,

      });


    } catch (error) {

      console.error(
        "FETCH PROFILE ERROR:",
        error
      );


      setError(
        error.message ||
        "Failed to load profile."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD PROFILE WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    fetchProfile();

  }, []);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData({

      ...formData,

      [name]:
        value,

    });

  };


  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEdit = () => {

    setFormData({

      fullName:
        profile.fullName,

      email:
        profile.email,

      phone:
        profile.phone,

      address:
        profile.address,

    });


    setError("");

    setIsEditing(true);

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {

    setFormData({

      fullName:
        profile.fullName,

      email:
        profile.email,

      phone:
        profile.phone,

      address:
        profile.address,

    });


    setError("");

    setIsEditing(false);

  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (e) => {

    e.preventDefault();


    try {

      setSaving(true);

      setError("");


      const token =
        getToken();


      // =================================================
      // CHECK LOGIN
      // =================================================

      if (!token) {

        setError(
          "You are not logged in. Please login again."
        );

        return;

      }


      // =================================================
      // BASIC VALIDATION
      // =================================================

      if (
        !formData.fullName.trim()
      ) {

        setError(
          "Full name is required."
        );

        return;

      }


      if (
        !formData.email.trim()
      ) {

        setError(
          "Email address is required."
        );

        return;

      }


      // =================================================
      // UPDATE PROFILE
      // =================================================

      const response = await fetch(
        `${API_URL}/profile`,
        {
          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify({

            full_name:
              formData.fullName.trim(),

            email:
              formData.email.trim(),

            phone:
              formData.phone.trim(),

            address:
              formData.address.trim(),

          }),

        }
      );


      // =================================================
      // READ RESPONSE
      // =================================================

      const data =
        await response.json();


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update profile."
        );

      }


      // =================================================
      // UPDATED CUSTOMER
      // =================================================

      const customer =
        data.customer;


      if (!customer) {

        throw new Error(
          "Updated customer data was not returned."
        );

      }


      // =================================================
      // FORMAT UPDATED PROFILE
      // =================================================

      const updatedProfile = {

        id:
          customer.id ||
          profile.id,

        fullName:
          customer.full_name || "",

        email:
          customer.email || "",

        phone:
          customer.phone || "",

        address:
          customer.address || "",

        role:
          customer.role ||
          "customer",

      };


      // =================================================
      // UPDATE PROFILE STATE
      // =================================================

      setProfile(
        updatedProfile
      );


      // =================================================
      // UPDATE FORM
      // =================================================

      setFormData({

        fullName:
          updatedProfile.fullName,

        email:
          updatedProfile.email,

        phone:
          updatedProfile.phone,

        address:
          updatedProfile.address,

      });


      // =================================================
      // EXIT EDIT MODE
      // =================================================

      setIsEditing(false);


      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Profile updated successfully!"
      );


    } catch (error) {

      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );


      setError(
        error.message ||
        "Failed to update profile."
      );


    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {

    return (

      <div className="customer-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-profile-page">

            <div className="customer-profile-card">

              <h2>
                Loading profile...
              </h2>

            </div>

          </main>

        </div>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="customer-layout">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <CustomerSidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="customer-main">


        {/* =================================================
            TOPBAR
        ================================================= */}

        <CustomerTopbar />


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="customer-profile-page">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="customer-profile-header">

            <div>

              <h1>
                My Profile
              </h1>

              <p>
                Manage your personal information
              </p>

            </div>


            {!isEditing && (

              <button
                type="button"
                className="profile-edit-btn"
                onClick={handleEdit}
              >

                <FaEdit />

                Edit Profile

              </button>

            )}

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="profile-error">

              {error}

            </div>

          )}


          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div className="customer-profile-card">


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="profile-card-header">

              <div className="profile-avatar">

                <FaUser />

              </div>


              <div className="profile-name-section">

                <h2>

                  {profile.fullName ||
                    "Customer"}

                </h2>


                <p>

                  {profile.role
                    ? profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)
                    : "Customer"}

                </p>

              </div>

            </div>


            {/* =================================================
                PROFILE FORM
            ================================================= */}

            <form
              className="profile-form"
              onSubmit={handleSave}
            >


              {/* =================================================
                  FULL NAME
              ================================================= */}

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


              {/* =================================================
                  EMAIL
              ================================================= */}

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


              {/* =================================================
                  PHONE
              ================================================= */}

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


              {/* =================================================
                  ADDRESS
              ================================================= */}

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


              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              {isEditing && (

                <div className="profile-form-actions">


                  {/* CANCEL */}

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                    disabled={saving}
                  >

                    <FaTimes />

                    Cancel

                  </button>


                  {/* SAVE */}

                  <button
                    type="submit"
                    className="profile-save-btn"
                    disabled={saving}
                  >

                    <FaSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"
                    }

                  </button>

                </div>

              )}

            </form>

          </div>


          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}

          <div className="profile-information-card">


            <div className="profile-information-header">

              <h2>
                Account Information
              </h2>

              <p>
                Your account details
              </p>

            </div>


            <div className="profile-information-grid">


              {/* =================================================
                  CUSTOMER ID
              ================================================= */}

              <div className="profile-information-item">

                <span>
                  Customer ID
                </span>

                <strong>
                  {profile.id || "-"}
                </strong>

              </div>


              {/* =================================================
                  ACCOUNT TYPE
              ================================================= */}

              <div className="profile-information-item">

                <span>
                  Account Type
                </span>

                <strong>

                  {profile.role
                    ? profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)
                    : "Customer"}

                </strong>

              </div>


              {/* =================================================
                  ACCOUNT STATUS
              ================================================= */}

              <div className="profile-information-item">

                <span>
                  Account Status
                </span>

                <strong className="profile-active-status">

                  Active

                </strong>

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="profile-information-item">

                <span>
                  Email
                </span>

                <strong className="profile-verified-status">

                  {profile.email || "-"}

                </strong>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}


export default CustomerProfile;