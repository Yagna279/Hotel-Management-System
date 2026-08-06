import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaChartBar,
  FaMoneyBillWave,
  FaBed,
  FaUsers,
  FaCalendarCheck,
  FaDownload,
} from "react-icons/fa";

import "./Reports.css";

function Reports() {
  return (
    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          <div className="reports-header">

            <div>
              <h1>Reports & Analysis</h1>
              <p>Hotel performance overview</p>
            </div>

            <button className="download-btn">
              <FaDownload />
              Export Report
            </button>

          </div>

          {/* Statistics */}

          {/* Statistics */}

<div className="reports-stats">

  <div className="report-card">

    <div className="icon-box blue">
      <FaMoneyBillWave className="report-icon" />
    </div>

    <div>
      <h2>₹8,45,000</h2>
      <p>Total Revenue</p>
    </div>

  </div>

  <div className="report-card">

    <div className="icon-box green">
      <FaCalendarCheck className="report-icon" />
    </div>

    <div>
      <h2>425</h2>
      <p>Bookings</p>
    </div>

  </div>

  <div className="report-card">

    <div className="icon-box orange">
      <FaBed className="report-icon" />
    </div>

    <div>
      <h2>89%</h2>
      <p>Occupancy</p>
    </div>

  </div>

  <div className="report-card">

    <div className="icon-box purple">
      <FaUsers className="report-icon" />
    </div>

    <div>
      <h2>356</h2>
      <p>Customers</p>
    </div>

  </div>

</div>

           

          {/* Analysis */}

          <div className="analysis-grid">

            <div className="analysis-card">

              <h2>Revenue Overview</h2>

              <div className="progress-group">

                <label>Room Revenue</label>

                <div className="progress-bar">
                  <div className="progress fill1"></div>
                </div>

              </div>

              <div className="progress-group">

                <label>Restaurant</label>

                <div className="progress-bar">
                  <div className="progress fill2"></div>
                </div>

              </div>

              <div className="progress-group">

                <label>Spa Services</label>

                <div className="progress-bar">
                  <div className="progress fill3"></div>
                </div>

              </div>

              <div className="progress-group">

                <label>Transport</label>

                <div className="progress-bar">
                  <div className="progress fill4"></div>
                </div>

              </div>

            </div>

            <div className="analysis-card">

              <h2>Room Type Analysis</h2>

              <table>

                <tbody>

                  <tr>
                    <td>Deluxe Rooms</td>
                    <td>45%</td>
                  </tr>

                  <tr>
                    <td>Suite Rooms</td>
                    <td>30%</td>
                  </tr>

                  <tr>
                    <td>Standard Rooms</td>
                    <td>20%</td>
                  </tr>

                  <tr>
                    <td>Family Rooms</td>
                    <td>5%</td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* Monthly Revenue */}

          <div className="report-table">

            <h2>Monthly Revenue</h2>

            <table>

              <thead>

                <tr>

                  <th>Month</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                  <th>Occupancy</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>January</td>
                  <td>120</td>
                  <td>₹2,45,000</td>
                  <td>82%</td>

                </tr>

                <tr>

                  <td>February</td>
                  <td>145</td>
                  <td>₹2,90,000</td>
                  <td>87%</td>

                </tr>

                <tr>

                  <td>March</td>
                  <td>160</td>
                  <td>₹3,10,000</td>
                  <td>91%</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;