import React from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";

import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaCalendarCheck,
  FaUsers,
  FaHotel,
  FaMoneyBillWave,
  FaArrowUp,
  FaDownload,
  FaFileAlt,
} from "react-icons/fa";

import "./SuperAdminReports.css";

function SuperAdminReports() {
  return (
    <div className="super-admin-layout">

      {/* ================= SIDEBAR ================= */}
      <SuperAdminSidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="super-admin-main">

        {/* ================= TOPBAR ================= */}
        <SuperAdminTopbar />

        {/* ================= REPORTS ================= */}
        <main className="super-admin-reports">

          {/* ================= PAGE HEADER ================= */}
          <div className="reports-page-header">

            <div className="reports-header-content">
              <h1>Reports & Analytics</h1>

              <p>
                Monitor hotel performance, bookings, users and revenue.
              </p>
            </div>

            <div className="reports-header-actions">

              <select className="reports-period-select">
                <option>This Month</option>
                <option>This Week</option>
                <option>This Year</option>
              </select>

              <button className="reports-download-btn">
                <FaDownload />
                Download Report
              </button>

            </div>

          </div>


          {/* ================= SUMMARY CARDS ================= */}
          <section className="reports-summary-grid">

            {/* REVENUE */}
            <div className="report-summary-card revenue">

              <div className="report-summary-icon">
                <FaMoneyBillWave />
              </div>

              <div className="report-summary-content">
                <span>Total Revenue</span>

                <h2>₹24.8L</h2>

                <small>
                  <FaArrowUp />
                  15% compared to last month
                </small>
              </div>

            </div>


            {/* BOOKINGS */}
            <div className="report-summary-card bookings">

              <div className="report-summary-icon">
                <FaCalendarCheck />
              </div>

              <div className="report-summary-content">
                <span>Total Bookings</span>

                <h2>1,284</h2>

                <small>
                  <FaArrowUp />
                  8% compared to last month
                </small>
              </div>

            </div>


            {/* USERS */}
            <div className="report-summary-card users">

              <div className="report-summary-icon">
                <FaUsers />
              </div>

              <div className="report-summary-content">
                <span>Total Users</span>

                <h2>248</h2>

                <small>
                  <FaArrowUp />
                  12% compared to last month
                </small>
              </div>

            </div>


            {/* ROOMS */}
            <div className="report-summary-card rooms">

              <div className="report-summary-icon">
                <FaHotel />
              </div>

              <div className="report-summary-content">
                <span>Room Occupancy</span>

                <h2>78%</h2>

                <small>
                  <FaArrowUp />
                  6% compared to last month
                </small>
              </div>

            </div>

          </section>


          {/* ================= CHART SECTION ================= */}
          <section className="reports-main-grid">

            {/* REVENUE REPORT */}
            <div className="reports-card revenue-chart-card">

              <div className="reports-card-header">

                <div className="reports-title">

                  <div className="reports-title-icon blue">
                    <FaChartLine />
                  </div>

                  <div>
                    <h2>Revenue Overview</h2>

                    <p>
                      Monthly revenue performance
                    </p>
                  </div>

                </div>

                <select className="reports-small-select">
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>

              </div>


              <div className="revenue-report-chart">

                <div className="revenue-y-axis">
                  <span>₹30L</span>
                  <span>₹25L</span>
                  <span>₹20L</span>
                  <span>₹15L</span>
                  <span>₹10L</span>
                  <span>₹5L</span>
                  <span>₹0</span>
                </div>


                <div className="revenue-chart-area">

                  <div className="revenue-grid-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>


                  <div className="revenue-bars">

                    <div className="revenue-bar-wrapper">
                      <div
                        className="revenue-bar"
                        style={{ height: "45%" }}
                      />
                      <span>Jan</span>
                    </div>

                    <div className="revenue-bar-wrapper">
                      <div
                        className="revenue-bar"
                        style={{ height: "55%" }}
                      />
                      <span>Feb</span>
                    </div>

                    <div className="revenue-bar-wrapper">
                      <div
                        className="revenue-bar"
                        style={{ height: "50%" }}
                      />
                      <span>Mar</span>
                    </div>

                    <div className="revenue-bar-wrapper">
                      <div
                        className="revenue-bar"
                        style={{ height: "68%" }}
                      />
                      <span>Apr</span>
                    </div>

                    <div className="revenue-bar-wrapper">
                      <div
                        className="revenue-bar"
                        style={{ height: "62%" }}
                      />
                      <span>May</span>
                    </div>

                    <div className="revenue-bar-wrapper">
                      <div
                        className="revenue-bar"
                        style={{ height: "76%" }}
                      />
                      <span>Jun</span>
                    </div>

                    <div className="revenue-bar-wrapper">
                      <div
                        className="revenue-bar"
                        style={{ height: "70%" }}
                      />
                      <span>Jul</span>
                    </div>

                    <div className="revenue-bar-wrapper active">
                      <div
                        className="revenue-bar"
                        style={{ height: "88%" }}
                      />
                      <span>Aug</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* BOOKING DISTRIBUTION */}
            <div className="reports-card booking-distribution-card">

              <div className="reports-card-header">

                <div className="reports-title">

                  <div className="reports-title-icon purple">
                    <FaChartPie />
                  </div>

                  <div>
                    <h2>Booking Distribution</h2>

                    <p>
                      Current booking status
                    </p>
                  </div>

                </div>

              </div>


              <div className="booking-distribution">

                <div className="booking-donut">

                  <div className="booking-donut-center">

                    <strong>1,284</strong>

                    <span>Bookings</span>

                  </div>

                </div>


                <div className="booking-legend">

                  <div className="booking-legend-item">
                    <span className="legend-dot confirmed" />

                    <div>
                      <span>Confirmed</span>
                      <strong>68%</strong>
                    </div>
                  </div>


                  <div className="booking-legend-item">
                    <span className="legend-dot pending" />

                    <div>
                      <span>Pending</span>
                      <strong>18%</strong>
                    </div>
                  </div>


                  <div className="booking-legend-item">
                    <span className="legend-dot cancelled" />

                    <div>
                      <span>Cancelled</span>
                      <strong>9%</strong>
                    </div>
                  </div>


                  <div className="booking-legend-item">
                    <span className="legend-dot completed" />

                    <div>
                      <span>Completed</span>
                      <strong>5%</strong>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ================= PERFORMANCE REPORT ================= */}
          <section className="reports-performance-grid">

            {/* BOOKING PERFORMANCE */}
            <div className="reports-card">

              <div className="reports-card-header">

                <div className="reports-title">

                  <div className="reports-title-icon green">
                    <FaChartBar />
                  </div>

                  <div>
                    <h2>Booking Performance</h2>

                    <p>
                      Reservation statistics
                    </p>
                  </div>

                </div>

              </div>


              <div className="performance-list">

                <div className="performance-item">

                  <div className="performance-label">
                    <span>Confirmed Bookings</span>
                    <strong>874</strong>
                  </div>

                  <div className="performance-progress">
                    <span style={{ width: "78%" }} />
                  </div>

                </div>


                <div className="performance-item">

                  <div className="performance-label">
                    <span>Completed Bookings</span>
                    <strong>642</strong>
                  </div>

                  <div className="performance-progress green">
                    <span style={{ width: "65%" }} />
                  </div>

                </div>


                <div className="performance-item">

                  <div className="performance-label">
                    <span>Pending Bookings</span>
                    <strong>231</strong>
                  </div>

                  <div className="performance-progress orange">
                    <span style={{ width: "35%" }} />
                  </div>

                </div>


                <div className="performance-item">

                  <div className="performance-label">
                    <span>Cancelled Bookings</span>
                    <strong>115</strong>
                  </div>

                  <div className="performance-progress red">
                    <span style={{ width: "22%" }} />
                  </div>

                </div>

              </div>

            </div>


            {/* SYSTEM REPORTS */}
            <div className="reports-card">

              <div className="reports-card-header">

                <div className="reports-title">

                  <div className="reports-title-icon orange">
                    <FaFileAlt />
                  </div>

                  <div>
                    <h2>Available Reports</h2>

                    <p>
                      Generate detailed reports
                    </p>
                  </div>

                </div>

              </div>


              <div className="available-reports">

                <button className="available-report-item">

                  <div className="available-report-icon blue">
                    <FaCalendarCheck />
                  </div>

                  <div>
                    <strong>Booking Report</strong>
                    <span>Reservations and booking history</span>
                  </div>

                  <FaDownload />

                </button>


                <button className="available-report-item">

                  <div className="available-report-icon green">
                    <FaMoneyBillWave />
                  </div>

                  <div>
                    <strong>Revenue Report</strong>
                    <span>Income and payment statistics</span>
                  </div>

                  <FaDownload />

                </button>


                <button className="available-report-item">

                  <div className="available-report-icon purple">
                    <FaUsers />
                  </div>

                  <div>
                    <strong>User Report</strong>
                    <span>User registration statistics</span>
                  </div>

                  <FaDownload />

                </button>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default SuperAdminReports;