import React from "react";
import { FaBell, FaSearch, FaUser } from "react-icons/fa";
import "./Customer.css";

function CustomerTopbar() {
  return (
    <header className="customer-topbar">

      {/* Search */}
      <div className="customer-search">
        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      {/* Right Side */}
      <div className="customer-topbar-right">

        {/* Notification */}
        <button
          type="button"
          className="customer-notification"
        >
          <FaBell />
          <span></span>
        </button>

        {/* Profile */}
        <div className="customer-profile">

          <div className="customer-profile-icon">
            <FaUser />
          </div>

          <div className="customer-profile-info">
            <strong>Yagna</strong>
            <span>Customer</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default CustomerTopbar;