import React from "react";
import { FaBell, FaSearch, FaUser } from "react-icons/fa";
import "./CustomerTopbar.css";

function CustomerTopbar() {

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Unable to read logged-in user:",
      error
    );
  }

  // =====================================================
  // CUSTOMER NAME
  // =====================================================

  const customerName =
    user?.full_name || "Customer";

  // =====================================================
  // CUSTOMER ROLE
  // =====================================================

  const customerRole =
    String(user?.role || "customer").toLowerCase();

  const displayRole =
    customerRole === "vip"
      ? "VIP Customer"
      : "Customer";

  return (
    <header className="customer-topbar">

      {/* ================= SEARCH ================= */}

      <div className="customer-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
        />

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="customer-topbar-right">

        {/* ================= NOTIFICATION ================= */}

        <button
          type="button"
          className="customer-notification"
        >

          <FaBell />

          <span></span>

        </button>


        {/* ================= PROFILE ================= */}

        <div className="customer-profile">

          <div className="customer-profile-icon">

            <FaUser />

          </div>


          <div className="customer-profile-info">

            <strong>
              {customerName}
            </strong>

            <span>
              {displayRole}
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default CustomerTopbar;