import React, { useState } from "react";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import "./Topbar.css";

function Topbar({ onSearch }) {

  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchText);
    }
  };

  return (
    <div className="topbar">

      {/* Search */}
      <div className="search-box">

        <FaSearch
          className="search-icon"
          onClick={() => handleSearch(searchText)}
        />

        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
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