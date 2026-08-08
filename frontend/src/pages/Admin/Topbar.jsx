import React from "react";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import "./Topbar.css";
function Topbar() {
  return (
    <div className="topbar">

      {/* Search */}
      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      {/* Right Side */}
      <div className="topbar-right">

        <div className="notification">
          <FaBell />
          <span className="notification-dot"></span>
        </div>

        <div className="admin-profile">
          <FaUserCircle className="profile-icon" />

          <div>
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Topbar;