import React from "react";
import logo from "../../assets/shnoor-logo.jpeg";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaBed,
  FaMoneyBillWave,
  FaUsers,
  FaConciergeBell,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Admin.css";

function Sidebar() {
  return (
    <div className="sidebar">

      {/* Logo */}
     <div className="sidebar-logo">
  <img src={logo} alt="Shnoor Logo" />

  <div className="sidebar-title">
    <h2>SHNOOR</h2>
    <p>Hotel Management System</p>
  </div>
</div>

      {/* Menu */}
      <ul className="sidebar-menu">

        <li className="active">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </li>

        <li>
          <FaCalendarCheck />
          <span>Reservations</span>
        </li>

        <li>
          <FaBed />
          <span>Rooms</span>
        </li>

        <li>
          <FaMoneyBillWave />
          <span>Payments</span>
        </li>

        <li>
          <FaUsers />
          <span>Customer Management</span>
        </li>

        <li>
          <FaConciergeBell />
          <span>Services</span>
        </li>

        <li>
          <FaChartBar />
          <span>Reports & Analysis</span>
        </li>

        <li>
          <FaCog />
          <span>Settings</span>
        </li>

      </ul>

      {/* Logout */}
      <button className="logout-btn">
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;