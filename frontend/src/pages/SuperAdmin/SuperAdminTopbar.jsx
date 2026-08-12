import React from "react";

import {
  FaSearch,
  FaBell,
  FaUserShield,
} from "react-icons/fa";

import "./SuperAdminTopbar.css";

function SuperAdminTopbar() {
  return (
    <header className="superadmin-topbar">

      {/* ================= LEFT SECTION ================= */}

      <div className="superadmin-topbar-left">

        <div className="superadmin-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>


      {/* ================= RIGHT SECTION ================= */}

      <div className="superadmin-topbar-right">

        {/* Notification */}

        <button
          type="button"
          className="superadmin-notification"
          aria-label="Notifications"
        >
          <FaBell />

          <span className="superadmin-notification-dot"></span>
        </button>


        {/* Divider */}

        <div className="superadmin-topbar-divider"></div>


        {/* Admin Profile */}

        <div className="superadmin-profile">

          <div className="superadmin-profile-icon">
            <FaUserShield />
          </div>

          <div className="superadmin-profile-info">

            <strong>Super Admin</strong>

            <span>Administrator</span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default SuperAdminTopbar;