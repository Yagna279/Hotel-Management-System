import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Admin.css";

import {
  FaBed,
  FaCalendarCheck,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";

function AdminDashboard() {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="admin-main">

        {/* Top Navigation */}
        <Topbar />

        <div className="admin-content">

          {/* Heading */}
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Welcome back, Admin 👋</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon blue">
                <FaBed />
              </div>

              <div>
                <h3>150</h3>
                <p>Total Rooms</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <FaCalendarCheck />
              </div>

              <div>
                <h3>82</h3>
                <p>Reservations</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <FaUsers />
              </div>

              <div>
                <h3>245</h3>
                <p>Customers</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <FaMoneyBillWave />
              </div>

              <div>
                <h3>₹145677</h3>
                <p>Total Revenue</p>
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="dashboard-bottom">

            {/* Recent Reservations */}
            <div className="dashboard-box">

              <h2>Recent Reservations</h2>

              <table>

                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>Yagna</td>
                    <td>101</td>
                    <td>
                      <span className="status confirmed">
                        Confirmed
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Dileep</td>
                    <td>205</td>
                    <td>
                      <span className="status pending">
                        Pending
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Dhoni</td>
                    <td>309</td>
                    <td>
                      <span className="status checked">
                        Checked In
                      </span>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

            {/* Room Status */}
            <div className="dashboard-box">

              <h2>Room Status</h2>

              <div className="room-status">

                <div>
                  <h3>120</h3>
                  <p>Available</p>
                </div>

                <div>
                  <h3>25</h3>
                  <p>Occupied</p>
                </div>

                <div>
                  <h3>5</h3>
                  <p>Maintenance</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;