import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Admin.css";

import {
  FaCalendarCheck,
  FaUsers,
  FaMoneyBillWave,
  FaDoorOpen,
  FaTools,
} from "react-icons/fa";

import { MdHotel } from "react-icons/md";

function AdminDashboard() {
  return (
    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          {/* Header */}

          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Welcome back, Admin</p>
          </div>

          {/* Statistics */}

          <div className="stats-grid">

            {/* Total Rooms */}

            <div className="stat-card">
              <div className="icon-box blue">
                <MdHotel className="stat-icon" />
              </div>

              <div>
                <h3>150</h3>
                <p>Total Rooms</p>
              </div>
            </div>

            {/* Reservations */}

            <div className="stat-card">
              <div className="icon-box green">
                <FaCalendarCheck className="stat-icon" />
              </div>

              <div>
                <h3>82</h3>
                <p>Reservations</p>
              </div>
            </div>

            {/* Customers */}

            <div className="stat-card">
              <div className="icon-box orange">
                <FaUsers className="stat-icon" />
              </div>

              <div>
                <h3>245</h3>
                <p>Customers</p>
              </div>
            </div>

            {/* Revenue */}

            <div className="stat-card">
              <div className="icon-box purple">
                <FaMoneyBillWave className="stat-icon" />
              </div>

              <div>
                <h3>₹1,45,677</h3>
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
                    <th>Check In Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>Yagna</td>
                    <td>101</td>
                    <td>06 Aug 2026</td>
                    <td>
                      <span className="status confirmed">
                        Confirmed
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Dileep</td>
                    <td>205</td>
                    <td>08 Aug 2026</td>
                    <td>
                      <span className="status pending">
                        Pending
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Dhoni</td>
                    <td>309</td>
                    <td>10 Aug 2026</td>
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

                {/* Available */}

                <div className="status-card">

                  <div className="status-icon-box green">
                    <FaDoorOpen className="status-icon" />
                  </div>

                  <div className="status-info">
                    <h3>120</h3>
                    <p>Available</p>
                  </div>

                </div>

                {/* Occupied */}

                <div className="status-card">

                  <div className="status-icon-box orange">
                    <MdHotel className="status-icon" />
                  </div>

                  <div className="status-info">
                    <h3>25</h3>
                    <p>Occupied</p>
                  </div>

                </div>

                {/* Maintenance */}

                <div className="status-card">

                  <div className="status-icon-box red">
                    <FaTools className="status-icon" />
                  </div>

                  <div className="status-info">
                    <h3>5</h3>
                    <p>Maintenance</p>
                  </div>

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