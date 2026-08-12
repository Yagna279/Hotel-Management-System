import React from "react";

import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";

import {
  FaUsers,
  FaUserShield,
  FaHotel,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowRight,
  FaBed,
  FaUserPlus,
  FaBuilding,
  FaClipboardList,
  FaChartLine,
  FaCog,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaChartBar,
} from "react-icons/fa";

import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  return (
    <div className="super-admin-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SuperAdminSidebar />


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="super-admin-main">

        {/* =====================================================
            TOPBAR
        ===================================================== */}

        <SuperAdminTopbar />


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        <main className="super-admin-dashboard">

          {/* =====================================================
              WELCOME BANNER
          ===================================================== */}

          <section className="super-admin-welcome">

            <div className="welcome-content">

              <div className="welcome-text">

                <div className="welcome-label">
                  <FaChartBar />
                  <span>SUPER ADMIN DASHBOARD</span>
                </div>

                <h1>Welcome back, Super Admin</h1>

                <p>
                  Monitor your hotel management system, users, bookings
                  and revenue from one place.
                </p>

                <div className="welcome-badges">

                  <div className="welcome-badge operational">
                    <FaCheckCircle />
                    <span>System Operational</span>
                  </div>

                  <div className="welcome-badge">
                    <FaCalendarAlt />
                    <span>14 Aug 2026</span>
                  </div>

                  <div className="welcome-badge">
                    <FaClock />
                    <span>10:30 AM</span>
                  </div>

                </div>

              </div>


              {/* RIGHT SIDE WELCOME ICON */}

              <div className="welcome-visual">

                <div className="welcome-visual-circle circle-one"></div>
                <div className="welcome-visual-circle circle-two"></div>

                

              </div>

            </div>

          </section>


          {/* =====================================================
              STATISTICS
          ===================================================== */}

          <section className="super-admin-stats-grid">


            {/* USERS */}

            <div className="super-admin-stat-card users-card">

              <div className="super-admin-stat-top">

                <div className="super-admin-stat-icon users">
                  <FaUsers />
                </div>

              </div>

              <div className="super-admin-stat-content">

                <span>Total Users</span>

                <h2>248</h2>

                <small className="stat-positive">
                  <FaArrowUp />
                  <span>12% this month</span>
                </small>

              </div>

              <div className="mini-chart users-chart">
                <span style={{ height: "35%" }}></span>
                <span style={{ height: "55%" }}></span>
                <span style={{ height: "42%" }}></span>
                <span style={{ height: "70%" }}></span>
                <span style={{ height: "52%" }}></span>
                <span style={{ height: "76%" }}></span>
                <span style={{ height: "62%" }}></span>
                <span style={{ height: "82%" }}></span>
              </div>

            </div>


            {/* ADMINISTRATORS */}

            <div className="super-admin-stat-card admins-card">

              <div className="super-admin-stat-top">

                <div className="super-admin-stat-icon admins">
                  <FaUserShield />
                </div>

              </div>

              <div className="super-admin-stat-content">

                <span>Administrators</span>

                <h2>12</h2>

                <small className="stat-green">
                  <FaCheckCircle />
                  <span>Active administrators</span>
                </small>

              </div>

              <div className="mini-chart admins-chart">
                <span style={{ height: "45%" }}></span>
                <span style={{ height: "70%" }}></span>
                <span style={{ height: "50%" }}></span>
                <span style={{ height: "76%" }}></span>
                <span style={{ height: "58%" }}></span>
                <span style={{ height: "72%" }}></span>
                <span style={{ height: "65%" }}></span>
                <span style={{ height: "82%" }}></span>
              </div>

            </div>


            {/* ROOMS */}

            <div className="super-admin-stat-card rooms-card">

              <div className="super-admin-stat-top">

                <div className="super-admin-stat-icon rooms">
                  <FaHotel />
                </div>

              </div>

              <div className="super-admin-stat-content">

                <span>Total Rooms</span>

                <h2>156</h2>

                <small className="stat-orange">
                  <FaBed />
                  <span>Across the hotel</span>
                </small>

              </div>

              <div className="mini-chart rooms-chart">
                <span style={{ height: "40%" }}></span>
                <span style={{ height: "55%" }}></span>
                <span style={{ height: "48%" }}></span>
                <span style={{ height: "70%" }}></span>
                <span style={{ height: "62%" }}></span>
                <span style={{ height: "78%" }}></span>
                <span style={{ height: "68%" }}></span>
                <span style={{ height: "86%" }}></span>
              </div>

            </div>


            {/* BOOKINGS */}

            <div className="super-admin-stat-card bookings-card">

              <div className="super-admin-stat-top">

                <div className="super-admin-stat-icon bookings">
                  <FaCalendarCheck />
                </div>

              </div>

              <div className="super-admin-stat-content">

                <span>Total Bookings</span>

                <h2>1,284</h2>

                <small className="stat-positive">
                  <FaArrowUp />
                  <span>8% this month</span>
                </small>

              </div>

              <div className="mini-chart bookings-chart">
                <span style={{ height: "40%" }}></span>
                <span style={{ height: "65%" }}></span>
                <span style={{ height: "52%" }}></span>
                <span style={{ height: "78%" }}></span>
                <span style={{ height: "60%" }}></span>
                <span style={{ height: "84%" }}></span>
                <span style={{ height: "70%" }}></span>
                <span style={{ height: "88%" }}></span>
              </div>

            </div>


            {/* REVENUE */}

            <div className="super-admin-stat-card revenue-card">

              <div className="super-admin-stat-top">

                <div className="super-admin-stat-icon revenue">
                  <FaMoneyBillWave />
                </div>

              </div>

              <div className="super-admin-stat-content">

                <span>Total Revenue</span>

                <h2>₹24.8L</h2>

                <small className="stat-positive">
                  <FaArrowUp />
                  <span>15% this month</span>
                </small>

              </div>

              <div className="mini-chart revenue-chart">
                <span style={{ height: "48%" }}></span>
                <span style={{ height: "62%" }}></span>
                <span style={{ height: "52%" }}></span>
                <span style={{ height: "76%" }}></span>
                <span style={{ height: "65%" }}></span>
                <span style={{ height: "82%" }}></span>
                <span style={{ height: "74%" }}></span>
                <span style={{ height: "90%" }}></span>
              </div>

            </div>

          </section>


          {/* =====================================================
              CHARTS
          ===================================================== */}

          <section className="super-admin-charts-grid">


            {/* BOOKING OVERVIEW */}

            <div className="super-admin-chart-card">

              <div className="super-admin-chart-header">

                <div className="chart-title">

                  <div className="chart-title-icon blue">
                    <FaCalendarCheck />
                  </div>

                  <div>
                    <h2>Booking Overview</h2>
                    <p>Reservation activity</p>
                  </div>

                </div>

                <select className="chart-select">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>

              </div>


              <div className="booking-chart-container">

                <div className="chart-y-axis">
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>


                <div className="booking-chart-area">

                  <div className="chart-grid-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>


                  <svg
                    className="booking-line-chart"
                    viewBox="0 0 700 230"
                    preserveAspectRatio="none"
                  >

                    <defs>

                      <linearGradient
                        id="bookingGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#4f7ff5"
                          stopOpacity="0.25"
                        />

                        <stop
                          offset="100%"
                          stopColor="#4f7ff5"
                          stopOpacity="0"
                        />

                      </linearGradient>

                    </defs>


                    <path
                      d="
                        M 20 180
                        L 115 135
                        L 210 155
                        L 305 100
                        L 400 115
                        L 495 48
                        L 590 95
                        L 680 65
                        L 680 230
                        L 20 230
                        Z
                      "
                      fill="url(#bookingGradient)"
                    />


                    <polyline
                      points="
                        20,180
                        115,135
                        210,155
                        305,100
                        400,115
                        495,48
                        590,95
                        680,65
                      "
                      fill="none"
                      stroke="#4f7ff5"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />


                    <circle cx="20" cy="180" r="5" fill="#4f7ff5" />
                    <circle cx="115" cy="135" r="5" fill="#4f7ff5" />
                    <circle cx="210" cy="155" r="5" fill="#4f7ff5" />
                    <circle cx="305" cy="100" r="5" fill="#4f7ff5" />
                    <circle cx="400" cy="115" r="5" fill="#4f7ff5" />
                    <circle cx="495" cy="48" r="6" fill="#4f7ff5" />
                    <circle cx="590" cy="95" r="5" fill="#4f7ff5" />
                    <circle cx="680" cy="65" r="5" fill="#4f7ff5" />

                  </svg>


                  <div className="chart-tooltip">

                    <strong>12 Aug</strong>

                    <span>
                      <span className="tooltip-dot"></span>
                      Bookings: 580
                    </span>

                  </div>


                  <div className="chart-x-axis">
                    <span>8 Aug</span>
                    <span>9 Aug</span>
                    <span>10 Aug</span>
                    <span>11 Aug</span>
                    <span>12 Aug</span>
                    <span>13 Aug</span>
                    <span>14 Aug</span>
                  </div>

                </div>

              </div>

            </div>


            {/* REVENUE OVERVIEW */}

            <div className="super-admin-chart-card revenue-overview-card">

              <div className="super-admin-chart-header">

                <div className="chart-title">

                  <div className="chart-title-icon green">
                    <FaMoneyBillWave />
                  </div>

                  <div>
                    <h2>Revenue Overview</h2>
                    <p>Revenue distribution</p>
                  </div>

                </div>

                <select className="chart-select">
                  <option>This Month</option>
                  <option>This Year</option>
                </select>

              </div>


              <div className="revenue-content">

                <div className="revenue-donut">

                  <div className="revenue-donut-center">
                    <strong>₹24.8L</strong>
                    <span>Total Revenue</span>
                  </div>

                </div>


                <div className="revenue-legend">

                  <div className="revenue-legend-item">
                    <div>
                      <span className="legend-dot blue"></span>
                      <span>Room Bookings</span>
                    </div>
                    <strong>60%</strong>
                  </div>


                  <div className="revenue-legend-item">
                    <div>
                      <span className="legend-dot green"></span>
                      <span>Hotel Services</span>
                    </div>
                    <strong>25%</strong>
                  </div>


                  <div className="revenue-legend-item">
                    <div>
                      <span className="legend-dot orange"></span>
                      <span>Food &amp; Beverage</span>
                    </div>
                    <strong>10%</strong>
                  </div>


                  <div className="revenue-legend-item">
                    <div>
                      <span className="legend-dot purple"></span>
                      <span>Others</span>
                    </div>
                    <strong>5%</strong>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =====================================================
              BOTTOM SECTION
          ===================================================== */}

          <section className="super-admin-bottom-grid">


            {/* RECENT BOOKINGS */}

            <div className="super-admin-card recent-bookings-card">

              <div className="super-admin-card-header">

                <div>
                  <h2>Recent Bookings</h2>
                  <p>Latest hotel reservations</p>
                </div>

                <button className="super-admin-view-btn">
                  <span>View All</span>
                  <FaArrowRight />
                </button>

              </div>


              <div className="super-admin-table-wrapper">

                <table className="super-admin-table">

                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Check In</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>


                  <tbody>

                    <tr>

                      <td>

                        <div className="guest-cell">

                          <div className="guest-avatar blue">
                            RK
                          </div>

                          <div className="guest-info">
                            <strong>Rahul Kumar</strong>
                            <span>rahul.k@email.com</span>
                          </div>

                        </div>

                      </td>

                      <td>Deluxe Room</td>

                      <td>12 Aug 2026</td>

                      <td>₹8,500</td>

                      <td>
                        <span className="status confirmed">
                          <FaCheckCircle />
                          Confirmed
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>

                        <div className="guest-cell">

                          <div className="guest-avatar pink">
                            PS
                          </div>

                          <div className="guest-info">
                            <strong>Priya Sharma</strong>
                            <span>priya.s@email.com</span>
                          </div>

                        </div>

                      </td>

                      <td>Suite Room</td>

                      <td>14 Aug 2026</td>

                      <td>₹15,000</td>

                      <td>
                        <span className="status pending">
                          <FaClock />
                          Pending
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>

                        <div className="guest-cell">

                          <div className="guest-avatar green">
                            AR
                          </div>

                          <div className="guest-info">
                            <strong>Arjun Reddy</strong>
                            <span>arjun.r@email.com</span>
                          </div>

                        </div>

                      </td>

                      <td>Premium Room</td>

                      <td>16 Aug 2026</td>

                      <td>₹11,500</td>

                      <td>
                        <span className="status confirmed">
                          <FaCheckCircle />
                          Confirmed
                        </span>
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div className="super-admin-card quick-actions-card">

              <div className="super-admin-card-header">

                <div>
                  <h2>Quick Actions</h2>
                  <p>Manage your hotel quickly</p>
                </div>

              </div>


              <div className="quick-actions-grid">


                <button className="quick-action-item blue">

                  <div className="quick-action-icon">
                    <FaUserPlus />
                  </div>

                  <span>Add Administrator</span>

                </button>


                <button className="quick-action-item green">

                  <div className="quick-action-icon">
                    <FaBuilding />
                  </div>

                  <span>Add Hotel</span>

                </button>


                <button className="quick-action-item purple">

                  <div className="quick-action-icon">
                    <FaBed />
                  </div>

                  <span>Add Room</span>

                </button>


                <button className="quick-action-item orange">

                  <div className="quick-action-icon">
                    <FaClipboardList />
                  </div>

                  <span>View Bookings</span>

                </button>


                <button className="quick-action-item indigo">

                  <div className="quick-action-icon">
                    <FaChartLine />
                  </div>

                  <span>Generate Report</span>

                </button>


                <button className="quick-action-item gray">

                  <div className="quick-action-icon">
                    <FaCog />
                  </div>

                  <span>System Settings</span>

                </button>

              </div>

            </div>

          </section>


          {/* =====================================================
              SYSTEM STATUS
          ===================================================== */}

          <section className="super-admin-system-status">

            <div className="system-status-icon">
              <FaCheckCircle />
            </div>

            <div className="system-status-content">

              <strong>System Status</strong>

              <span>
                All hotel management services are operating normally.
              </span>

            </div>

            <div className="system-status-badge">
              <FaCheckCircle />
              <span>Operational</span>
            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default SuperAdminDashboard;